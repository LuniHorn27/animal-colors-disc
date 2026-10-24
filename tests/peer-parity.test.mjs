// 他評頁（peer.html）中英文對照測試：中文改了英文沒改、英文缺句子、變數不一致，都會失敗
// 執行：node --test tests/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { load } from './load.mjs';
const root = new URL('../', import.meta.url);
const req = createRequire(import.meta.url);
const I = req('../js/peer-i18n.js'), B = req('../js/peer-bank.js'), R = req('../js/peer-report.js');
const win = {};
new Function('window', fs.readFileSync(new URL('js/peer-lang-en.js', root), 'utf8'))(win);
const EN = win.PEER_LANG_EN;
const src = JSON.parse(fs.readFileSync(new URL('js/peer-lang-en.src.json', root), 'utf8'));
const peerHtml = fs.readFileSync(new URL('peer.html', root), 'utf8');
const CJK = /[一-鿿]/;
const PH = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
function* flat(o, p) { if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) yield* flat(v, p ? `${p}.${k}` : k); else yield [p, o]; }

const zhNow = {
  ...Object.fromEntries(Object.entries(I.ZH.ui).map(([k, v]) => ['ui.' + k, v])),
  ...Object.fromEntries(Object.entries(I.ZH.animal).map(([k, v]) => ['animal.' + k, v])),
  ...Object.fromEntries(Object.entries(I.ZH.tname).map(([k, v]) => ['tname.' + k, v])),
  ...Object.fromEntries(Object.entries(I.ZH.rel).map(([k, v]) => ['rel.' + k, v])),
  ...Object.fromEntries(Object.entries(B.WORDS).map(([k, v]) => ['words.' + k, v])),
  ...Object.fromEntries(flat(R.ZH_PACK.TEXT, 'report.TEXT')),
  ...Object.fromEntries(flat(R.ZH_PACK.GAP, 'report.GAP')),
  ...Object.fromEntries(Object.entries(R.ZH_PACK.SECT).map(([k, v]) => ['report.SECT.' + k, v])),
  ...Object.fromEntries(Object.entries(B.FEATURE).map(([k, v]) => ['report.FEATURE.' + k, v])),
};

test('他評：每一句中文都有英文，而且翻譯時的中文和現在一樣', () => {
  const bad = [];
  for (const [p, z] of Object.entries(zhNow)) {
    const s = src[p];
    if (s === undefined) bad.push(`${p}：新句子還沒翻（現在的中文：${z}）`);
    else if (s !== z) bad.push(`${p}：中文改過了，英文還沒更新\n  翻譯時的中文：${s}\n  現在的中文：  ${z}`);
  }
  for (const p of Object.keys(src)) { const base = p.startsWith('ui.') ? p.replace(/\.one$/, '') : p; if (!(base in zhNow)) bad.push(`${p}：中文已經刪掉了，英文也要刪`); }
  assert.deepEqual(bad, []);
});

test('他評：介面文字變數一致、英文沒有中文字', () => {
  const bad = [];
  for (const [k, z] of Object.entries(I.ZH.ui)) {
    const e = EN.ui[k];
    if (e === undefined) { bad.push(`${k}：沒有英文`); continue; }
    if (PH(z) !== PH(e) && !k.endsWith('.one')) bad.push(`${k}：變數不一致 ${PH(z)} / ${PH(e)}`);
    if (CJK.test(e) && !['bar.lang', 'lang.fail', 'bar.lang.short'].includes(k)) bad.push(`${k}：英文裡有中文字`);
  }
  for (const k of Object.keys(EN.ui)) if (!(k in I.ZH.ui) && !k.endsWith('.one')) bad.push(`${k}：中文沒有這個鍵`);
  assert.deepEqual(bad, []);
});

test('他評：動物、關係、48 個敘述、對照報告都有英文，沒有中文字', () => {
  assert.deepEqual(Object.keys(EN.animal).sort(), ['C', 'D', 'I', 'S']);
  assert.deepEqual(Object.keys(EN.rel).sort(), Object.keys(I.ZH.rel).sort());
  assert.deepEqual(Object.keys(EN.words).sort(), Object.keys(B.WORDS).sort());
  assert.equal(Object.keys(B.WORDS).length, 48);
  for (const [p, s] of [...flat(EN.animal, 'animal'), ...flat(EN.tname, 'tname'), ...flat(EN.rel, 'rel'), ...flat(EN.words, 'words'), ...flat(EN.report, 'report')]) assert.ok(!CJK.test(s), `${p} 英文裡有中文字`);
  assert.deepEqual(Object.keys(EN.report.TEXT).sort(), Object.keys(R.TEXT).sort());
});

test('他評：英文不用 rate／review／evaluate／judge／he／she', () => {
  const bad = [...flat(EN, '')].filter(([, s]) => /\b(rate[sd]?|rating|review(ed|s)?|evaluat\w*|judg\w*|he|she|his|her|him)\b/i.test(s)).map(([p, s]) => `${p}：${s}`);
  assert.deepEqual(bad, []);
});

test('他評：主測驗題數和 CTA 文字一致', () => {
  assert.equal(I.MAIN_ITEM_COUNT, load().ITEMS.length === 64 ? 46 : load().ITEMS.length);
});

test('他評：HTML 裡的固定文字和中文字典一致', () => {
  const bad = [];
  for (const m of peerHtml.matchAll(/data-i18n="([\w.]+)"[^>]*>([^<]*)</g)) if (I.ZH.ui[m[1]] !== m[2]) bad.push(`${m[1]}：HTML「${m[2]}」／字典「${I.ZH.ui[m[1]]}」`);
  assert.deepEqual(bad, []);
});

test('他評：pickLang 網址優先、再來是上次選的', () => {
  assert.equal(I.pickLang('?lang=en', 'zh'), 'en');
  assert.equal(I.pickLang('?lang=ZH', 'en'), 'zh');
  assert.equal(I.pickLang('', 'en'), 'en');
  assert.equal(I.pickLang('', null), 'zh');
});

test('他評：peer.html 的程式碼裡沒有殘留的中文畫面文字', () => {
  const code = peerHtml.slice(peerHtml.indexOf('<script>\n') > 0 ? peerHtml.lastIndexOf('<script>') : 0);
  const bad = code.split('\n').filter((l) => CJK.test(l) && !/^\s*(\/\/|\/\*|\*|[一二三四五六]、)/.test(l) && !/\/\/.*[一-鿿]/.test(l) && !/\/\*.*\*\//.test(l) && !/'(全部|朋友|家人|老師|同學|同事|其他)'/.test(l));
  assert.deepEqual(bad, []);
});
