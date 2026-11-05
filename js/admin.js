/* 管理後台。真正的權限在資料庫函式（每個函式都先檢查管理者），這裡只負責畫面。
   學生填的文字一律用 textContent 放進畫面（h() 不會解析 HTML）。 */
(function () {
  'use strict';
  const cfg = window.DISC_CONFIG || {};
  const X = window.DISC_ADMIN_EXPORT;
  const CDN = 'https://cdn.jsdelivr.net/npm/';
  const LIB = {
    supabase: [CDN + '@supabase/supabase-js@2.45.4/dist/umd/supabase.js', 'sha384-0w2KAL2YHP6wKOkUDzkCDGgVvfmHnj02DHeQ6XcHOgTfFsGyonKOpShMH1x6nk9o'],
    ExcelJS: [CDN + 'exceljs@4.4.0/dist/exceljs.min.js', 'sha384-Pqp51FUN2/qzfxZxBCtF0stpc9ONI6MYZpVqmo8m20SoaQCzf+arZvACkLkirlPz'],
    JSZip: [CDN + 'jszip@3.10.1/dist/jszip.min.js', 'sha384-+mbV2IY1Zk/X1p/nWllGySJSUN8uMs+gUAN10Or95UBH0fpj6GfKgPmgC5EXieXG'],
    qrcode: [CDN + 'qrcode-generator@1.4.4/qrcode.js', 'sha384-8FWZA6BGMXhsfO+BLtrJK0We6gg5o1JyO8xQm6peWDEUs17ACA5ziE/NIAkl9z2k'],
  };
  const root = document.getElementById('root');
  let sb = null;

  function blank() {
    return {
      view: 'loading', email: '', notice: '', tab: 'classes',
      classes: null, classesErr: '',
      create: { open: false }, created: null,
      ui: {}, all: {},
      fu: { list: null, filter: 'todo', ui: {}, err: '' },
      del: { q: '', results: null, ui: {}, done: '', err: '', busy: false },
    };
  }
  let S = blank();

  /* ---------- 小工具 ---------- */
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'fk') el.dataset.fk = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k in el) el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat(Infinity)) {
      if (c === null || c === undefined || c === false) continue;
      el.append(c.nodeType ? c : String(c));
    }
    return el;
  }
  const btn = (label, onclick, cls, more) => h('button', Object.assign({ type: 'button', class: 'btn ' + (cls || ''), onclick }, more || {}), label);
  const status = (text, cls) => text ? h('p', { class: cls || 'ok', role: cls === 'err' ? 'alert' : 'status' }, text) : null;

  /* 重畫整頁，保留輸入焦點和游標位置 */
  function draw(focusKey) {
    const a = document.activeElement;
    const key = focusKey || (a && a.dataset && a.dataset.fk);
    let sel = null;
    try { if (!focusKey && a && a.selectionStart !== null && a.selectionStart !== undefined) sel = [a.selectionStart, a.selectionEnd]; } catch (e) {}
    root.replaceChildren(view());
    if (!key) return;
    const n = root.querySelector(`[data-fk="${CSS.escape(key)}"]`);
    if (!n) return;
    n.focus();
    try { if (sel) n.setSelectionRange(sel[0], sel[1]); } catch (e) {}
  }

  function loadLib(name) {
    if (window[name]) return Promise.resolve(window[name]);
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = LIB[name][0]; s.integrity = LIB[name][1]; s.crossOrigin = 'anonymous'; s.async = true;
      s.onload = () => resolve(window[name]);
      s.onerror = () => reject(new Error('lib_failed'));
      document.head.appendChild(s);
    });
  }

  const ERR = {
    bad_code: '代碼只能用英文、數字、- 和 _，最多 32 字。',
    bad_name: '班級名稱要 1 到 60 字。',
    bad_time: '請選現在之後的時間。',
    code_taken: '這個代碼用過了，換一個。',
    not_found: '找不到這筆資料，可能已被刪除。請重新整理頁面。',
    before_open: '關閉時間不能早於這班的開放時間，請選晚一點的時間。',
    class_closed: '這班已關閉，請先改期限。',
    note_too_long: '備註最多 500 字。',
    bad_query: '請輸入 1 到 60 字的名字或 Email。',
    confirm_mismatch: '輸入的內容和資料不同，請再確認一次。',
    lib_failed: '工具載入失敗，請檢查網路後再試一次。',
    template_failed: '匯出範本載入失敗，請再試一次。',
  };
  function errText(e) {
    const m = String((e && e.message) || e || '');
    for (const k of Object.keys(ERR)) if (m.includes(k)) return ERR[k];
    if (/fetch|network|load failed/i.test(m)) return '連不上資料庫，請再試一次。';
    return '沒有成功，請再試一次。';
  }

  async function rpc(fn, args) {
    const { data, error } = await sb.rpc(fn, args || {});
    if (!error) return data;
    const m = String(error.message || '');
    if (m.includes('not_admin')) { S = Object.assign(blank(), { view: 'denied', email: S.email }); draw(); error.handled = true; }
    else if (error.code === 'PGRST301' || /jwt|permission denied for function/i.test(m)) {
      S = Object.assign(blank(), { view: 'login', notice: '登入已過期，請再登入一次。' }); draw(); error.handled = true;
    }
    throw error;
  }

  /* 時間：畫面和輸入都用台灣時間 */
  const pad = (n) => String(n).padStart(2, '0');
  const today = () => X.taipeiParts(new Date()).date;
  function addDays(ymd, n) {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
  }
  const toTs = (date, time) => `${date}T${time}:00+08:00`;
  function fmt(iso) {
    if (!iso) return '';
    const p = X.taipeiParts(new Date(iso));
    return `${p.date.replace(/-/g, '/')} ${p.time}`;
  }
  function classState(c) {
    const now = Date.now();
    if (c.opens_at && new Date(c.opens_at).getTime() > now) return 'future';
    if (c.closes_at && new Date(c.closes_at).getTime() <= now) return 'closed';
    return 'open';
  }
  const STATE_TEXT = { open: '開放中', closed: '已關閉', future: '尚未開放' };
  const studentLink = (code) => `${location.origin}/?c=${encodeURIComponent(code)}`;
  const statsLink = (token) => `${location.origin}/teacher#k=${token}`;

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
    const t = h('textarea', { value: text, readOnly: true });
    document.body.append(t); t.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    t.remove();
    return ok;
  }
  function saveFile(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  function field(label, id, attrs, err, hint) {
    return h('div', { class: 'field' },
      h('label', { htmlFor: id }, label),
      h('input', Object.assign({ id, fk: id, class: 'input', 'aria-invalid': err ? 'true' : null }, attrs)),
      hint ? h('p', { class: 'hint' }, hint) : null,
      err ? h('p', { class: 'field-err', 'data-err': id }, err) : null);
  }
  function clearErr(id) {
    const e = root.querySelector(`[data-err="${id}"]`);
    if (e) e.remove();
    const i = document.getElementById(id);
    if (i) i.removeAttribute('aria-invalid');
  }
  /* 顯示過的統計表連結只有這一次，離開前提醒 */
  window.addEventListener('beforeunload', (ev) => {
    if (S.created || Object.values(S.ui).some((u) => u.token)) { ev.preventDefault(); ev.returnValue = ''; }
  });

  /* ---------- 登入 ---------- */
  async function signIn() {
    S.notice = '';
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: location.origin + location.pathname, queryParams: { prompt: 'select_account' } },
    });
    if (error) { S.notice = '沒辦法開始登入，請再試一次。'; draw(); }
  }
  async function signOut() {
    try { await sb.auth.signOut({ scope: 'local' }); } catch (e) {}
    S = Object.assign(blank(), { view: 'login' });
    draw();
  }
  function loginView() {
    return h('main', null, h('div', { class: 'card login' },
      h('img', { src: 'brand/logo-mark.svg', alt: '' }),
      h('h1', null, '管理後台'),
      S.notice ? h('p', { class: 'warn', role: 'status' }, S.notice) : h('p', null, '只有管理者可以登入。'),
      btn('用 Google 登入', signIn, 'primary', { fk: 'signin' })));
  }
  function deniedView() {
    return h('main', null, h('div', { class: 'card login' },
      h('img', { src: 'brand/logo-mark.svg', alt: '' }),
      h('h1', null, '這個帳號沒有管理權限'),
      S.email ? h('p', { class: 'ok' }, S.email) : null,
      btn('登出，換帳號', signOut, 'primary', { fk: 'signout' })));
  }
  function failView() {
    return h('main', null, h('div', { class: 'card login' },
      h('h1', null, '後台沒有載入成功'),
      h('p', null, '請檢查網路後再試一次。'),
      btn('重新載入', () => location.reload(), 'primary')));
  }

  /* ---------- 共用外框 ---------- */
  function shell(body) {
    const tab = (id, label) => h('button', {
      type: 'button', class: 'tab', fk: 'tab-' + id, 'aria-current': S.tab === id ? 'page' : null,
      onclick: () => openTab(id),
    }, label);
    return [
      h('header', { class: 'site-bar' }, h('div', { class: 'bar-in' },
        h('img', { src: 'brand/logo-mark.svg', alt: '' }), h('span', null, '管理後台'), h('span', { class: 'sp' }),
        btn('登出', signOut, 'quiet', { fk: 'signout' }))),
      h('nav', { class: 'tabs', 'aria-label': '後台功能' }, h('div', { class: 'tabs-in' },
        tab('classes', '班級'), tab('followups', '聯絡名單'), tab('delete', '刪除資料'))),
      h('main', null, body),
    ];
  }
  function openTab(id) {
    S.tab = id;
    draw();
    if (id === 'followups' && !S.fu.list) loadFollowups();
  }

  /* ---------- 班級 ---------- */
  async function loadClasses() {
    try {
      S.classes = await rpc('admin_classes');
      S.classesErr = '';
    } catch (e) {
      if (e.handled) return;
      S.classesErr = errText(e);
    }
    draw();
  }
  function uiOf(id) { return S.ui[id] || (S.ui[id] = {}); }

  function classesView() {
    if (S.classesErr && !S.classes) {
      return h('div', { class: 'card empty' }, status(S.classesErr, 'err'), btn('再試一次', () => { S.classesErr = ''; draw(); loadClasses(); }, 'primary'));
    }
    if (!S.classes) return h('p', { role: 'status' }, '正在載入班級…');
    const list = S.classes.slice().sort((a, b) => (classState(a) === 'closed') - (classState(b) === 'closed'));
    const real = S.classes.filter((c) => !c.is_test);
    const sum = (k) => real.reduce((t, c) => t + Number(c[k] || 0), 0);
    return [
      h('div', { class: 'tiles' },
        tile(real.filter((c) => classState(c) === 'open').length, '開放中班級'),
        tile(sum('people'), '累計人數'),
        tile(sum('today'), '今天作答')),
      real.length !== S.classes.length ? h('p', { class: 'note' }, '上面的數字不含測試班級。') : null,
      h('div', { class: 'btn-row' },
        btn('建立新班級', toggleCreate, 'primary', { fk: 'create-toggle', 'aria-expanded': S.create.open ? 'true' : 'false' }),
        S.classes.length ? btn(S.all.busy ? S.all.progress || '正在匯出…' : '匯出全部 Excel', exportAll, '', { fk: 'export-all', disabled: S.all.busy }) : null),
      status(S.all.ok), status(S.all.err, 'err'),
      S.created ? createdPanel() : null,
      S.create.open ? createForm() : null,
      list.length ? list.map(classCard) : h('div', { class: 'card empty' }, h('p', null, '還沒有班級。按「建立新班級」開始。')),
    ];
  }
  const tile = (n, label) => h('div', { class: 'tile' }, h('b', null, n), h('span', null, label));

  /* 建立班級 */
  function newCode() {
    const abc = 'abcdefghjkmnpqrstuvwxyz23456789';
    const r = crypto.getRandomValues(new Uint8Array(5));
    const t = today();
    return `${t.slice(5, 7)}${t.slice(8, 10)}-${Array.from(r, (b) => abc[b % abc.length]).join('')}`;
  }
  function toggleCreate() {
    if (S.create.open) { S.create = { open: false }; draw('create-toggle'); return; }
    S.create = { open: true, name: '', code: newCode(), date: addDays(today(), 30), err: {} };
    S.created = null;
    draw('new-name');
  }
  function checkCreate(k) {
    const c = S.create, v = { name: c.name.trim(), code: c.code.trim() };
    if (k === 'name') return v.name ? '' : '請輸入班級名稱。';
    if (k === 'code') {
      if (!/^[A-Za-z0-9_-]{1,32}$/.test(v.code)) return '只能用英文、數字、- 和 _，最多 32 字。';
      if ((S.classes || []).some((x) => x.code.toLowerCase() === v.code.toLowerCase())) return '這個代碼用過了，換一個。';
      return '';
    }
    if (!c.date) return '請選日期。';
    if (new Date(toTs(c.date, '23:59')).getTime() <= Date.now()) return '這個日期已過，請選今天或之後。';
    return '';
  }
  function createForm() {
    const c = S.create;
    const bind = (k) => ({
      value: c[k],
      oninput: (e) => { c[k] = e.target.value; if (c.err[k]) { delete c.err[k]; clearErr('new-' + k); } },
      /* 離開欄位時只補上錯誤文字，不重畫：重畫會讓正要按的按鈕被換掉、點擊失效 */
      onblur: () => {
        if (!c[k]) return; // 還沒填不催，送出時才提醒
        const m = checkCreate(k);
        if (!m || m === c.err[k]) return;
        c.err[k] = m;
        clearErr('new-' + k);
        const input = document.getElementById('new-' + k);
        if (!input) return;
        input.setAttribute('aria-invalid', 'true');
        input.closest('.field').append(h('p', { class: 'field-err', 'data-err': 'new-' + k }, m));
      },
    });
    return h('form', { class: 'card', noValidate: true, onsubmit: (e) => { e.preventDefault(); submitCreate(); } },
      h('h2', null, '建立新班級'),
      field('班級名稱', 'new-name', Object.assign(bind('name'), { maxLength: 60, autocomplete: 'off' }), c.err.name),
      field('連結代碼', 'new-code', Object.assign(bind('code'), { maxLength: 32, autocomplete: 'off', autocapitalize: 'off' }), c.err.code, '會出現在學生連結裡，可以改。'),
      field('開放到', 'new-date', Object.assign(bind('date'), { type: 'date', min: today() }), c.err.date, '當天 23:59 關閉。學生連結和統計表用同一個期限。'),
      status(c.fail, 'err'),
      h('div', { class: 'btn-row' },
        h('button', { type: 'submit', class: 'btn primary', fk: 'new-submit', disabled: c.busy }, c.busy ? '正在建立…' : '建立班級'),
        btn('取消', toggleCreate, 'quiet', { disabled: c.busy })));
  }
  async function submitCreate() {
    const c = S.create;
    c.err = {}; c.fail = '';
    for (const k of ['name', 'code', 'date']) { const m = checkCreate(k); if (m) c.err[k] = m; }
    const first = ['name', 'code', 'date'].find((k) => c.err[k]);
    if (first) { draw('new-' + first); return; }
    c.busy = true; draw();
    try {
      const r = await rpc('admin_create_class', { p_code: c.code.trim(), p_name: c.name.trim(), p_closes_at: toTs(c.date, '23:59') });
      S.created = { code: r.code, name: c.name.trim(), token: r.token, msg: '' };
      S.create = { open: false };
      draw('created-copy');
      loadClasses();
    } catch (e) {
      if (e.handled) return;
      c.busy = false;
      const m = String(e.message || '');
      if (m.includes('code_taken') || m.includes('bad_code')) { c.err.code = errText(e); draw('new-code'); }
      else if (m.includes('bad_name')) { c.err.name = errText(e); draw('new-name'); }
      else if (m.includes('bad_time')) { c.err.date = errText(e); draw('new-date'); }
      else { c.fail = errText(e); draw(); }
    }
  }
  function linkBox(label, url) {
    return h('div', { class: 'linkbox' }, h('span', { class: 'label' }, label), h('code', null, url));
  }
  function createdPanel() {
    const c = S.created, a = studentLink(c.code), b = statsLink(c.token);
    return h('div', { class: 'card' },
      h('h2', null, `「${c.name}」建立好了`),
      h('p', { class: 'warn', role: 'status' }, '統計表連結只顯示這一次，請先複製。'),
      linkBox('學生連結', a),
      linkBox('講師統計表', b),
      status(c.msg),
      h('div', { class: 'btn-row' },
        btn('複製兩個連結', async () => {
          c.msg = await copyText(`學生連結：${a}\n講師統計表：${b}`) ? '已複製兩個連結。' : '沒有複製成功，請手動選取上面的連結。';
          draw();
        }, 'primary', { fk: 'created-copy' }),
        btn('我已複製，關閉', () => { S.created = null; draw('create-toggle'); }, 'quiet')));
  }

  /* 班級卡片 */
  function classCard(c) {
    const u = uiOf(c.id), st = classState(c);
    const panelBtn = (key, label, open) => btn(label, () => {
      u.msg = ''; u.err = '';
      if (u.panel === key) { u.panel = null; draw(`${key}-${c.id}`); return; }
      if (u.token) u.token = null;
      u.panel = key;
      if (open) open();
      draw(`${key}-${c.id}`);
    }, '', { fk: `${key}-${c.id}`, 'aria-expanded': u.panel === key ? 'true' : 'false' });
    const statsDiff = c.closes_at && c.stats_expires_at && Math.abs(new Date(c.closes_at) - new Date(c.stats_expires_at)) > 60000;
    return h('article', { class: 'card' },
      h('div', { class: 'head-row' },
        h('h2', null, c.name),
        h('span', { class: 'badge ' + st }, STATE_TEXT[st]),
        c.is_test ? h('span', { class: 'badge test' }, '測試') : null),
      h('div', { class: 'tiles' }, tile(c.people, '使用人數'), tile(c.responses, '作答份數'), tile(c.today, '今天作答')),
      h('dl', { class: 'rows' },
        h('dt', null, '連結代碼'), h('dd', null, c.code),
        h('dt', null, '開放到'), h('dd', null, c.closes_at ? fmt(c.closes_at) : '不限期'),
        statsDiff ? [h('dt', null, '統計表到'), h('dd', null, fmt(c.stats_expires_at))] : null,
        !c.stats_expires_at ? [h('dt', null, '統計表'), h('dd', null, '目前沒有可用的連結')] : null,
        h('dt', null, '最後作答'), h('dd', null, c.last_at ? fmt(c.last_at) : '還沒有人作答')),
      h('div', { class: 'btn-row' },
        btn('複製學生連結', async () => {
          u.err = ''; u.msg = await copyText(studentLink(c.code)) ? '已複製學生連結。' : '沒有複製成功，請再試一次。';
          draw();
        }, 'primary', { fk: `copy-${c.id}` }),
        panelBtn('qr', '顯示 QR code', () => makeQr(c)),
        btn(u.exporting ? '正在匯出…' : '匯出 Excel', () => exportOne(c), '', { fk: `export-${c.id}`, disabled: u.exporting }),
        panelBtn('deadline', '改期限', () => initDeadline(c)),
        panelBtn('regen', '重新產生統計表連結')),
      status(u.msg), status(u.err, 'err'),
      u.panel === 'qr' ? qrPanel(c, u) : null,
      u.panel === 'deadline' ? deadlinePanel(c, u) : null,
      u.panel === 'regen' ? regenPanel(c, u) : null,
      u.token ? tokenPanel(c, u) : null);
  }

  /* QR code */
  async function makeQr(c) {
    const u = uiOf(c.id);
    if (u.qr) return;
    try {
      const qrcode = await loadLib('qrcode');
      const q = qrcode(0, 'M');
      q.addData(studentLink(c.code));
      q.make();
      const n = q.getModuleCount(), quiet = 4, scale = Math.ceil(800 / (n + quiet * 2));
      const size = (n + quiet * 2) * scale;
      const cv = h('canvas', { width: size, height: size });
      const g = cv.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, size, size);
      g.fillStyle = '#000';
      for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) {
        if (q.isDark(r, k)) g.fillRect((k + quiet) * scale, (r + quiet) * scale, scale, scale);
      }
      u.qr = cv.toDataURL('image/png');
    } catch (e) {
      u.panel = null; u.err = errText(e);
    }
    draw();
  }
  function qrPanel(c, u) {
    if (!u.qr) return h('div', { class: 'panel' }, h('p', { role: 'status' }, '正在產生 QR code…'));
    return h('div', { class: 'panel qr' },
      h('img', { src: u.qr, alt: `${c.name}的學生連結 QR code`, width: 240, height: 240 }),
      h('a', { class: 'btn', href: u.qr, download: `${c.code}_QRcode.png` }, '下載 QR code'));
  }

  /* 改期限 */
  function initDeadline(c) {
    const u = uiOf(c.id);
    const p = c.closes_at ? X.taipeiParts(new Date(c.closes_at)) : { date: addDays(today(), 30), time: '23:59' };
    u.date = p.date; u.time = p.time;
  }
  function bump(c, days) {
    const u = uiOf(c.id), now = new Date(), cur = c.closes_at ? new Date(c.closes_at) : now;
    const later = cur > now;
    const p = X.taipeiParts(later ? cur : now);
    u.date = addDays(p.date, days); u.time = later ? p.time : '23:59';
    draw();
  }
  function closeNow(c) {
    const u = uiOf(c.id), p = X.taipeiParts(new Date());
    u.date = p.date; u.time = p.time;
    draw();
  }
  const isPast = (u) => u.date && u.time && new Date(toTs(u.date, u.time)).getTime() <= Date.now();
  function deadlinePanel(c, u) {
    const sync = () => { const w = document.getElementById('past-' + c.id); if (w) w.hidden = !isPast(u); };
    return h('form', { class: 'panel', noValidate: true, onsubmit: (e) => { e.preventDefault(); saveDeadline(c); } },
      h('div', { class: 'chips' },
        btn('再加 7 天', () => bump(c, 7), 'quiet', { fk: `plus7-${c.id}` }),
        btn('再加 30 天', () => bump(c, 30), 'quiet', { fk: `plus30-${c.id}` }),
        btn('現在關閉', () => closeNow(c), 'quiet', { fk: `now-${c.id}` })),
      h('div', { class: 'two' },
        field('日期', `dl-date-${c.id}`, { type: 'date', value: u.date, oninput: (e) => { u.date = e.target.value; sync(); } }),
        field('時間', `dl-time-${c.id}`, { type: 'time', value: u.time, oninput: (e) => { u.time = e.target.value; sync(); } })),
      h('p', { class: 'note' }, '學生專屬連結和講師統計表會一起改。'),
      h('p', { class: 'warn', id: 'past-' + c.id, hidden: !isPast(u), role: 'status' }, '這個時間已過，儲存後學生和講師馬上進不去。'),
      h('div', { class: 'btn-row' },
        h('button', { type: 'submit', class: 'btn primary', fk: `dl-save-${c.id}`, disabled: u.busy }, u.busy ? '正在儲存…' : '儲存新期限'),
        btn('取消', () => { u.panel = null; draw(`deadline-${c.id}`); }, 'quiet', { disabled: u.busy })));
  }
  async function saveDeadline(c) {
    const u = uiOf(c.id);
    u.err = ''; u.msg = '';
    if (!u.date || !u.time) { u.err = '請選日期和時間。'; draw(); return; }
    u.busy = true; draw();
    try {
      const t = await rpc('admin_set_deadline', { p_class_id: c.id, p_closes_at: toTs(u.date, u.time) });
      c.closes_at = t;
      if (c.stats_expires_at) c.stats_expires_at = t;
      u.panel = null;
      u.msg = `已更新：開放到 ${fmt(t)}。`;
      u.busy = false;
      draw(`deadline-${c.id}`);
    } catch (e) {
      if (e.handled) return;
      u.busy = false; u.err = errText(e); draw();
    }
  }

  /* 重新產生統計表連結 */
  function regenPanel(c, u) {
    return h('div', { class: 'panel' },
      h('p', { class: 'warn' }, '舊的統計表連結會馬上失效，講師要改用新連結。'),
      h('div', { class: 'btn-row' },
        btn(u.busy ? '正在產生…' : '重新產生', () => regen(c), 'primary', { fk: `regen-go-${c.id}`, disabled: u.busy }),
        btn('取消', () => { u.panel = null; draw(`regen-${c.id}`); }, 'quiet', { disabled: u.busy })));
  }
  async function regen(c) {
    const u = uiOf(c.id);
    u.busy = true; u.err = ''; draw();
    try {
      u.token = await rpc('admin_regen_stats_link', { p_class_id: c.id });
      c.stats_expires_at = c.closes_at;
      u.panel = null; u.busy = false;
      draw(`token-copy-${c.id}`);
    } catch (e) {
      if (e.handled) return;
      u.busy = false; u.err = errText(e); draw();
    }
  }
  function tokenPanel(c, u) {
    const url = statsLink(u.token);
    return h('div', { class: 'panel' },
      h('p', { class: 'warn', role: 'status' }, '新的統計表連結只顯示這一次，請先複製。'),
      linkBox('講師統計表', url),
      status(u.tokenMsg),
      h('div', { class: 'btn-row' },
        btn('複製連結', async () => { u.tokenMsg = await copyText(url) ? '已複製。' : '沒有複製成功，請手動選取上面的連結。'; draw(); }, 'primary', { fk: `token-copy-${c.id}` }),
        btn('我已複製，關閉', () => { u.token = null; u.tokenMsg = ''; draw(`regen-${c.id}`); }, 'quiet')));
  }

  /* ---------- Excel 匯出 ---------- */
  let tplPromise = null, bankPromise = null;
  function assets() {
    tplPromise = tplPromise || fetch('js/export-template.xlsx', { cache: 'no-cache' })
      .then((r) => { if (!r.ok) throw new Error('template_failed'); return r.arrayBuffer(); })
      .catch((e) => { tplPromise = null; throw e; });
    bankPromise = bankPromise || fetch('/', { cache: 'no-cache' })
      .then((r) => { if (!r.ok) throw new Error('template_failed'); return r.text(); })
      .then((t) => X.parseBank(t))
      .catch((e) => { bankPromise = null; throw e; });
    return Promise.all([loadLib('ExcelJS'), tplPromise, bankPromise]);
  }
  async function buildFile(data, ExcelJS, tpl, bank) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(tpl.slice(0));
    X.fillWorkbook(wb, data, bank);
    return wb.xlsx.writeBuffer();
  }
  async function exportOne(c) {
    const u = uiOf(c.id);
    u.exporting = true; u.msg = ''; u.err = ''; draw();
    try {
      const [ExcelJS, tpl, bank] = await assets();
      const data = await rpc('admin_export_class', { p_class_id: c.id });
      if (!data.rows.length) {
        u.msg = '這班還沒有作答，沒有東西可以匯出。';
      } else {
        const buf = await buildFile(data, ExcelJS, tpl, bank);
        const name = X.fileName(data.code);
        saveFile(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), name);
        u.msg = `已下載 ${name}（${data.rows.length} 份作答）。`;
      }
    } catch (e) {
      if (e.handled) return;
      u.err = errText(e);
    }
    u.exporting = false;
    draw();
  }
  async function exportAll() {
    const targets = (S.classes || []).filter((c) => Number(c.responses) > 0);
    if (!targets.length) { S.all = { ok: '目前沒有作答資料可以匯出。' }; draw(); return; }
    S.all = { busy: true, progress: '正在匯出…' }; draw();
    try {
      const [ExcelJS, tpl, bank, JSZip] = await Promise.all([assets(), loadLib('JSZip')]).then(([a, z]) => [...a, z]);
      const zip = new JSZip();
      let i = 0, done = 0;
      for (const c of targets) {
        S.all.progress = `正在匯出 ${++i}／${targets.length} 班…`; draw();
        const data = await rpc('admin_export_class', { p_class_id: c.id });
        if (!data.rows.length) continue;
        zip.file(X.fileName(data.code), await buildFile(data, ExcelJS, tpl, bank));
        done++;
      }
      if (!done) { S.all = { ok: '目前沒有作答資料可以匯出。' }; draw(); return; }
      const blob = await zip.generateAsync({ type: 'blob' });
      const name = `全部班級_作答資料_${today()}.zip`;
      saveFile(blob, name);
      const skipped = S.classes.length - done;
      S.all = { ok: `已下載 ${name}，共 ${done} 班，每班一個 Excel。${skipped ? `沒有作答的 ${skipped} 班略過。` : ''}` };
    } catch (e) {
      if (e.handled) return;
      S.all = { err: errText(e) };
    }
    draw();
  }

  /* ---------- 聯絡名單 ---------- */
  async function loadFollowups() {
    S.fu.err = '';
    try {
      S.fu.list = await rpc('admin_followups');
    } catch (e) {
      if (e.handled) return;
      S.fu.err = errText(e);
    }
    draw();
  }
  function followupsView() {
    const f = S.fu;
    if (f.err && !f.list) return h('div', { class: 'card empty' }, status(f.err, 'err'), btn('再試一次', () => { f.err = ''; draw(); loadFollowups(); }, 'primary'));
    if (!f.list) return h('p', { role: 'status' }, '正在載入聯絡名單…');
    if (!f.list.length) return h('div', { class: 'card empty' }, h('h2', null, '還沒有人留下聯絡方式'), h('p', null, '學生想進一步聯絡時，會出現在這裡。'));
    const todo = f.list.filter((x) => !x.contacted_at), done = f.list.length - todo.length;
    const pill = (id, label) => h('button', {
      type: 'button', class: 'btn quiet', fk: 'fu-' + id, 'aria-pressed': f.filter === id ? 'true' : 'false',
      'aria-expanded': null, onclick: () => { f.filter = id; for (const u of Object.values(f.ui)) u.keep = false; draw(); },
    }, label);
    const shown = f.list.filter((x) => {
      if (f.filter === 'all' || (f.ui[x.response_id] || {}).keep) return true;
      return f.filter === 'todo' ? !x.contacted_at : !!x.contacted_at;
    });
    const pills = h('div', { class: 'tiles', role: 'group', 'aria-label': '篩選聯絡名單' },
      pill('todo', `還沒聯絡 ${todo.length}`), pill('done', `已聯絡 ${done}`), pill('all', `全部 ${f.list.length}`));
    pills.querySelectorAll('[aria-pressed="true"]').forEach((b) => { b.classList.remove('quiet'); b.classList.add('primary'); });
    return [
      pills,
      shown.length ? shown.map(followupCard) : h('div', { class: 'card empty' }, h('p', null, f.filter === 'todo' ? '都聯絡過了。' : '這裡還沒有資料。')),
    ];
  }
  function followupCard(x) {
    const id = x.response_id;
    const u = S.fu.ui[id] || (S.fu.ui[id] = { contacted: !!x.contacted_at, note: x.note || '' });
    const type = X.typeLabel(x.result_kind, x.result_key);
    const tel = x.phone ? 'tel:' + x.phone.replace(/[^\d+]/g, '') : null;
    const mail = x.email ? 'mailto:' + encodeURIComponent(x.email).replace('%40', '@') : null;
    return h('article', { class: 'card' },
      h('div', { class: 'head-row' },
        h('h2', null, x.name || '未留名字'),
        x.is_test ? h('span', { class: 'badge test' }, '測試') : null,
        x.contacted_at ? h('span', { class: 'badge closed' }, '已聯絡') : null),
      h('dl', { class: 'rows' },
        h('dt', null, '來源'), h('dd', null, x.class_name || (x.cohort ? x.cohort : '個人版')),
        h('dt', null, '留下時間'), h('dd', null, fmt(x.created_at)),
        type ? [h('dt', null, '類型'), h('dd', null, type)] : null,
        x.phone ? [h('dt', null, '電話'), h('dd', null, h('a', { href: tel }, x.phone))] : null,
        x.line_id ? [h('dt', null, 'LINE'), h('dd', null, x.line_id)] : null,
        x.email ? [h('dt', null, 'Email'), h('dd', null, h('a', { href: mail }, x.email))] : null),
      h('label', { class: 'check' },
        h('input', { type: 'checkbox', fk: `fu-c-${id}`, checked: u.contacted, onchange: (e) => { u.contacted = e.target.checked; u.msg = ''; } }),
        '已聯絡'),
      h('div', { class: 'field' },
        h('label', { htmlFor: `fu-n-${id}` }, '備註'),
        h('textarea', { id: `fu-n-${id}`, fk: `fu-n-${id}`, class: 'input', rows: 2, maxLength: 500, value: u.note, oninput: (e) => { u.note = e.target.value; u.msg = ''; } })),
      status(u.msg), status(u.err, 'err'),
      btn(u.busy ? '正在儲存…' : '儲存', () => saveFollowup(x), 'primary', { fk: `fu-s-${id}`, disabled: u.busy }));
  }
  async function saveFollowup(x) {
    const u = S.fu.ui[x.response_id];
    u.busy = true; u.msg = ''; u.err = ''; draw();
    try {
      const r = await rpc('admin_save_followup', { p_response_id: x.response_id, p_contacted: u.contacted, p_note: u.note });
      x.contacted_at = r.contacted_at; x.note = r.note;
      u.note = r.note || '';
      u.keep = true;
      u.msg = '已儲存。';
    } catch (e) {
      if (e.handled) return;
      u.err = errText(e);
    }
    u.busy = false;
    draw();
  }

  /* ---------- 刪除資料 ---------- */
  function deleteView() {
    const d = S.del;
    return [
      h('form', { class: 'card', noValidate: true, onsubmit: (e) => { e.preventDefault(); search(); } },
        h('h2', null, '找到要刪除的人'),
        h('div', { class: 'search' },
          h('div', { class: 'field' },
            h('label', { htmlFor: 'del-q' }, '名字或 Email'),
            h('input', { id: 'del-q', fk: 'del-q', class: 'input', maxLength: 60, autocomplete: 'off', value: d.q, oninput: (e) => { d.q = e.target.value; } })),
          h('button', { type: 'submit', class: 'btn primary', fk: 'del-go', disabled: d.busy }, d.busy ? '搜尋中…' : '搜尋')),
        status(d.err, 'err')),
      status(d.done),
      d.results === null ? null
        : d.results.length ? d.results.map(personCard)
          : h('div', { class: 'card empty' }, h('p', null, `找不到「${d.searched}」。可以改用 Email 或部分名字再找一次。`)),
    ];
  }
  async function search() {
    const d = S.del, q = d.q.trim();
    d.done = ''; d.err = '';
    if (!q) { d.err = '請輸入名字或 Email。'; draw('del-q'); return; }
    d.busy = true; draw();
    try {
      d.results = await rpc('admin_search_people', { p_q: q });
      d.searched = q; d.ui = {};
    } catch (e) {
      if (e.handled) return;
      d.err = errText(e);
    }
    d.busy = false;
    draw();
  }
  const personKey = (p) => `${p.kind}-${p.id}`;
  const personLabel = (p) => String(p.name || p.email || '').trim();
  function personCard(p) {
    const d = S.del, key = personKey(p), label = personLabel(p);
    const u = d.ui[key] || (d.ui[key] = {});
    return h('article', { class: 'card' },
      h('h2', null, p.name || '未留名字'),
      h('dl', { class: 'rows' },
        p.email ? [h('dt', null, 'Email'), h('dd', null, p.email)] : null,
        h('dt', null, '來源'), h('dd', null, p.class_name || '個人版'),
        h('dt', null, '作答份數'), h('dd', null, p.responses),
        h('dt', null, '最後作答'), h('dd', null, p.last_at ? fmt(p.last_at) : '沒有作答')),
      u.open ? h('form', { class: 'panel', noValidate: true, onsubmit: (e) => { e.preventDefault(); if (u.typed && u.typed.trim() === label) removePerson(p); } },
        h('p', { class: 'warn' }, '會刪除這個人的作答、聯絡方式和他評，無法復原。已下載的 Excel 和 Supabase 自動備份不會跟著刪。'),
        field(`輸入「${label}」確認`, `del-t-${key}`, {
          autocomplete: 'off', value: u.typed || '',
          oninput: (e) => {
            u.typed = e.target.value;
            const b = document.getElementById(`del-b-${key}`);
            if (b) b.disabled = u.typed.trim() !== label;
          },
        }),
        status(u.err, 'err'),
        h('div', { class: 'btn-row' },
          h('button', { type: 'submit', id: `del-b-${key}`, class: 'btn danger', fk: `del-b-${key}`, disabled: u.busy || (u.typed || '').trim() !== label }, u.busy ? '正在刪除…' : '永久刪除'),
          btn('取消', () => { d.ui[key] = {}; draw(`del-o-${key}`); }, 'quiet', { disabled: u.busy })))
        : btn('刪除這個人的資料', () => { d.done = ''; u.open = true; draw(`del-t-${key}`); }, '', { fk: `del-o-${key}` }));
  }
  async function removePerson(p) {
    const d = S.del, key = personKey(p), label = personLabel(p), u = d.ui[key];
    u.busy = true; u.err = ''; draw();
    try {
      const n = await rpc('admin_delete_person', { p_kind: p.kind, p_id: p.id, p_confirm: u.typed.trim() });
      d.results = d.results.filter((x) => personKey(x) !== key);
      d.done = `已刪除 ${label} 的資料（${n} 份作答）。`;
      S.fu.list = null; S.fu.ui = {};
      draw('del-q');
      loadClasses();
    } catch (e) {
      if (e.handled) return;
      u.busy = false; u.err = errText(e); draw();
    }
  }

  /* ---------- 畫面入口 ---------- */
  function view() {
    const f = document.createDocumentFragment();
    if (S.view === 'loading') f.append(h('main', null, h('p', { role: 'status' }, '正在載入…')));
    else if (S.view === 'login') f.append(loginView());
    else if (S.view === 'denied') f.append(deniedView());
    else if (S.view === 'fail') f.append(failView());
    else {
      const body = S.tab === 'classes' ? classesView() : S.tab === 'followups' ? followupsView() : deleteView();
      f.append(...shell(body));
    }
    return f;
  }

  async function boot() {
    draw();
    try {
      await loadLib('supabase');
      sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce', storageKey: 'disc-admin-auth' },
      });
      sb.auth.onAuthStateChange((ev) => {
        if (ev === 'SIGNED_OUT' && S.view !== 'login') { S = Object.assign(blank(), { view: 'login' }); draw(); }
      });
      const { data: { session } } = await sb.auth.getSession();
      if (!session) {
        if (/[?&#]error=/.test(location.href)) {
          S.notice = '登入沒有完成，請再試一次。';
          history.replaceState(null, '', location.pathname);
        }
        S.view = 'login'; draw();
        return;
      }
      S.email = session.user.email || '';
      const ok = await rpc('admin_am_i');
      S.view = ok ? 'app' : 'denied';
      draw();
      if (ok) loadClasses();
    } catch (e) {
      if (e && e.handled) return;
      S.view = 'fail'; draw();
    }
  }
  boot();
})();
