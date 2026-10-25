/* =====================================================================
   他評「換個角度看自己」的後端串接模組（peer.html 使用）
   提供 window.PeerBackend；不修改、也不依賴共用的 js/backend.js，
   但沿用同一份設定（js/config.js）、同版本的 supabase-js 與 Turnstile。
   登入狀態和主測驗共用（同一個網站、同一個 Supabase 用戶端儲存位置）。

   使用方式：
     await PeerBackend.init();
     PeerBackend.latestClaim()                     // 最近一次主測驗的 {id, token}
     await PeerBackend.createInvite('小安', 作答id)  // {code, ownerToken} 或 null；作答 id 可省略（最近一次）
     await PeerBackend.getInvite(code)              // {nickname, isOpen} 或 null
     PeerBackend.prepareBot()                       // 作答時在背景準備機器人驗證
     await PeerBackend.submitRating({sid, code, relation, name, seq, picks, times, lang})  // lang：zh-TW／en／mixed，可省略
     await PeerBackend.getResults(code, ownerToken) // 對照結果或 null
     await PeerBackend.setOpen(code, ownerToken, true|false)
     await PeerBackend.getMyInvites()               // 登入者自己的邀請
   ===================================================================== */
(function () {
  'use strict';

  const CODE_RE = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{10}$/;
  const TOKEN_RE = /^[0-9a-f]{64}$/;
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  // 送出失敗後的重試間隔：約 3、8、20 秒，各加 0–50% 隨機，避免很多人同時重送
  function retryDelays(rand = Math.random) {
    return [3, 8, 20].map((s) => s * 1000 * (1 + rand() * 0.5));
  }

  // #r=邀請碼 → 評的人；#k=邀請碼.專屬碼（已登入時可以只有邀請碼）→ 邀請人；
  // #from=作答 id → 替某一次結果產生邀請（主測驗結果頁、我的歷次結果的入口）；其他 → 邀請頁
  function parseHash(hash) {
    const h = String(hash || '').replace(/^#/, '');
    const f = /^from=([0-9a-f-]+)$/.exec(h);
    if (f && UUID_RE.test(f[1])) return { mode: 'invite', from: f[1] };
    let m = /^r=([^.&]+)$/.exec(h);
    if (m && CODE_RE.test(m[1])) return { mode: 'rate', code: m[1] };
    m = /^k=([^.&]+)(?:\.([^.&]+))?$/.exec(h);
    if (m && CODE_RE.test(m[1]) && (m[2] === undefined || TOKEN_RE.test(m[2]))) {
      return { mode: 'owner', code: m[1], token: m[2] === undefined ? null : m[2] };
    }
    return { mode: 'invite' };
  }

  // 收件窗口的 HTTP 狀態 → 畫面要顯示的狀況；network 代表可以重試。
  // 只有 400（格式不被接受）不重試；403 多半是機器人驗證暫時失敗（例如 Cloudflare 異常），換一組驗證碼再試
  function errorFor(status) {
    if (status === 410) return 'closed';
    if (status === 404) return 'not_found';
    if (status === 400) return 'invalid';
    return 'network';
  }

  // 要替哪一份作答產生邀請、出示哪一張領取憑證：
  // 指定作答時，從「每份作答的憑證」裡找；找不到就只有 id（要靠登入的帳號證明是本人）；沒指定就用最近一次
  function claimFor(responseId, claims, latest) {
    if (!responseId) return latest || null;
    const hit = Object.values(claims || {}).find((c) => c && c.id === responseId);
    if (hit) return { id: hit.id, token: hit.token };
    if (latest && latest.id === responseId) return { id: latest.id, token: latest.token };
    return { id: responseId, token: null };
  }

  function newSid() {
    if (globalThis.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  const pure = { retryDelays, parseHash, errorFor, newSid, claimFor };
  if (typeof window === 'undefined') { module.exports = pure; return; }

  // ---------- 以下只在瀏覽器執行 ----------
  const CFG = window.DISC_CONFIG || {};
  const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
  const SUPABASE_SRI = 'sha384-0w2KAL2YHP6wKOkUDzkCDGgVvfmHnj02DHeQ6XcHOgTfFsGyonKOpShMH1x6nk9o';
  const TURNSTILE_JS = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  const K_CLAIM = 'disc-claim-v1';        // 主測驗：最近一次送出的 {id, token}
  const K_CLAIMS = 'disc-claims-v1';      // 主測驗：每份作答（號碼牌）送出後拿到的 {id, token}
  const K_OWNER = 'disc-peer-v1';         // 邀請人：{code, ownerToken, nickname}
  const K_RATED = 'disc-peer-rated-v1';   // 評的人：{邀請碼: {sid, ref, scores, result}}
  const enabled = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && CFG.turnstileSiteKey);
  let client = null, user = null, tsToken = null, tsWidget = null;
  const listeners = [];

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };

  function loadScript(src, integrity) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      if (integrity) { s.integrity = integrity; s.crossOrigin = 'anonymous'; }
      s.onload = resolve; s.onerror = () => reject(new Error('無法載入 ' + src));
      document.head.appendChild(s);
    });
  }

  let initing = null;
  function init() {
    if (!enabled) return Promise.resolve(null);
    if (!initing) initing = doInit().catch((e) => { initing = null; throw e; });
    return initing;
  }
  async function doInit() {
    if (!window.supabase) await loadScript(SUPABASE_JS, SUPABASE_SRI);
    client = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
    });
    const { data } = await client.auth.getSession();
    user = data.session ? data.session.user : null;
    client.auth.onAuthStateChange((_e, session) => {
      user = session ? session.user : null;
      listeners.forEach((fn) => { try { fn(user); } catch (e) {} });
    });
    if (user) await claimLatest();
    return user;
  }

  // 登入後，把這個瀏覽器最近一次的主測驗歸到帳號（和主測驗頁的做法相同）
  async function claimLatest() {
    const c = latestClaim();
    if (!user || !c) return false;
    const { data, error } = await client.rpc('claim_response', { p_id: c.id, p_token: c.token });
    return !error && data === true;
  }

  // 某一份作答在這個瀏覽器的領取憑證（沒有時 token 是 null）
  function resultClaim(responseId) { return claimFor(responseId, store.get(K_CLAIMS), latestClaim()); }

  function latestClaim() {
    const c = store.get(K_CLAIM);
    return c && typeof c.id === 'string' && typeof c.token === 'string' ? c : null;
  }

  async function rpc(name, args) {
    await init();
    const { data, error } = await client.rpc(name, args);
    if (error) throw new Error(name + ' 失敗');
    return data;
  }

  async function createInvite(nickname, responseId = null) {
    if (!enabled) return null;
    await init();
    const c = claimFor(responseId, store.get(K_CLAIMS), latestClaim());
    let rid = c ? c.id : null;
    if (!rid && user) {
      const { data } = await client.from('responses').select('id').order('created_at', { ascending: false }).limit(1);
      rid = data && data[0] ? data[0].id : null;
    }
    if (!rid) return null;
    const out = await rpc('create_peer_invite', { p_response_id: rid, p_claim_token: c ? c.token : null, p_nickname: nickname });
    if (!out) return null;
    const rec = { code: out.code, ownerToken: out.owner_token, nickname: String(nickname).trim(), responseId: rid };
    saveOwner(rec);
    return { code: rec.code, ownerToken: rec.ownerToken };
  }

  async function getInvite(code) {
    if (!enabled) return null;
    const out = await rpc('get_peer_invite', { p_code: code });
    return out ? { nickname: out.nickname, isOpen: out.is_open } : null;
  }

  async function getResults(code, ownerToken) {
    if (!enabled) return null;
    return rpc('get_peer_results', { p_code: code, p_owner_token: ownerToken || null });
  }

  async function setOpen(code, ownerToken, open) {
    if (!enabled) return false;
    return (await rpc('set_peer_invite_open', { p_code: code, p_owner_token: ownerToken || null, p_open: !!open })) === true;
  }

  async function getMyInvites() {
    if (!enabled) return [];
    await init();
    if (!user) return [];
    return (await rpc('get_my_peer_invites', {})) || [];
  }

  // ---------- 機器人驗證（Cloudflare Turnstile） ----------
  function tsBox() {
    let el = document.getElementById('ts-box');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ts-box';
      el.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:50';
      document.body.appendChild(el);
    }
    return el;
  }
  async function renderBot() {
    if (!window.turnstile) await loadScript(TURNSTILE_JS);
    tsToken = null;
    if (tsWidget !== null) { try { window.turnstile.remove(tsWidget); } catch (e) {} }
    tsWidget = window.turnstile.render(tsBox(), {
      sitekey: CFG.turnstileSiteKey,
      appearance: 'interaction-only',
      language: 'zh-tw',
      callback: (t) => { tsToken = t; },
      'expired-callback': () => { tsToken = null; },
      'error-callback': () => { tsToken = null; },
    });
  }
  function prepareBot() { if (enabled && tsWidget === null) renderBot().catch(() => {}); }
  async function takeToken(ms = 20000) {
    if (tsWidget === null) await renderBot();
    const start = Date.now();
    while (!tsToken && Date.now() - start < ms) await new Promise((r) => setTimeout(r, 200));
    const t = tsToken;
    tsToken = null;
    try { window.turnstile.reset(tsWidget); } catch (e) {}   // 驗證碼只能用一次
    return t;
  }

  // ---------- 送出評價 ----------
  // 同一次作答的重試共用同一個號碼牌，伺服器會辨認重送，不會存兩筆。
  // 畫面要在作答開始時產生 sid 傳進來：自動重試都失敗後使用者再按送出，也還是同一個號碼牌
  async function submitRating({ sid, code, relation, relationNote = null, name, seq, picks, times, lang = null }) {
    if (!enabled) return { ok: false, error: 'network' };
    sid = sid || newSid();
    const delays = retryDelays();
    for (let attempt = 0; ; attempt++) {
      let status = 0, body = null;
      try {
        const token = await takeToken();
        if (token) {
          const res = await fetch(CFG.supabaseUrl + '/functions/v1/peer-submit', {
            method: 'POST',
            headers: { apikey: CFG.supabaseAnonKey, Authorization: 'Bearer ' + CFG.supabaseAnonKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, sid, relation, relationNote, name, seq, picks, times, lang, turnstile_token: token }),
          });
          status = res.status;
          body = await res.json().catch(() => null);
        }
      } catch (e) { status = 0; }
      if (status === 200 && body && body.id) {
        const rec = { sid, ref: body.ref, scores: body.scores, result: body.result };
        saveRated(code, rec);
        return Object.assign({ ok: true, id: body.id }, rec);
      }
      const err = errorFor(status);
      if (err !== 'network' || attempt >= delays.length) return { ok: false, error: err };
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }

  // ---------- 登入 ----------
  async function signInWithGoogle() {
    if (!enabled) return;
    await init();
    // 不帶 # 後面的內容：專屬碼不能交給登入服務；登入回來後用帳號找自己的邀請
    const redirectTo = location.origin + location.pathname;
    const { error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    if (error) throw new Error('無法開始登入');
  }

  // 登出（主測驗頁和這頁共用同一個登入）
  async function signOut() { if (client) await client.auth.signOut(); user = null; }

  // ---------- 瀏覽器儲存 ----------
  function saveOwner(rec) { store.set(K_OWNER, rec); }
  function loadOwner() { return store.get(K_OWNER); }
  function saveRated(code, rec) { const all = store.get(K_RATED) || {}; all[code] = rec; store.set(K_RATED, all); }
  function loadRated(code) { const all = store.get(K_RATED) || {}; return all[code] || null; }

  window.PeerBackend = Object.assign({}, pure, {
    enabled, init, latestClaim, resultClaim, createInvite, getInvite, prepareBot, submitRating, getResults, setOpen,
    getMyInvites, signInWithGoogle, signOut, saveOwner, loadOwner, saveRated, loadRated,
    onAuthChange(fn) { listeners.push(fn); },
  });
  // 登入狀態要隨時讀到最新的（Object.assign 只會複製當下的值，所以另外定義成 getter）
  Object.defineProperty(window.PeerBackend, 'user', { get() { return user; }, enumerable: true, configurable: true });
})();
