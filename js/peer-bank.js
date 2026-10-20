/* =====================================================================
   他評題庫與計分（peer.html 使用；Node 測試也會載入）
   題目組成、計分、判定必須和 backend/functions/peer-submit/index.ts 一致，
   tests/peer-bank.test.mjs 會比對兩邊。
   詞的來源與檢查：他評題庫草稿.md（p0.1）
   ===================================================================== */
(function () {
  'use strict';

  const BANK_VERSION = 'p0.1';
  const TYPES = ['D', 'I', 'S', 'C'];
  const RELATIONS = ['朋友', '家人', '老師', '同學', '同事'];
  const ITEM_COUNT = 12;
  // 落差文字的最小差距：用 profile() 換算後的單位（標準差）。暫定 1.2：模擬「朋友眼中和自評一樣」時，
  // 3–5 人回覆約 17–42% 會誤寫出落差（舊的 0.15 約 83–94%），要等真實資料校正
  const GAP_MIN = 1.2;
  // 類型判定門檻（暫定：分析工具/peer_threshold_sim.py，要等真實資料校正）。8 題版本的門檻還沒定。
  const GATES = { 12: { gate: 5.5, high: 11 } };

  // 編號：型＋構面＋字母。a、b 用在第 1–8 題，c 用在第 9–12 題
  const WORDS = {
    D1a: '喜歡帶頭', D1b: '喜歡自己作主', D1c: '常分配工作',
    D2a: '決定得很快', D2b: '想到就馬上做', D2c: '重視結果',
    D3a: '越難越有鬥志', D3b: '喜歡競爭', D3c: '敢冒險嘗試',
    D4a: '說話直接', D4b: '有話當面說', D4c: '拒絕得乾脆',
    I1a: '很容易跟人熟', I1b: '愛認識新朋友', I1c: '常揪人一起玩',
    I2a: '很會說服人', I2b: '熱情能感染人', I2c: '很會鼓勵人',
    I3a: '凡事往好處想', I3b: '常逗大家開心', I3c: '喜歡隨興',
    I4a: '喜歡分享想法', I4b: '被注意很自在', I4c: '說話表情豐富',
    S1a: '做事步調穩定', S1b: '喜歡熟悉做法', S1c: '很有耐心',
    S2a: '樂於幫忙', S2b: '重視合作', S2c: '喜歡幕後支持',
    S3a: '很會傾聽', S3b: '留意別人需要', S3c: '讓人很自在',
    S4a: '以和為貴', S4b: '常配合別人', S4c: '常說「都可以」',
    C1a: '注重細節', C1b: '會反覆檢查', C1c: '要求做到正確',
    C2a: '按部就班', C2b: '照規則做事', C2c: '喜歡井然有序',
    C3a: '先做足功課', C3b: '相信數據', C3c: '會先查證',
    C4a: '做事小心', C4b: '會先評估風險', C4c: '偏向保守',
  };
  // 落差文字用的特色（規格 5-4）
  const FEATURE = { D: '果斷、直接', I: '熱情、好聊', S: '穩定、體貼', C: '細心、講求精確' };

  const ADJ = { DI: 'DI', ID: 'DI', IS: 'IS', SI: 'IS', SC: 'SC', CS: 'SC', CD: 'CD', DC: 'CD' };
  const DIAG = { DS: 'DS', SD: 'DS', IC: 'IC', CI: 'IC' };

  const itemKey = (i) => 'P' + String(i).padStart(2, '0');

  // 第 n 題的四個詞 [D, I, S, C]：四型用到的構面互相錯開
  function itemWords(n) {
    const letter = n <= 4 ? 'a' : n <= 8 ? 'b' : 'c';
    const j = (n - 1) % 4;
    return ['D' + (j + 1) + letter, 'I' + ((j + 1) % 4 + 1) + letter, 'S' + ((j + 2) % 4 + 1) + letter, 'C' + ((j + 3) % 4 + 1) + letter];
  }

  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // 每位評的人：題目順序、每題 4 個詞的順序都打亂
  function makeSeq(rng = Math.random) {
    const items = Array.from({ length: ITEM_COUNT }, (_, k) => k + 1);
    return shuffle(items, rng).map((i) => ({ i, w: shuffle(itemWords(i), rng) }));
  }

  // 最像 +1、最不像 -1
  function scorePicks(picks) {
    const s = { D: 0, I: 0, S: 0, C: 0 };
    Object.keys(picks).forEach((k) => { s[picks[k].most[0]] += 1; s[picks[k].least[0]] -= 1; });
    return s;
  }

  // 判定順序和 index.html score() 相同；四型全為 0 判為變色龍
  function classify(scores, nItems = ITEM_COUNT) {
    const g = GATES[nItems];
    if (!g) throw new Error('沒有 ' + nItems + ' 題的門檻');
    const order = TYPES.slice().sort((x, y) => scores[y] - scores[x]);
    const [a, b, c, d] = order, e = 1e-9;
    const gap = scores[a] - scores[b], spread = scores[a] - scores[d];
    let kind, key, level = null;
    if (TYPES.every((t) => scores[t] === 0) || spread < g.gate - e) { kind = 'chameleon'; key = 'CH'; }
    else if (gap >= g.gate - e) { kind = 'single'; key = a; level = gap >= g.high - e ? 'high' : 'mid'; }
    else if (ADJ[a + b]) { kind = 'combo'; key = ADJ[a + b]; }
    else if (scores[a] - scores[c] >= g.gate - e && scores[b] - scores[c] >= g.gate - e) { kind = 'diag'; key = DIAG[a + b]; }
    else { kind = 'single'; key = a; level = 'low'; }
    return { kind, key, primary: a, secondary: b, order, level };
  }

  function average(list) {
    const out = { D: 0, I: 0, S: 0, C: 0 };
    if (!list.length) return out;
    TYPES.forEach((t) => { out[t] = list.reduce((s, x) => s + x[t], 0) / list.length; });
    return out;
  }

  // 自評：（該型平均 − 四型平均）÷ 3（Likert 1–5 時的理論最大差距）
  function normSelf(mean) {
    const avg = TYPES.reduce((s, t) => s + mean[t], 0) / 4;
    const out = {};
    TYPES.forEach((t) => { out[t] = (mean[t] - avg) / 3; });
    return out;
  }
  // 他評：分數 ÷ 題數
  function normPeer(scores, nItems = ITEM_COUNT) {
    const out = {};
    TYPES.forEach((t) => { out[t] = scores[t] / nItems; });
    return out;
  }

  // 自評（1–5 分量表）和他評（最像／最不像）的分數尺度不同，他評天生比較分散。
  // 比較前兩邊各自除以自己的分散程度（四型的均方根），只比「哪一型比較高、哪一型比較低」的形狀。
  // 結果大約在 −1.7～+1.7；四型都一樣時全部是 0
  function profile(v) {
    const m = TYPES.reduce((s, t) => s + v[t], 0) / 4;
    const sd = Math.sqrt(TYPES.reduce((s, t) => s + (v[t] - m) ** 2, 0) / 4);
    const out = {};
    TYPES.forEach((t) => { out[t] = sd < 1e-9 ? 0 : (v[t] - m) / sd; });
    return out;
  }

  // 落差最大的兩型（差距 ≥ GAP_MIN，兩邊都要先用 profile() 換算）；dir = 'peer' 代表別人看到的比自評多
  function gapLines(selfN, peerN) {
    return TYPES
      .map((t) => ({ t, d: peerN[t] - selfN[t] }))
      .filter((x) => Math.abs(x.d) >= GAP_MIN - 1e-9)
      .sort((x, y) => Math.abs(y.d) - Math.abs(x.d))
      .slice(0, 2)
      .map((x) => ({ t: x.t, dir: x.d > 0 ? 'peer' : 'self' }));
  }

  const api = {
    BANK_VERSION, TYPES, RELATIONS, ITEM_COUNT, GAP_MIN, GATES, WORDS, FEATURE,
    itemKey, itemWords, makeSeq, scorePicks, classify, average, normSelf, normPeer, profile, gapLines,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.PeerBank = api;
})();
