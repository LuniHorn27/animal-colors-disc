/* =====================================================================
   他評頁（peer.html）的文字字典與語言判斷（Node 測試也會載入）
   中文是原文；英文放在 js/peer-lang-en.js，句子的中文原文備份在 js/peer-lang-en.src.json。
   改了這裡的中文，英文要在同一個 commit 一起改（tests/peer-parity.test.mjs 會檢查）。
   {變數} 會被代入；有 HTML 標籤的句子，代入的名字要先跳脫。
   ===================================================================== */
(function () {
  'use strict';

  // 主測驗的題數（index.html 的 ITEMS）；tests/peer-parity.test.mjs 會核對兩邊一樣
  const MAIN_ITEM_COUNT = 46;

  const ui = {
    /* ---- 共用 ---- */
    'title': '換個角度看自己',
    'doc.title': '換個角度看自己｜動物本色',
    'brand': '測出你的\u200b動物本色',
    'theme': '深色模式',
    'bar.lang.short': 'EN',
    'menu.btn': '選單',
    'menu.account': '帳號',
    'menu.signin': '用 Google 登入',
    'menu.signinSub': '換手機也看得到你的結果',
    'menu.who': '登入帳號：{email}',
    'menu.history': '我的歷次結果',
    'menu.signout': '登出',
    'menu.settings': '設定',
    'menu.on': '開',
    'menu.off': '關',
    'menu.share': '分享這個測驗給朋友',
    'menu.shareTitle': '動物本色｜DISC 行為風格測驗',
    'menu.shareText': '動物本色：DISC 行為風格測驗，大約 5–10 分鐘，測出你的本色是哪幾種動物！',
    'menu.copied': '測驗連結已複製，可以直接貼給朋友。',
    'bar.lang': '切換成英文 English',
    'lang.fail': 'English is unavailable right now. Showing Chinese.／英文版暫時無法使用，先顯示中文。',
    'copied': '已複製',
    'copyFail': '無法自動複製，請長按連結自行複製',
    'loginFail': '無法開始登入',
    'fail.t': '連不上伺服器',
    'fail.b': '請檢查網路，稍後再試一次。',
    'retry': '再試一次',
    'nobackend.t': '目前無法使用',
    'nobackend.b': '網站還沒有設定好後端，請稍後再試。',
    'back.full': '看我的「個人結果」',
    'tab.nav': '結果切換',
    'tab.mine': '我的結果',
    'tab.others': '他人角度',
    'tab.new': '新',
    'tab.invited': '已邀請',
    'tab.replies': '{n} 人回覆',
    'tab.replies.one': '{n} 人回覆',
    'cham': '變色龍',
    'cham.full': '變色龍（四型均衡）',
    'title.one': '{t} {animal}（{type}型）',
    'title.code': '{t}-{animal}（{type}型）',
    'join.title': ' ＋ ',
    'join.names': '＋',
    'code.blend': '：{ab} 組合型',
    'code.diag': '：{ab} 對角型',
    'pair.self': '你自評',
    'pair.peer': '大家眼中',
    'pair.wait': '等被邀請人回覆',

    /* ---- 邀請頁 ---- */
    'need.t': '請先完成主測驗 DISC',
    'need.b': '「換個角度看自己」是拿你的自評和大家眼中的你做對照，所以要先做完主測驗。做完後回到這一頁，就能產生邀請連結。如果之前已登入帳號並保存測驗結果，請先登入。',
    'need.start': '開始DISC測驗',
    'need.other': '在別的手機或電腦做過？',
    'need.login': '登入帳號',
    'need.home': '回到首頁',
    'inv.lead': '1955年心理學理論「周哈里窗」提到，透過他人的回饋，能夠更加全面的認識自己，邀請朋友、家人、老師、或是其他信任的人，花 2–3 分鐘的時間快速測驗，幫助你「換一個角度」認識自己吧！',
    'inv.sub': '邀請他們花 2–3 分鐘，從幾組描述中，選出最像你和最不像你的敘述。',
    'inv.pairNote': '被邀請人完成測驗後，你將看到兩邊的對照',
    'inv.nickQ': '大家通常怎麼稱呼你？',
    'inv.nickPh': '例如：小安、安安',
    'inv.nickHint': '朋友會在題目裡看到這個稱呼。',
    'inv.nickHint2': '題目會顯示：「以下哪個敘述最像 {v}？」',
    'inv.go': '產生邀請連結',
    'inv.going': '產生中…',
    'inv.tip1': '建議邀請三位以上，測驗結果會更有參考性，較不會被單一人的既定印象影響',
    'inv.tip2': '被邀請人可以匿名，也可以留名字',
    'inv.tip3': '連結不會過期，之後想再邀請別人，傳同一個連結就好',
    'inv.errNoResult': '找不到你的測驗結果，請先<a href="./">完成主測驗</a>。',
    'inv.errFail': '產生失敗，請稍後再試一次。',

    /* ---- 傳出邀請連結 ---- */
    'lk.share': '傳給朋友',
    'lk.line': '用 LINE 傳送',
    'lk.copyInvite': '複製邀請連結',
    'lk.copy': '複製連結',
    'lk.shareText': '在你眼中，{nick}是哪一種動物？',
    'lk.ready': '邀請連結準備好了',
    'lk.send': '傳給朋友、家人、老師，請他們花 2–3 分鐘選出最像你的敘述。題目會稱呼你「{nick}」。',
    'lk.n0': '目前 0 人回覆',
    'lk.n': '已有 {n} 人回覆',
    'lk.seeCmp': '看對照結果',
    'lk.saved': '已存到你的帳號',
    'lk.savedB': '之後在「我的歷次結果」就能回來看。',
    'lk.saveT': '保存你的結果連結',
    'lk.saveB': '之後要靠它回來看大家眼中的你。登入後會存在帳號裡，換手機也看得到。',
    'lk.google': '用 Google 帳號登入保存',
    'lk.self': '不登入，改成自己保存連結',
    'lk.selfB': '請存在只有你看得到的地方（例如傳給自己、加入書籤）。<b>不要</b>傳給別人，拿到這個連結的人都能看到結果。',
    'lk.copyOwn': '複製結果連結',

    /* ---- 回覆的人：開始頁 ---- */
    'nf.t': '找不到這個邀請',
    'nf.b': '連結可能不完整，請向邀請你的人再要一次。',
    'cl.t': '這個邀請目前沒有開放',
    'cl.b': '邀請你的人已經暫停開放回覆。',
    'rs.h1': '在你眼中，<br>「{nm}」是哪一種動物？',
    'rs.lead': '這是一份 DISC 行為風格測驗，用四種動物代表做事和相處的習慣。周哈里窗提到，有些面向別人看得見，自己卻有盲點；你的選擇，能幫「{nm}」從另一個視角更認識自己。',
    'rs.count': '共 {n} 題，每題敘述選一個<b>最像</b>「{nm}」的、一個<b>最不像</b>的，約 2–3 分鐘。',
    'rs.relQ': '你是「{nm}」的…',
    'rs.relOtherQ': '你們是什麼關係？',
    'rs.relOtherPh': '例如：社團學長、鄰居',
    'rs.nameQ': '你的名字（選填）',
    'rs.nameNote': '如未填寫，會顯示為匿名',
    'rs.hint': '先選你和「{nm}」的關係，就可以開始。',
    'rs.start': '開始',
    'rs.resumeT': '要從第 {i} 題繼續嗎？',
    'rs.resumeB': '你上次幫「{nm}」作答，停在第 {i} 題（共 {n} 題），已經選的答案都還在。',
    'rs.resume': '繼續作答',
    'rs.restart': '重新開始',

    /* ---- 作答 ---- */
    'q.progress': '第 {i} / {n} 題',
    'q.title': '以下哪個敘述最像「{nm}」？<br>哪個最不像？',
    'q.most': '最像',
    'q.least': '最不像',
    'q.aMost': '{w}：最像',
    'q.aLeast': '{w}：最不像',
    'q.h0': '選一個最像、一個最不像。同一個敘述不能兩個都選。',
    'q.h1': '再選一個最不像。',
    'q.h2': '再選一個最像。',
    'q.h3': '都選好了，馬上跳到下一題。',
    'q.h3last': '都選好了，按「送出」。',
    'q.prev': '上一題',
    'q.next': '下一題',
    'q.send': '送出',
    'q.sending': '送出中…',
    'q.again': '再送一次',
    'q.cant': '無法送出',
    'q.e.closed': '這個邀請目前沒有開放，無法送出。',
    'q.e.not_found': '找不到這個邀請，無法送出。',
    'q.e.network': '網路不穩，請稍後再按一次送出。',
    'q.e.invalid': '送出失敗，請重新整理頁面再作答一次。',
    'lv.t': '要離開嗎？',
    'lv.b': '已經選的答案會先存在這個瀏覽器，之後打開同一個連結可以接著作答；回覆要作答完按「送出」才會送出。',
    'lv.stay': '繼續作答',
    'lv.go': '離開',

    /* ---- 回覆的人：送出後 ---- */
    'rr.again': '你已經回覆過「{nm}」了，這是你上次的結果。',
    'rr.sent': '已將測驗結果自動傳送給「{nm}」，謝謝你！',
    'rr.eyebrow': '在你眼中，「{nm}」的動物本色{code}',
    'rr.mix': '本色組成',
    'rr.inEyes': '在你眼中',
    'rr.aria': '在你眼中{nick}的本色：{names}。本色組成：{mix}',
    'rr.sep': '、',
    'rr.n1': '占比越大，代表在你眼中這種動物越明顯。',
    'rr.top1': '占比最大的 {a}，就是在你眼中「{nm}」的本色。',
    'rr.top2': '{a} 和 {b} 的占比最大又很接近，所以兩種都是「{nm}」的本色。',
    'rr.top3': '四種動物的占比都很接近，所以在你眼中「{nm}」是變色龍。',
    'rr.full': '{name}的完整解析',
    'rr.seeFull': '看完整解析',
    'rr.hide': '收起解析',
    'rr.ref': '以上測驗及解析結果僅供參考',
    'cta.t': '想要了解自己的動物本色嗎？',
    'cta.b1': '根據心理學家馬斯頓（William Marston）1928 年提出的 DISC 理論設計，把人的行為風格分成四種傾向，用四種動物代表。',
    'cta.b2': '每個人身上都有這四種動物，只是比例不同；沒有哪一型比較好，每一型都有各自的優點和盲點。',
    'cta.meta': '{n} 題｜約 5–10 分鐘｜免費獲得個人報告書',
    'cta.btn': '測出自己的動物本色',

    /* ---- 對照結果頁 ---- */
    'ow.bad.t': '這個連結已經失效',
    'ow.bad.b': '可能已經在其他裝置重新產生過連結，舊的專屬結果連結就不能再用了。請用最新的連結，或登入帳號後再打開。',
    'ow.bad.back': '回到邀請頁',
    'ow.empty.t': '還沒有人回覆',
    'ow.empty.b': '把邀請連結傳給朋友、家人或老師，有人回覆就會出現在這裡。',
    'ow.filter': '依關係篩選',
    'ow.all': '全部',
    'ow.few': '目前只有 {n} 個人回覆，再邀請幾位，結果會更穩定。',
    'ow.who.all': '在 {n} 個人眼中',
    'ow.who.rel': '在 {n} 位{rel}眼中',
    'ow.eyebrow': '{who}，你的動物本色{code}',
    'ow.v.self': '你的角度',
    'ow.v.all': '他人角度',
    'ow.v.rel': '{rel}角度',
    'ow.s.up': '還多了 {a} 的{f}',
    'ow.s.down': '比較少看到 {a} 的{f}',
    'ow.s.same': '跟你的角度差不多',
    'ow.ask': '可以問問他們：{q}',
    'ow.more.n': '已有 {n} 人回覆',
    'ow.more.b': '再邀請幾位，結果會更完整。',
    'ow.eachT': '每個人眼中的你',
    'ow.anon': '匿名',
    'ow.anonMore': '另有 {n} 位匿名，只算進上面的平均。',
    'ow.anonAll': '{n} 位都是匿名，只算進上面的平均。',
    'ow.ref': '以上測驗結果僅供參考',
    'ow.swL': '接受新回覆',
    'ow.swD': '關掉後連結還在，但沒辦法再送出新的回覆。之後可以再打開。',
    'ow.swOn': '已開始接受新回覆',
    'ow.swOff': '已停止接受新回覆',
    'ow.swFail': '設定失敗，請稍後再試',
  };

  const ZH = {
    ui,
    // 關係（後端存中文）：chip 上的字、句子裡的單數、句子裡的複數；中文只有「其他」放進句子要寫成「其他人」
    rel: { 朋友: '朋友', 家人: '家人', 老師: '老師', 同學: '同學', 同事: '同事', 其他: '其他' },
    relLo: { 其他: '其他人' },
    relPl: { 其他: '其他人' },
    animal: { D: '老虎', I: '孔雀', S: '無尾熊', C: '貓頭鷹' },
    tname: { D: '支配', I: '影響', S: '穩定', C: '分析' },
  };

  // 決定語言：網址的 ?lang=（zh 或 en，不分大小寫）→ 上次選的 → 中文
  function pickLang(search, stored) {
    const q = (new URLSearchParams(search).get('lang') || '').toLowerCase();
    if (q === 'zh' || q === 'en') return q;
    return stored === 'en' ? 'en' : 'zh';
  }

  // 用目前語言取字。英文沒有的句子退回中文（並提醒）；單數（n===1）有 ".one" 版本就用它
  function makeT(lang, EN) {
    const D = lang === 'en' && EN ? EN : ZH;
    const t = (key, vars) => {
      vars = vars || {};
      let s = vars.n === 1 && D.ui[key + '.one'] != null ? D.ui[key + '.one'] : D.ui[key];
      if (s == null) s = ZH.ui[key];
      if (s == null) { if (typeof console !== 'undefined') console.warn('沒有這個文字：', key); return key; }
      return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    };
    const pick = (name, k) => (D[name] && D[name][k] != null) ? D[name][k] : ZH[name][k];
    return {
      t,
      lang: D === ZH ? 'zh' : 'en',
      animal: (c) => pick('animal', c),
      tname: (c) => pick('tname', c),
      rel: (r) => (D.rel && D.rel[r] != null) ? D.rel[r] : r,
      relLo: (r) => (D.relLo && D.relLo[r] != null) ? D.relLo[r] : (D.rel && D.rel[r] != null) ? D.rel[r] : r,
      relPl: (r) => (D.relPl && D.relPl[r] != null) ? D.relPl[r] : (D.rel && D.rel[r] != null) ? D.rel[r] : r,
      word: (id, zhWords) => (D.words && D.words[id] != null) ? D.words[id] : zhWords[id],
    };
  }

  const api = { MAIN_ITEM_COUNT, ZH, pickLang, makeT };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.PeerI18n = api;
})();
