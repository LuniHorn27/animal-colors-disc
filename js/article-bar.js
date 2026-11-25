/* SEO 文章頁（disc*.html、disc*-en.html）頂欄右側的「語言」和「選單」按鈕。
   選單內容跟首頁選單一致，但「登入／我的歷次結果／心得回饋」要有測驗頁的資料才能用，文章頁沒有。
   語言看 <html lang>；切換語言的目標網址取自頁面裡的 <link rel="alternate" hreflang>。 */
(function(){
  var bar = document.querySelector('.bar-in'); if (!bar) return;
  var EN = document.documentElement.lang.indexOf('en') === 0;
  var S = EN ? {
    menu:'Menu', lang:'Switch to Chinese 中文', langK:'中', peer:'See yourself from a different angle', disc:'About DISC',
    settings:'Settings', dark:'Dark mode', on:'On', off:'Off', share:'Share this test with friends',
    shareTitle:"What's Your Inner Animal? | DISC Behavioral Style Test",
    shareText:"What's Your Inner Animal? A DISC behavioral style test. In about 5–10 minutes, find out which animals you are!",
    copied:'Copied. Paste it to send to friends.', copyThis:'Copy this link: ', peerUrl:'peer.html?lang=en', navLabel:'Menu'
  } : {
    menu:'選單', lang:'切換成英文 English', langK:'EN', peer:'換個角度看自己', disc:'認識 DISC',
    settings:'設定', dark:'深色模式', on:'開', off:'關', share:'分享這個測驗給朋友',
    shareTitle:'測出你的動物本色｜DISC 行為風格測驗',
    shareText:'測出你的動物本色：DISC 行為風格測驗，約 5–10 分鐘，看看你是哪幾種動物！',
    copied:'已複製，貼給朋友就可以了', copyThis:'請複製這個連結：', peerUrl:'peer.html', navLabel:'選單'
  };
  var altHref = '';
  [].forEach.call(document.querySelectorAll('link[rel="alternate"][hreflang]'), function(l){
    var h = (l.getAttribute('hreflang') || '').toLowerCase();
    if ((EN && h.indexOf('zh') === 0) || (!EN && h.indexOf('en') === 0)) altHref = l.getAttribute('href');
  });
  var discHref = EN ? 'disc-en.html' : 'disc.html';
  var here = (location.pathname.replace(/^.*\//, '') || 'index').replace(/\.html$/, '') + '.html';
  var ico = function(d, extra){ return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'+(extra||'')+'>'+d+'</svg>'; };

  var actions = document.createElement('div'); actions.className = 'bar-actions';
  actions.innerHTML =
    (altHref ? '<a class="bar-btn" id="bar-lang" href="'+altHref+'" hreflang="'+(EN?'zh-Hant-TW':'en')+'" lang="'+(EN?'zh-Hant-TW':'en')+'"><span class="lang-k" aria-hidden="true">'+S.langK+'</span><span class="lbl">'+S.lang+'</span></a>' : '') +
    '<button type="button" class="bar-btn" id="bar-menu" aria-haspopup="dialog" aria-expanded="false" aria-controls="menu">'+
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg><span class="lbl">'+S.menu+'</span></button>';
  bar.appendChild(actions);

  var menu = document.createElement('dialog'); menu.id = 'menu'; menu.className = 'menu'; menu.setAttribute('aria-label', S.navLabel);
  menu.innerHTML = '<div class="menu-in" tabindex="-1"><div class="menu-grab" aria-hidden="true"></div>'+
    '<a class="menu-row" href="'+S.peerUrl+'">'+ico('<path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/>')+'<span>'+S.peer+'</span></a>'+
    '<a class="menu-row" href="'+discHref+'"'+(here===discHref?' aria-current="page"':'')+'>'+ico('<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r=".6" fill="currentColor"/>')+'<span>'+S.disc+'</span></a>'+
    '<hr><h2 class="menu-sec">'+S.settings+'</h2>'+
    '<button type="button" class="menu-row" id="m-theme" role="switch" aria-checked="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor"/></svg><span>'+S.dark+'</span><span class="r" id="m-theme-v" aria-hidden="true"></span></button>'+
    '<button type="button" class="menu-row" id="m-share">'+ico('<path d="M12 15V3M8 7l4-4 4 4M5 12v8h14v-8"/>')+'<span>'+S.share+'</span></button>'+
    '<hr><a class="menu-row" href="/">'+ico('<circle cx="4.5" cy="17.5" r="3"/><circle cx="14.5" cy="17.5" r="3"/><path d="M4.5 17.5L8 12h4.5l2 5.5"/><path d="M8 12l1.8-3.4 3.2.8"/><circle cx="10.2" cy="5.6" r="1.2" fill="currentColor"/><path d="M18.6 8.4L23.4 5.2v8.4l-4.8-3.2z" fill="currentColor" fill-opacity=".26" stroke="none"/><path d="M13 9.4h2.6"/><path d="M15.6 8.1h2.4v2.6h-2.4z" stroke-width="1.2"/>', ' style="stroke-width:1.6"')+'<span>尋光引路實驗室 LumineerLab</span></a></div>';
  document.body.appendChild(menu);
  var toastEl = document.createElement('p'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastEl);

  var $ = function(s){ return document.querySelector(s); }, btn = $('#bar-menu'), tt;
  function toast(m){ toastEl.textContent = m; clearTimeout(tt); if (m) tt = setTimeout(function(){ toastEl.textContent = ''; }, 4000); }
  var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  function isDark(){ var t = document.documentElement.dataset.theme; return t ? t === 'dark' : !!(mq && mq.matches); }
  function syncTheme(){ var on = isDark(); $('#m-theme').setAttribute('aria-checked', String(on)); $('#m-theme-v').textContent = on ? S.on : S.off; }
  $('#m-theme').addEventListener('click', function(){
    var t = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = t; try { localStorage.setItem('disc-theme', t); } catch(e){}
    syncTheme();
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', syncTheme);
  syncTheme();

  function copyText(t){
    function old(){ try { var ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, t.length); var ok = document.execCommand('copy'); ta.remove(); return ok; } catch(e){ return false; } }
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(function(){ return true; }, function(){ return old(); });
    return Promise.resolve(old());
  }
  $('#m-share').addEventListener('click', function(){
    menu.close();
    var url = new URL('./', location.href).href + (EN ? '?lang=en' : '');
    var data = {title:S.shareTitle, text:S.shareText, url:url};
    function fallback(){ copyText(data.text + '\n' + data.url).then(function(ok){ toast(ok ? S.copied : S.copyThis + data.url); }); }
    if (navigator.share) navigator.share(data).catch(function(e){ if (!(e && e.name === 'AbortError')) fallback(); });
    else fallback();
  });

  btn.addEventListener('click', function(){
    var wide = matchMedia('(min-width:768px)').matches, r = btn.getBoundingClientRect();
    menu.style.top = wide ? Math.round(r.bottom + 8) + 'px' : '';
    menu.style.right = wide ? Math.round(document.documentElement.clientWidth - r.right) + 'px' : '';
    menu.showModal(); $('.menu-in').focus();
    btn.setAttribute('aria-expanded', 'true');
  });
  menu.addEventListener('close', function(){ btn.setAttribute('aria-expanded', 'false'); });
  menu.addEventListener('click', function(e){ if (e.target === menu) menu.close(); });
})();
