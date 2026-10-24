// 中英文對照測試：英文缺句子、變數不一致、中文改了英文沒改，都會失敗
import test from 'node:test';
import assert from 'node:assert/strict';
import { load, html } from './load.mjs';
const x = load();
const PH = s => [...String(s).matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
const CJK = /[一-鿿]/;
function* flat(o, p) { if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) yield* flat(v, p ? `${p}.${k}` : k); else yield [p, o]; }
const zhNow = {
  ...Object.fromEntries(Object.entries(x.ZH.ui).map(([k, v]) => ['ui.' + k, v])),
  ...Object.fromEntries(x.ITEMS.map(i => ['items.' + i.id, i.text])), ...Object.fromEntries(x.PAIRS.map(i => ['pairs.' + i.id, i.text])),
  ...Object.fromEntries(x.ATTN.map(i => ['attn.' + i.id, i.text])), ...Object.fromEntries(x.SCALE.map((v, i) => ['scale.' + i, v])),
  ...Object.fromEntries(Object.entries(x.BLIND).flatMap(([k, v]) => v.split('。').filter(Boolean).map((s, i) => [`blind.${k}.${i}`, s + '。']))),
  ...Object.fromEntries(flat(x.R_V3, 'R')), ...Object.fromEntries(flat(x.SUB_V3, 'SUB')),
};
test('中文有沒有改過：每一句中文都要有英文，而且翻譯時的中文和現在一樣', () => {
  const bad = [];
  for (const [p, z] of Object.entries(zhNow)) {
    const s = x.src[p];
    if (s === undefined) bad.push(`${p}：新句子還沒翻（現在的中文：${z}）`);
    else if (s !== z) bad.push(`${p}：中文改過了，英文還沒更新\n  翻譯時的中文：${s}\n  現在的中文：  ${z}`);
  }
  for (const p of Object.keys(x.src)) { const base = p.startsWith('ui.') ? p.replace(/\.one$/, '') : p; if (!(base in zhNow)) bad.push(`${p}：中文已經刪掉了，英文也要刪`); }
  assert.deepEqual(bad, []);
});
test('介面文字：變數一致、標籤數量一致、英文沒有中文字', () => {
  const bad = [];
  for (const [k, z] of Object.entries(x.ZH.ui)) {
    const e = x.EN.ui[k];
    if (e === undefined) { bad.push(`${k}：沒有英文`); continue; }
    // 英文標題只寫動物（D-Tiger），不放類型名稱，所以 res.tfull 少一個變數是刻意的
    if (PH(z) !== PH(e) && k !== 'res.tfull') bad.push(`${k}：變數不一致 ${PH(z)} / ${PH(e)}`);
    if ((z.match(/<b>/g) || []).length !== (e.match(/<b>/g) || []).length) bad.push(`${k}：粗體標籤數量不一致`);
    if (CJK.test(e) && !['bar.lang', 'lang.fail', 'bar.lang.short'].includes(k)) bad.push(`${k}：英文裡有中文字`);
  }
  assert.deepEqual(bad, []);
});
test('題目、選項、直覺題、解說：結構和中文一樣', () => {
  assert.equal(Object.keys(x.EN.items).length, 64);
  assert.deepEqual(Object.keys(x.EN.pairs).sort(), ['R01', 'R02', 'R03', 'R04']);
  assert.deepEqual(Object.keys(x.EN.attn).sort(), ['Q01', 'Q02']);
  assert.equal(x.EN.scale.length, 5); assert.equal(x.EN.scaleL.length, 5);
  for (const t of 'DISC') assert.equal(x.EN.blind[t].filter(Boolean).length, 2);
  assert.deepEqual(Object.keys(x.EN.R).sort(), Object.keys(x.R_V3).sort());
  assert.deepEqual(Object.keys(x.EN.SUB).sort(), Object.keys(x.SUB_V3).sort());
  for (const [k, z] of Object.entries(x.R_V3)) for (const [f, v] of Object.entries(z)) {
    const e = x.EN.R[k][f];
    assert.ok(e !== undefined, `${k}.${f} 沒有英文`);
    if (Array.isArray(v)) assert.equal(e.length, v.length, `${k}.${f} 條數不一致`);
    for (const [, s] of flat(e, '')) assert.ok(!CJK.test(s), `${k}.${f} 英文裡有中文字`);
  }
});
test('個人資料選項：每個送出值都有英文，英文沒有多出來的值', () => {
  const vals = [...html.matchAll(/<option value="([^"]+)">/g)].map(m => m[1]);
  assert.deepEqual([...new Set(vals)].sort(), Object.keys(x.EN.opts).sort());
});
test('HTML 裡的固定文字和中文字典一致', () => {
  const bad = [];
  for (const m of html.matchAll(/data-i18n="([\w.]+)"[^>]*>([^<]*)</g)) if (x.ZH.ui[m[1]] !== m[2]) bad.push(`${m[1]}：HTML「${m[2]}」／字典「${x.ZH.ui[m[1]]}」`);
  assert.deepEqual(bad, []);
});
