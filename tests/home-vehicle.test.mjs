// 載具物理、車燈瞄準：純邏輯測試。
import test from 'node:test';
import assert from 'node:assert/strict';
import { VEHICLES, stepVehicle, lampParams, computeAim } from '../home/ride/vehicle.js';

const cfg = VEHICLES.bicycle;
const bounds = { min: -200, max: 10000 };
const run = (s, input, seconds, dt = 1 / 60) => {
  for (let t = 0; t < seconds - 1e-9; t += dt) s = stepVehicle(s, input, dt, cfg, bounds);
  return s;
};

test('按住右鍵 1 秒：速度在 (0.5*vmax, vmax]，放開 0.1 秒後仍有慣性', () => {
  let s = run({ x: 0, vx: 0, face: 1 }, { left: false, right: true }, 1);
  assert.ok(s.vx > 0.5 * cfg.vmax && s.vx <= cfg.vmax);
  s = run(s, { left: false, right: false }, 0.1);
  assert.ok(s.vx > 0);
});

test('同時按左右：60 幀後不動，不抖動', () => {
  let s = { x: 100, vx: 0, face: 1 };
  for (let i = 0; i < 60; i++) {
    s = stepVehicle(s, { left: true, right: true }, 1 / 60, cfg, bounds);
    assert.ok(Math.abs(s.vx) < 1);
  }
  assert.equal(s.x, 100);
});

test('dt = 5（分頁切回）一幀位移不超過 vmax * 0.05', () => {
  const s = stepVehicle({ x: 0, vx: cfg.vmax, face: 1 }, { left: false, right: true }, 5, cfg, bounds);
  assert.ok(s.x <= cfg.vmax * 0.05 + 1e-9);
});

test('越過 bounds 會被夾住', () => {
  const hi = run({ x: 9990, vx: cfg.vmax, face: 1 }, { left: false, right: true }, 1);
  assert.equal(hi.x, bounds.max);
  const lo = run({ x: -190, vx: -cfg.vmax, face: -1 }, { left: true, right: false }, 1);
  assert.equal(lo.x, bounds.min);
});

test('face：速度夠大才轉向，慢速不改', () => {
  assert.equal(stepVehicle({ x: 0, vx: -300, face: 1 }, { left: true, right: false }, 1 / 60, cfg, bounds).face, -1);
  assert.equal(stepVehicle({ x: 0, vx: 0, face: -1 }, { left: false, right: false }, 1 / 60, cfg, bounds).face, -1);
});

test('lampParams：越快照越遠、越窄', () => {
  assert.ok(lampParams(1, cfg).len > lampParams(0, cfg).len);
  assert.ok(lampParams(1, cfg).half < lampParams(0, cfg).half);
});

const base = { face: 1, slope: 0, speedRatio: 0, wheelPhase: 0, stopped: false, mouse: null, lamp: { x: 0, y: 0 }, prevAim: 0.09, dt: 1 };

test('computeAim：行進中滑鼠不影響', () => {
  const a = computeAim({ ...base, mouse: { x: 0, y: -500, ageMs: 100 } });
  assert.ok(Math.abs(a - 0.09) < 1e-9);
});

test('computeAim：停下且滑鼠剛動過時朝滑鼠', () => {
  const a = computeAim({ ...base, stopped: true, mouse: { x: 0, y: 500, ageMs: 100 }, prevAim: Math.PI / 2 });
  assert.ok(Math.abs(a - Math.PI / 2) < 1e-6);
});

test('computeAim：滑鼠超過 4000 毫秒回到朝前', () => {
  const a = computeAim({ ...base, stopped: true, mouse: { x: 0, y: 500, ageMs: 4001 } });
  assert.ok(Math.abs(a - 0.09) < 1e-9);
});

test('computeAim：face = -1 朝前角度接近 π，且走最短角度', () => {
  const a = computeAim({ ...base, face: -1, prevAim: Math.PI - 0.09 });
  assert.ok(Math.abs(a - (Math.PI - 0.09)) < 1e-9);
  const b = computeAim({ ...base, face: -1, prevAim: -Math.PI + 0.05, dt: 0.01 });
  assert.ok(Math.abs(b) > 3, '不可繞遠路經過 0');
});
