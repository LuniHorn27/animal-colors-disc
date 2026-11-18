// 載具設定與物理、車燈瞄準（純邏輯，不碰 DOM）。
// 之後換載具，只要在 VEHICLES 加一份設定。

export const VEHICLES = {
  bicycle: { vmax: 470, accelHold: 2.3, accelCoast: 0.9, lampLenBase: 340, lampLenGain: 280, halfBase: 0.44, halfGain: -0.14 },
};

const MAX_DT = 0.05; // 分頁切走再回來時，時間差很大，先夾住避免車子瞬間衝出去
const FACE_THRESHOLD = 25;

export function stepVehicle(s, input, dt, cfg, bounds) {
  const d = Math.min(Math.max(dt, 0), MAX_DT);
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0); // 左右同時按 = 0
  const target = dir * cfg.vmax;
  const rate = dir !== 0 ? cfg.accelHold : cfg.accelCoast;
  const vx = s.vx + (target - s.vx) * Math.min(1, d * rate);
  const x = Math.min(bounds.max, Math.max(bounds.min, s.x + vx * d));
  const face = Math.abs(vx) > FACE_THRESHOLD ? (vx > 0 ? 1 : -1) : s.face;
  return { x, vx, face };
}

export function lampParams(speedRatio, cfg) {
  return {
    len: cfg.lampLenBase + cfg.lampLenGain * speedRatio,
    half: cfg.halfBase + cfg.halfGain * speedRatio,
  };
}

// 角度以「朝右 = 0」計。朝左時以 π 減去朝右的偏移，讓上坡抬高、過坑晃動左右一致。
export function computeAim(p) {
  const offset = 0.09 + p.slope * 0.7 + Math.sin(p.wheelPhase * 2.1) * 0.016 * p.speedRatio;
  let target = p.face === -1 ? Math.PI - offset : offset;
  if (p.stopped && p.mouse && p.mouse.ageMs < 4000) {
    target = Math.atan2(p.mouse.y - p.lamp.y, p.mouse.x - p.lamp.x);
  }
  let diff = target - p.prevAim;
  diff = Math.atan2(Math.sin(diff), Math.cos(diff)); // 最短角度
  return p.prevAim + diff * Math.min(1, p.dt * 9);
}
