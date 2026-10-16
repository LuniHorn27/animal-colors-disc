/* =====================================================================
   後端串接模組（獨立檔案，不依賴畫面程式）
   提供 window.DiscBackend，畫面程式只需要呼叫這裡的函式。
   設定（js/config.js）留空時 enabled = false，所有函式都不會連線。

   使用方式（畫面程式端）：
     await DiscBackend.init();                     // 需要登入功能時，頁面載入時呼叫一次
     await DiscBackend.checkClass('1029-A');        // 班級連結：開始作答前確認班級代碼
     DiscBackend.prepare();                         // 作答最後一步：在背景準備機器人驗證
     DiscBackend.queue(st);                         // 看結果時：放進待送出區並送出
     DiscBackend.flush();                           // 頁面載入時：補送上次沒送出的作答
     DiscBackend.onSync((sid, state) => {});         // 送出狀態：'sending' | 'sent' | 'pending' | 'rejected'
     DiscBackend.rate(st.sid, 4);                   // 「結果像你嗎？」
     await DiscBackend.signInWithGoogle(st);        // 保存結果（會跳轉到 Google）
     DiscBackend.user                               // 目前登入的會員（或 null）
     await DiscBackend.listMyResults();             // 我的歷次結果
     await DiscBackend.setRetest(true);             // 願意收到重測邀請
     await DiscBackend.deleteMyData();              // 刪除我的資料
     await DiscBackend.signOut();
   ===================================================================== */
