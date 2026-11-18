// 首頁主程式：組裝資料、場景與主迴圈。
import { TOOLS, placeTools } from './tools.js';
import { groundY, buildScenery } from './world.js';
import { drawScene, START_X } from './scene.js';
import { followCamera } from './camera.js';

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const { placed, worldLength } = placeTools(TOOLS);
const scenery = buildScenery(worldLength, [START_X, worldLength, ...placed.map((p) => p.x)]);

let W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// 這一步玩家固定在 x = 240（騎乘操作在後面的步驟加入）
const player = { x: 240, face: 1 };
let camX = 0, camY = 0, last = 0;

function frame(t) {
  const dt = Math.min(0.05, (t - last) / 1000 || 0);
  last = t;
  camX = followCamera(camX, player.x, player.face, 0, W, dt, worldLength);
  camY += (groundY(player.x) - camY) * Math.min(1, dt * 3);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  drawScene(ctx, { w: W, h: H, camX, camY, t }, scenery, placed, worldLength);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
