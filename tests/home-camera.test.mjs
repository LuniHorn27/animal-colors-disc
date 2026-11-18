// 相機跟隨：純邏輯測試。
import test from 'node:test';
import assert from 'node:assert/strict';
import { followCamera } from '../home/ride/camera.js';

const L = 8000, W = 800;

test('followCamera 永遠落在 [-200, worldLength + 200 - viewW]', () => {
  for (const px of [-1000, 0, 4000, 9000, 99999]) {
    for (const face of [1, -1]) {
      const c = followCamera(0, px, face, 1, W, 1, L);
      assert.ok(c >= -200 && c <= L + 200 - W);
    }
  }
});

test('慢慢趨近目標，不一步到位', () => {
  const c = followCamera(0, 4000, 1, 0, W, 1 / 60, L);
  assert.ok(c > 0 && c < 4000 - W * 0.4);
});

test('朝右騎快時玩家在畫面偏左（相機 x 較大），朝左則相反', () => {
  const right = followCamera(3000, 3500, 1, 1, W, 100, L);
  const left = followCamera(3000, 3500, -1, 1, W, 100, L);
  assert.ok(right > left);
});
