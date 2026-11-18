// 首頁主程式：組裝資料、輸入、物理、場景、騎士、暗幕與主迴圈。
import { TOOLS, placeTools } from './tools.js';
import { groundY, buildScenery } from './world.js';
import { drawScene, START_X } from './scene.js';
import { followCamera } from './camera.js';
import { createInput } from './input.js';
import { VEHICLES, stepVehicle, lampParams, computeAim } from './vehicle.js';
import { drawRider } from './rider.js';
import { drawDarkness, drawLampGlow } from './light.js';

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const odo = document.getElementById('odo');
const hint = document.getElementById('hint');
const { placed, worldLength } = placeTools(TOOLS);
const scenery = buildScenery(worldLength, [START_X, worldLength, ...placed.map((p) => p.x)]);
const cfg = VEHICLES.bicycle;
const bounds = { min: START_X - 10, max: worldLength };
const input = createInput(window);

let W = 0, H = 0, DPR = 1, S = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  S = Math.max(0.7, Math.min(1.25, H / 680));
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize);
resize();

const mouse = { x: 0, y: 0, t: -1e9 };
window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.t = performance.now(); });

let v = { x: 240, vx: 0, face: 1 };
let camX = 0, camY = 0, last = 0, wheelA = 0, phase = 0, aim = 0.09, walked = 0;

function frame(t) {
  const dt = Math.min(0.05, (t - last) / 1000 || 0);
  last = t;
  v = stepVehicle(v, input.state, dt, cfg, bounds);
  wheelA += (v.vx * dt) / 21;
  phase += v.vx * dt * 0.026;
  walked = Math.max(walked, Math.abs(v.x - 240));
  const sp = Math.min(1, Math.abs(v.vx) / cfg.vmax);
  camX = followCamera(camX, v.x, v.face, sp, W, dt, worldLength);
  camY += (groundY(v.x) - camY) * Math.min(1, dt * 3);

  const X = v.x - camX, Y = H * 0.7 + groundY(v.x) - camY + 2;
  const slope = Math.atan2(groundY(v.x + 10) - groundY(v.x - 10), 20);

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  drawScene(ctx, { w: W, h: H, camX, camY, t }, scenery, placed, worldLength);
  const { lamp } = drawRider(ctx, { x: X, y: Y, face: v.face, speedRatio: sp, wheelAngle: wheelA, pedalPhase: phase, slope, scale: S });

  const stopped = Math.abs(v.vx) < 30;
  const mouseState = { x: mouse.x, y: mouse.y, ageMs: t - mouse.t };
  aim = computeAim({ face: v.face, slope, speedRatio: sp, wheelPhase: wheelA, stopped, mouse: mouseState, lamp, prevAim: aim, dt });
  const lp = lampParams(sp, cfg);
  const flicker = 1 + 0.03 * Math.sin(t * 0.011) + 0.02 * Math.sin(t * 0.027);
  drawDarkness(ctx, { w: W, h: H, dpr: DPR }, lamp, aim, { len: lp.len * S, half: lp.half, flicker },
    [{ x: X, y: Y - 40 * S, r: 130 * S, a: 0.9 }]);
  drawLampGlow(ctx, lamp, aim, X, Y, S);

  odo.textContent = '已騎 ' + Math.round((v.x - START_X) / 90) + ' 公尺';
  hint.style.opacity = walked > 500 ? 0 : 0.55;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
