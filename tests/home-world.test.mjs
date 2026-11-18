// 地形與固定亂數場景：純邏輯測試。
import test from 'node:test';
import assert from 'node:assert/strict';
import { groundY, buildScenery } from '../home/ride/world.js';

test('groundY 沿用原型公式', () => {
  assert.equal(groundY(0), 0);
  const x = 1000;
  assert.ok(Math.abs(groundY(x) - (-x * 0.03 + 18 * Math.sin(x * 0.0035) + 10 * Math.sin(x * 0.011))) < 1e-9);
});

test('buildScenery 每次結果相同（固定種子）', () => {
  assert.deepEqual(buildScenery(10800, [70, 4400]), buildScenery(10800, [70, 4400]));
});

test('樹不會長在路標與山屋位置上', () => {
  const wps = [70, 2000, 4400, 10800];
  const { backTrees } = buildScenery(10800, wps);
  assert.ok(backTrees.length > 0);
  for (const t of backTrees) for (const w of wps) assert.ok(Math.abs(t.x - w) >= 150);
});

test('場景物件數量與世界長度有關，空路標清單不當機', () => {
  const s = buildScenery(5000, []);
  for (const k of ['midTrees', 'backTrees', 'rocks', 'tufts', 'stars', 'flies']) assert.ok(s[k].length > 0, k);
});
