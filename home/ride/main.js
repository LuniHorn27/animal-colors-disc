// 首頁主程式：組裝資料、輸入、物理、場景、騎士、暗幕與主迴圈。
import { TOOLS, placeTools } from './tools.js';
import { groundY, buildScenery } from './world.js';
import { drawScene, drawFireflies, START_X } from './scene.js';
import { followCamera } from './camera.js';
import { createInput } from './input.js';
import { VEHICLES, stepVehicle, lampParams, computeAim } from './vehicle.js';
import { drawRider } from './rider.js';
import { drawDarkness, drawLampGlow, drawGlow } from './light.js';
import { drawHutStructure, drawHutLights, drawClosedCabin } from './hut.js';
import { createUi } from './ui.js';
import { initMusicControls } from './music.js';

initMusicControls();

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const odo = document.getElementById('odo');
const hint = document.getElementById('hint');
const { placed, worldLength } = placeTools(TOOLS);
const scenery = buildScenery(worldLength, [START_X, worldLength, ...placed.map((p) => p.x)]);
const cfg = window.matchMedia('(pointer: coarse)').matches
  ? { ...VEHICLES.bicycle, vmax: 240 } // 手機觸控時降低最高速度，讓短按更容易控制
  : VEHICLES.bicycle;
const bounds = { min: START_X - 10, max: worldLength };
const input = createInput(window);
// 作業系統開了「減少動態」：關閉閃爍、螢火蟲飄動、炊煙、車身起伏（仍可手動騎車）
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';

let v = { x: 240, vx: 0, face: 1 };
// Tab 聚焦到山屋連結時，把玩家移到山屋前 200 像素，相機自然跟過去
const ui = createUi(document.getElementById('overlay'), placed, {
  input,
  onFocusTool(x) { v = { ...v, x: Math.min(Math.max(x - 200, START_X - 10), worldLength), vx: 0, face: 1 }; },
});
const openTools = placed.filter((p) => p.status === 'open');

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
  drawScene(ctx, { w: W, h: H, camX, camY, t, reduced }, scenery, placed, worldLength);
  placed.forEach((p) => { if (p.status !== 'open') drawClosedCabin(ctx, { w: W, h: H, camX, camY }, p.x); });
  const hutView = { w: W, h: H, camX, camY };
  openTools.forEach((p) => { const hx = p.x - camX; if (hx > -200 && hx < W + 200) drawHutStructure(ctx, hutView, p.x); });
  const { lamp } = drawRider(ctx, { x: X, y: Y, face: v.face, speedRatio: sp, wheelAngle: wheelA, pedalPhase: phase, slope, scale: S, bob: !reduced });

  const stopped = Math.abs(v.vx) < 30;
  const mouseState = { x: mouse.x, y: mouse.y, ageMs: t - mouse.t };
  aim = computeAim({ face: v.face, slope, speedRatio: sp, wheelPhase: wheelA, stopped, mouse: mouseState, lamp, prevAim: aim, dt });
  const lp = lampParams(sp, cfg);
  const flicker = reduced ? 1 : 1 + 0.03 * Math.sin(t * 0.011) + 0.02 * Math.sin(t * 0.027);
  drawDarkness(ctx, { w: W, h: H, dpr: DPR }, lamp, aim, { len: lp.len * S, half: lp.half, flicker },
    [{ x: X, y: Y - 40 * S, r: 130 * S, a: 0.9 },
      ...openTools.filter((p) => p.x - camX > -400 && p.x - camX < W + 400)
        .map((p) => ({ x: p.x - camX, y: H * 0.7 + groundY(p.x) - camY - 60, r: 320, a: 0.8 }))]);
  drawLampGlow(ctx, lamp, aim, X, Y, S);
  // 遠方暖色光暈：離最近的開放山屋越近越亮，貼在畫面邊緣
  let nearest = null;
  openTools.forEach((p) => { if (!nearest || Math.abs(v.x - p.x) < Math.abs(v.x - nearest.x)) nearest = p; });
  if (nearest) {
    const hsx = Math.min(W + 60, Math.max(-60, nearest.x - camX));
    ctx.globalCompositeOperation = 'lighter';
    drawGlow(ctx, hsx, H * 0.5, 380, Math.min(1, Math.max(0, 1 - Math.abs(v.x - nearest.x) / 3500)) * 0.1 + 0.02, '255,190,110');
    ctx.globalCompositeOperation = 'source-over';
  }
  openTools.forEach((p) => { const hx = p.x - camX; if (hx > -300 && hx < W + 300) drawHutLights(ctx, hutView, p.x, t, reduced); });
  drawFireflies(ctx, hutView, scenery.flies, t, reduced);
  ui.update({ playerX: v.x, camX, camY, viewW: W, viewH: H, groundY });

  odo.textContent = '已騎 ' + Math.round((v.x - START_X) / 90) + ' 公尺';
  hint.style.opacity = walked > 500 ? 0 : 0.55;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
