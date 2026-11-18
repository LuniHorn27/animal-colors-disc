// 首頁工具資料與位置：純邏輯測試。
import test from 'node:test';
import assert from 'node:assert/strict';
import { TOOLS, placeTools, SPACING, FIRST_X, END_PAD } from '../home/ride/tools.js';

test('DISC 位在 x=4400，順序為 closed, disc, closed, closed', () => {
  const { placed } = placeTools(TOOLS);
  assert.equal(placed.length, 4);
  assert.deepEqual(placed.map((t) => t.status), ['closed', 'open', 'closed', 'closed']);
  const disc = placed.find((t) => t.id === 'disc');
  assert.equal(disc.x, 4400);
  assert.equal(disc.name, '找尋你的動物本色');
  assert.equal(disc.href, '/animal-colors-disc/');
});

test('新增一筆工具，worldLength 增加 SPACING', () => {
  const before = placeTools(TOOLS).worldLength;
  const more = [...TOOLS, { id: 'x', name: 'X', href: null, status: 'closed' }];
  assert.equal(placeTools(more).worldLength, before + SPACING);
});

test('空清單不當機，placed 為空，worldLength 為 FIRST_X + END_PAD', () => {
  const r = placeTools([]);
  assert.deepEqual(r.placed, []);
  assert.equal(r.worldLength, FIRST_X + END_PAD);
});

test('closed 的工具也在 placed 裡', () => {
  const { placed } = placeTools([{ id: 'a', name: 'A', href: null, status: 'closed' }]);
  assert.equal(placed.length, 1);
  assert.equal(placed[0].x, FIRST_X);
});

test('href 為 null 的開放工具視為錯誤資料，降為 closed，且不改動原資料', () => {
  const input = [{ id: 'bad', name: 'B', href: null, status: 'open' }];
  const { placed } = placeTools(input);
  assert.equal(placed[0].status, 'closed');
  assert.equal(input[0].status, 'open');
});

test('沒有任何開放工具時不當機', () => {
  const { placed } = placeTools([{ id: 'a', name: 'A', href: null, status: 'closed' }]);
  assert.equal(placed.filter((t) => t.status === 'open').length, 0);
});
