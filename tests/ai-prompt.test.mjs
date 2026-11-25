import test from 'node:test'; import assert from 'node:assert/strict'; import { load } from './load.mjs';
const A = load();
const mean = {D:2.2, I:3.08, S:4.04, C:2.92};
const R = {
  single:{kind:'single', key:'S', primary:'S', secondary:'I', level:'mid', mean},
  combo:{kind:'combo', key:'DI', primary:'D', secondary:'I', mean},
  diag:{kind:'diag', key:'DS', primary:'D', secondary:'S', mean},
  chameleon:{kind:'chameleon', key:'CH', primary:'S', secondary:'I', mean},
};
const zh = r => (A.useDict(A.ZH), A.aiPrompt(r, {rep:A.R_V3, sub:A.SUB_V3, title:'標題'}));
const en = r => (A.useDict(A.EN), A.aiPrompt(r, {rep:A.EN.R, sub:A.EN.SUB, title:'Title'}));

test('四種結果都產生得出全文，含一句話、核心特質、可能適合的方向', () => {
  for (const [k, r] of Object.entries(R)) { const s = zh(r), rep = A.R_V3[r.key];
    assert.ok(s.includes(rep.one), k); assert.ok(s.includes(rep.core[0]), k); assert.ok(s.includes(rep.jobs), k);
    assert.ok(s.includes(rep.stressTip), k); assert.ok(!/\{\w+\}/.test(s), k + ' 有沒換掉的佔位符'); }
});
test('沒有結果時回傳空字串', () => assert.equal(zh({kind:'none', mean}), ''));
test('分數用網站的公式', () => { const s = zh(R.single); assert.ok(s.includes(`${A.LBL('S')} 76`)); assert.ok(s.includes(`${A.LBL('D')} 30`)); });
test('副型只出現在單一型', () => {
  assert.ok(zh(R.single).includes(A.SUB_V3.SI));
  assert.ok(!zh(R.chameleon).includes('副型'));
});
test('不放相處小提醒、不帶個資', () => {
  const s = zh({...R.single, name:'王小明', email:'a@b.c', school:'某某大學'});
  assert.ok(!s.includes(A.R_V3.S.tips[0])); assert.ok(!s.includes(A.ZH.ui['sec.tips']));
  for (const x of ['王小明', 'a@b.c', '某某大學']) assert.ok(!s.includes(x));
});
test('中文有台灣安心專線', () => assert.ok(zh(R.single).includes('1925')));
test('英文版沒有中文字、沒有台灣專線號碼', () => {
  for (const r of Object.values(R)) { const s = en(r); assert.ok(!/[㐀-鿿]/.test(s)); assert.ok(!s.includes('1925')); assert.ok(s.includes(A.EN.R[r.key].one)); }
  A.useDict(A.ZH);
});

test('短文字帶入網址，太長改開首頁，Gemini 一律開首頁', () => {
  const S = A.AI_SITES;
  assert.equal(A.aiUrl(S.chatgpt, 'hi'), 'https://chatgpt.com/?q=hi');
  assert.equal(A.aiUrl(S.claude, 'hi'), 'https://claude.ai/new?q=hi');
  assert.equal(A.aiUrl(S.gemini, 'hi'), 'https://gemini.google.com/app');
  assert.equal(A.aiUrl(S.chatgpt, '字'.repeat(5000)), S.chatgpt.home);
});
test('點 AI 按鈕時先開分頁、才複製（避免被擋）', () => {
  const src = A.html.slice(A.html.indexOf('async function aiOpen'), A.html.indexOf('async function aiOpen') + 600);
  assert.ok(src.indexOf('window.open') > -1 && src.indexOf('window.open') < src.indexOf('copyText'));
  assert.ok(src.indexOf('await') === -1 || src.indexOf('window.open') < src.indexOf('await'));
});