(function () {
  'use strict';
  const CFG = window.DISC_CONFIG || {};
  const BANK_VERSION = 'v0.4';
  const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
  const SUPABASE_SRI = 'sha384-0w2KAL2YHP6wKOkUDzkCDGgVvfmHnj02DHeQ6XcHOgTfFsGyonKOpShMH1x6nk9o';
  const TURNSTILE_JS = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  const K_CLAIM = 'disc-claim-v1';      // 最近一次送出的 {id, token}
  const K_CLAIMS = 'disc-claims-v1';    // 每份作答（sid）送出後拿到的 {id, token}，評分用
  const K_OUTBOX = 'disc-outbox-v1';    // 待送出區：還沒成功送到伺服器的作答
  const K_RETURN = 'disc-return-v1';    // 登入跳轉前暫存的作答狀態
  const COHORT_RE = /^[A-Za-z0-9_-]{1,32}$/;
  const MAX_MS = 3600000;               // 伺服器接受的單題作答時間上限（1 小時）

  const enabled = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && CFG.turnstileSiteKey);
  let client = null, user = null, turnstileToken = null, turnstileWidget = null, flushing = null;
  const listeners = [], syncListeners = [];

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
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
    client.auth.onAuthStateChange((_event, session) => {
      user = session ? session.user : null;
      listeners.forEach((fn) => { try { fn(user); } catch (e) {} });
    });
    if (user) await claimPending();
    return user;
  }

  /* ---------- 班級代碼檢查（開始作答前） ---------- */
  // 回傳 {ok:true, name} 或 {ok:false, reason:'not_found'|'not_open'|'closed'}；
  // 連不上伺服器時丟出錯誤，畫面程式不擋使用者（送出時伺服器還會再檢查一次）
  async function checkClass(code) {
    if (!enabled || !COHORT_RE.test(code || '')) return null;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 8000);
    try {
      const res = await fetch(CFG.supabaseUrl + '/rest/v1/rpc/check_class', {
        method: 'POST', signal: ctl.signal,
        headers: { apikey: CFG.supabaseAnonKey, Authorization: 'Bearer ' + CFG.supabaseAnonKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_code: code }),
      });
      if (!res.ok) throw new Error('check_class ' + res.status);
      return await res.json();
    } finally { clearTimeout(timer); }
  }

  /* ---------- 機器人驗證（Cloudflare Turnstile） ---------- */
  // 驗證框放在畫面底部；通常完全看不到，必要時才會出現讓使用者點一下
  function turnstileBox() {
    let el = document.getElementById('ts-box');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ts-box';
      el.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:50';
      document.body.appendChild(el);
    }
    return el;
  }
  async function renderTurnstile(el) {
    if (!enabled) return;
    el = el || turnstileBox();
    if (!window.turnstile) await loadScript(TURNSTILE_JS);
    turnstileToken = null;
    if (turnstileWidget !== null) { try { window.turnstile.remove(turnstileWidget); } catch (e) {} }
    turnstileWidget = window.turnstile.render(el, {
      sitekey: CFG.turnstileSiteKey,
      appearance: 'interaction-only',          // 通常完全看不到，必要時才請使用者點一下
      language: 'zh-tw',
      callback: (t) => { turnstileToken = t; },
      'expired-callback': () => { turnstileToken = null; },
      'error-callback': () => { turnstileToken = null; },
    });
  }
  async function waitForToken(ms = 20000) {
    if (turnstileWidget === null) await renderTurnstile();
    const start = Date.now();
    while (!turnstileToken && Date.now() - start < ms) await new Promise((r) => setTimeout(r, 200));
    return turnstileToken;
  }
  // 驗證碼只能用一次；用掉後重新取得一組，給下一份作答使用
  function useToken() {
    const t = turnstileToken;
    turnstileToken = null;
    try { window.turnstile.reset(turnstileWidget); } catch (e) {}
    return t;
  }
  function prepare() { if (enabled && turnstileWidget === null) renderTurnstile().catch(() => {}); }

  /* ---------- 送出作答（待送出區） ---------- */
  // 作答完成時先放進待送出區（存在瀏覽器），成功送到伺服器才移除。
  // 網路中斷、關掉頁面、按「重新作答」都不會遺失，下次打開網頁會自動補送。
  const outbox = () => store.get(K_OUTBOX) || [];
  const setOutbox = (list) => store.set(K_OUTBOX, list);
  const emit = (sid, state) => syncListeners.forEach((fn) => { try { fn(sid, state); } catch (e) {} });

  function buildPayload(st) {
    const info = st.info || {};
    const name = (info.name || '').trim().slice(0, 40), email = (info.email || '').trim();
    const p = {
      sid: st.sid,                             // 號碼牌：重送時伺服器靠它辨認，不會多存一筆
      bank_version: BANK_VERSION,
      seq: st.seq,
      answers: st.answers,
      times: Object.fromEntries(st.seq.map((id) => [id, Math.min(MAX_MS, Math.max(0, Math.round((st.times || {})[id] || 0)))])),
      info: { age: info.age || '', gender: info.gender || '', edu: info.edu || '', job: info.job || '' },
      blind: st.blind || null,
      blind2: st.blind2 || null,
    };
    if (name || email) p.contact = { name, email };
    // 勾選「想進一步了解」才送；電話、LINE ID 可以是空字串
    if (info.followup) p.followup = { phone: info.followup.phone || '', line: info.followup.line || '' };
    if (st.cohort && COHORT_RE.test(st.cohort)) p.cohort = st.cohort;
    return p;
  }

  // st：畫面程式的作答狀態，需要有 sid（每份作答一個隨機編號）
  function queue(st) {
    if (!enabled || !st || !st.sid) return;
    const list = outbox().filter((x) => x.sid !== st.sid);
    list.push({ sid: st.sid, payload: buildPayload(st), rating: st.rating || null, at: Date.now() });
    setOutbox(list);
    return flush();
  }

  // 依序送出待送出區裡的作答；同一時間只會有一個 flush 在跑
  function flush() {
    if (!enabled) return Promise.resolve();
    if (!flushing) flushing = doFlush().finally(() => { flushing = null; });
    return flushing;
  }
  async function doFlush() {
    if (!outbox().length) return;
    await init();
    for (const item of outbox()) {
      emit(item.sid, 'sending');
      const token = await waitForToken();
      if (!token) { emit(item.sid, 'pending'); return; }
      const { data, error } = await client.functions.invoke('submit', {
        body: Object.assign({}, item.payload, { turnstile_token: useToken() }),
      });
      if (error) {
        const status = error.context && error.context.status;
        if (status === 400) {                  // 資料格式不被接受：重送也沒用，從待送出區移除
          setOutbox(outbox().filter((x) => x.sid !== item.sid));
          emit(item.sid, 'rejected');
          continue;
        }
        emit(item.sid, 'pending');             // 網路或伺服器問題：保留，下次再送
        return;
      }
      const latest = outbox().find((x) => x.sid === item.sid) || item;
      setOutbox(outbox().filter((x) => x.sid !== item.sid));
      const claim = { id: data.id, token: data.token, at: Date.now() };
      const claims = store.get(K_CLAIMS) || {};
      claims[item.sid] = claim;
      const keep = Object.entries(claims).sort((a, b) => b[1].at - a[1].at).slice(0, 10);
      store.set(K_CLAIMS, Object.fromEntries(keep));
      store.set(K_CLAIM, claim);
      if (latest.rating) await sendRating(claim, latest.rating);
      emit(item.sid, 'sent');
    }
  }

  // 「結果像你嗎？」：還在待送出區就一起送；已經送出就直接補上評分
  async function rate(sid, rating) {
    if (!enabled || !sid) return false;
    const list = outbox();
    const item = list.find((x) => x.sid === sid);
    if (item) { item.rating = rating; setOutbox(list); return true; }
    const claim = (store.get(K_CLAIMS) || {})[sid];
    if (!claim) return false;
    await init();
    return sendRating(claim, rating);
  }
  async function sendRating(claim, rating) {
    const { data, error } = await client.rpc('set_rating', { p_id: claim.id, p_token: claim.token, p_rating: rating });
    return !error && data === true;
  }
  const isQueued = (sid) => outbox().some((x) => x.sid === sid);

  /* ---------- 會員 ---------- */
  // 這個瀏覽器裡有沒有登入紀錄（或剛從 Google 登入回來）。沒有的話就不必載入登入程式
  function hasSession() {
    if (!enabled) return false;
    try {
      if (/[?&](code|error_description)=/.test(location.search)) return true;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf('sb-') === 0 && k.indexOf('-auth-token') > 0) return true;
      }
    } catch (e) {}
    return false;
  }
  async function signInWithGoogle(stateToRestore) {
    if (!enabled) return;
    await init();
    if (stateToRestore) store.set(K_RETURN, stateToRestore);
    const redirectTo = location.origin + location.pathname;
    const { error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    if (error) throw new Error('無法開始登入');
  }
  // 登入回來後，把剛剛那份作答歸到帳號
  async function claimPending() {
    const c = store.get(K_CLAIM);
    if (!enabled || !user || !c) return false;
    const { data, error } = await client.rpc('claim_response', { p_id: c.id, p_token: c.token });
    return !error && data === true;
  }
  // 登入跳轉前暫存的作答狀態（取用後即刪除）
  function takeReturnState() { const s = store.get(K_RETURN); store.del(K_RETURN); return s; }

  async function listMyResults() {
    if (!enabled || !user) return [];
    const { data, error } = await client.from('responses')
      .select('id, created_at, bank_version, seq, answers, times, info, blind, blind2, cohort, result, rating')
      .order('created_at', { ascending: false }).limit(50);
    if (error) throw new Error('讀取失敗');
    return data;
  }

  async function getRetest() {
    if (!enabled || !user) return false;
    const { data } = await client.from('members').select('retest_ok').eq('user_id', user.id).maybeSingle();
    return !!(data && data.retest_ok);
  }
  async function setRetest(ok) {
    if (!enabled || !user) return false;
    const { error } = await client.from('members').upsert({ user_id: user.id, retest_ok: !!ok }, { onConflict: 'user_id' });
    return !error;
  }

  async function deleteMyData() {
    if (!enabled || !user) return 0;
    const { data, error } = await client.rpc('delete_my_data');
    if (error) throw new Error('刪除失敗');
    store.del(K_CLAIM);
    return data;
  }

  // 刪除自己的某一次結果（id＝listMyResults 回傳的 id），回傳刪掉幾筆（0 或 1）
  async function deleteMyResult(id) {
    if (!enabled || !user) return 0;
    const { data, error } = await client.rpc('delete_my_result', { p_id: id });
    if (error) throw new Error('刪除失敗');
    const c = store.get(K_CLAIM);
    if (c && c.id === id) store.del(K_CLAIM);
    return data;
  }

  async function signOut() { if (enabled) await client.auth.signOut(); user = null; }

  window.DiscBackend = {
    enabled, init, checkClass, prepare, renderTurnstile, queue, flush, rate, isQueued,
    hasSession, signInWithGoogle, claimPending, takeReturnState, listMyResults,
    getRetest, setRetest, deleteMyData, deleteMyResult, signOut,
    onAuthChange(fn) { listeners.push(fn); },
    onSync(fn) { syncListeners.push(fn); },
    get user() { return user; },
  };
})();
