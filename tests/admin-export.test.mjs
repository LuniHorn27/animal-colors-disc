// 後台 Excel：題庫解析、公式、說明頁。用假的工作表測，不需要 ExcelJS，也沒有真實資料。
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { html } from './load.mjs';

const api = createRequire(import.meta.url)('../js/admin-export.js');

function fakeSheet(cells = {}) {
  const get = (r, c) => { const k = `${r}:${c}`; return (cells[k] ||= { value: null }); };
  return {
    cells,
    getRow: (r) => ({ getCell: (c) => get(r, c) }),
    getCell: (a) => (cells[a] ||= { value: null }),
    eachRow(fn) {
      const rows = new Set(Object.keys(cells).filter((k) => k.includes(':')).map((k) => Number(k.split(':')[0])));
      for (const r of rows) {
        fn({
          getCell: (c) => get(r, c),
          eachCell: (f) => Object.keys(cells).filter((k) => k.startsWith(r + ':')).forEach((k) => f(cells[k])),
        });
      }
    },
  };
}
function fakeBook() {
  const sheets = {
    作答總表: fakeSheet(),
    統計: fakeSheet({ '3:2': { value: { formula: "COUNTIF('作答總表'!$F$3:$F$1001,\"單一型\")" } } }),
    每題答案: fakeSheet(),
    說明: fakeSheet({
      '2:1': { value: '資料來源' }, '2:2': { value: null },
      '4:1': { value: '測試資料' }, '4:2': { value: null },
      '18:1': { value: '類型「無法判定」' }, '18:2': { value: null },
      '19:1': { value: '重複作答' }, '19:2': { value: null },
    }),
  };
  return { sheets, getWorksheet: (n) => sheets[n] };
}
const row = (over) => ({
  no: 1, t: '2026-11-04 10:00:00', sid: 'a', name: '王小明', email: 'a@example.com', age: '25-34', gender: '生理男',
  kind: 'single', key: 'D', primary: 'D', d: 4, i: 3, s: 2, c: 1, ms: 120500, attn: 0, blind: 'D', blind2: 'I',
  rating: 5, is_test: false, answers: { D01: 5, R01: 1 }, peer_invited: true, peer_replies: 2, google: false, ...over,
});

test('題庫解析出 70 題，矛盾題有原題', () => {
  const b = api.parseBank(html);
  assert.equal(Object.keys(b.txt).length, 70);
  assert.equal(Object.keys(b.pair).length, 4);
});

test('題庫題數不對時停下來，不產出錯誤檔案', () => {
  assert.throws(() => api.parseBank('<html></html>'));
});

test('填入作答列、公式範圍依人數調整、說明頁自動產生', () => {
  const b = api.parseBank(html);
  const wb = fakeBook();
  const data = {
    code: 'demo', name: '示範班', closes_at: '2026-12-12T15:59:00Z',
    rows: [row(), row({ no: 2, sid: 'a', kind: 'none', key: 'none', primary: null }), row({ no: 3, sid: 'b', name: '李小華', kind: 'combo', key: 'DS', primary: 'S', is_test: true })],
  };
  api.fillWorkbook(wb, data, b, new Date('2026-11-04T08:00:00Z'));
  const s = wb.sheets.作答總表.cells;
  assert.equal(s['3:7'].value, 'D 老虎');
  assert.equal(s['4:8'].value, '無法判定');
  assert.equal(s['5:6'].value, '對角型');
  assert.equal(s['5:7'].value, 'D 老虎＋S 無尾熊');
  assert.equal(s['3:18'].value, 120, '120.5 秒和 Python 一樣取偶數');
  assert.match(s['3:21'].value.formula, /^IF\(R3<88/);
  assert.equal(s['3:30'].value, '是');
  assert.equal(wb.sheets.統計.cells['3:2'].value.formula, "COUNTIF('作答總表'!$F$3:$F$5,\"單一型\")");
  assert.equal(wb.sheets.統計.cells.A2.value, '班級代碼 demo；資料匯出時間 2026-11-04（台灣時間）');
  assert.equal(wb.sheets.每題答案.cells['2:3'].value, 5);
  const n = wb.sheets.說明.cells;
  assert.match(n['2:2'].value, /共 3 份作答（2 位學生）.*2026-12-12 23:59/);
  assert.match(n['4:2'].value, /有 1 筆/);
  assert.match(n['18:2'].value, /流水號 2/);
  assert.match(n['19:2'].value, /王小明（1、2）/);
});

test('檔名用台灣日期', () => {
  assert.equal(api.fileName('demo', new Date('2026-11-04T17:00:00Z')), 'demo_作答資料_2026-11-05.xlsx');
});

test('聯絡名單的類型文字', () => {
  assert.equal(api.keyLabel('D'), 'D 老虎');
  assert.equal(api.keyLabel('IS'), 'I 孔雀＋S 無尾熊');
  assert.equal(api.keyLabel('chameleon'), '變色龍');
  assert.equal(api.keyLabel(null), '');
});
