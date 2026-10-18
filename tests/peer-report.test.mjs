// js/peer-report.js（評的人看到的第三人稱解析文字）的測試
// 執行：node --test tests/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const R = createRequire(import.meta.url)('../js/peer-report.js');

test('11 種類型都有', () => assert.deepEqual(Object.keys(R.TEXT).sort(), ['C', 'CD', 'CH', 'D', 'DI', 'DS', 'I', 'IC', 'IS', 'S', 'SC']));
test('描述小安的段落沒有殘留第二人稱「你」', () => Object.entries(R.TEXT).forEach(([k, t]) =>
  ['one', 'core', 'good', 'comm', 'stress'].forEach((f) => assert.ok(!JSON.stringify(t[f]).includes('你'), k + '.' + f))));
test('不含盲點等不給評的人看的欄位', () => Object.values(R.TEXT).forEach((t) =>
  ['blind', 'stressTip', 'env', 'jobs', 'tips'].forEach((k) => assert.ok(!(k in t)))));
test('每種類型都有名稱、代碼與各段落', () => Object.values(R.TEXT).forEach((t) => {
  ['name', 'code', 'one', 'commTip'].forEach((k) => assert.equal(typeof t[k], 'string'));
  ['core', 'good', 'comm', 'stress'].forEach((k) => assert.ok(Array.isArray(t[k]) && t[k].length > 0));
}));
test('esc 跳脫 HTML', () => assert.equal(R.esc(`<a href="x">'&`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;'));
test('名字跳脫（Review Focus 1）', () => assert.equal(R.fill('{name}很熱情', '<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;很熱情'));
test('fill 代入每一個 {name}', () => assert.equal(R.fill('{name}和{name}', '小安'), '小安和小安'));
test('sections 順序與標題', () => assert.deepEqual(R.sections('I', '小安').map((s) => s.title), ['小安的核心特質', '小安的優勢', '小安的溝通方式', '壓力下的小安']));
test('溝通方式附上和小安溝通的小提醒', () => {
  const comm = R.sections('S', '小安')[2];
  assert.equal(comm.tip[0], '和小安溝通的小提醒');
  assert.ok(comm.tip[1].startsWith('和小安溝通時'));
});
test('sections 內容已代入名字', () => assert.ok(!JSON.stringify(R.sections('D', '小安')).includes('{name}')));
