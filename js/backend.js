/* =====================================================================
   後端串接模組（獨立檔案，不依賴畫面程式）
   提供 window.DiscBackend，畫面程式只需要呼叫這裡的函式。
   設定（js/config.js）留空時 enabled = false，所有函式都不會連線。

   使用方式（畫面程式端）：
     await DiscBackend.init();                     // 頁面載入時呼叫一次
     DiscBackend.renderTurnstile(元素);             // 作答最後一步顯示機器人驗證
     const r = await DiscBackend.submit(st);        // 看結果時送出作答
     await DiscBackend.setRating(4);                // 「結果像你嗎？」
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
  const K_RETURN = 'disc-return-v1';    // 登入跳轉前暫存的作答狀態

  const enabled = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && CFG.turnstileSiteKey);
  let client = null, user = null, turnstileToken = null, turnstileWidget = null;
  const listeners = [];

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

  async function init() {
    if (!enabled) return null;
    await loadScript(SUPABASE_JS, SUPABASE_SRI);
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

  /* ---------- 機器人驗證（Cloudflare Turnstile） ---------- */
  async function renderTurnstile(el) {
    if (!enabled || !el) return;
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
  async function waitForToken(ms = 15000) {
    const start = Date.now();
    while (!turnstileToken && Date.now() - start < ms) await new Promise((r) => setTimeout(r, 200));
    return turnstileToken;
  }

  /* ---------- 送出作答 ---------- */
  // st：畫面程式的作答狀態 {seq, answers, times, info, blind}
  async function submit(st) {
    if (!enabled) return null;
    const token = await waitForToken();
    if (!token) throw new Error('機器人驗證未完成');
    const payload = {
      bank_version: BANK_VERSION,
      seq: st.seq,
      answers: st.answers,
      times: st.times,
      info: { age: (st.info && st.info.age) || '', gender: (st.info && st.info.gender) || '', job: (st.info && st.info.job) || '' },
      blind: st.blind || null,
      turnstile_token: token,
    };
    const { data, error } = await client.functions.invoke('submit', { body: payload });
    turnstileToken = null;                     // 驗證碼只能使用一次
    if (error) throw new Error('送出失敗');
    store.set(K_CLAIM, { id: data.id, token: data.token, at: Date.now() });
    return data;                               // {id, token, result}
  }

  async function setRating(rating) {
    const c = store.get(K_CLAIM);
    if (!enabled || !c) return false;
    const { data, error } = await client.rpc('set_rating', { p_id: c.id, p_token: c.token, p_rating: rating });
    return !error && data === true;
  }

  /* ---------- 會員 ---------- */
  async function signInWithGoogle(stateToRestore) {
    if (!enabled) return;
    if (stateToRestore) store.set(K_RETURN, stateToRestore);
    const redirectTo = location.origin + location.pathname;
    await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
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
      .select('id, created_at, bank_version, seq, answers, times, info, blind, result, rating')
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

  async function signOut() { if (enabled) await client.auth.signOut(); user = null; }

  window.DiscBackend = {
    enabled, init, renderTurnstile, submit, setRating,
    signInWithGoogle, claimPending, takeReturnState, listMyResults,
    getRetest, setRetest, deleteMyData, signOut,
    onAuthChange(fn) { listeners.push(fn); },
    get user() { return user; },
  };
})();
