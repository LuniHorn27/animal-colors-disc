// 靜態場景繪製：天空、遠山、森林、地面、土路、石頭、草、路牌。
// 不畫山屋與小屋（hut.js）、不畫騎士（rider.js）、不畫暗幕（light.js）。
import { groundY } from './world.js';

const TAU = Math.PI * 2;
export const START_X = 70;

function pine(ctx, x, y, h, col) {
  ctx.fillStyle = col;
  const w = h * 0.32;
  ctx.fillRect(x - h * 0.025, y - h * 0.14, h * 0.05, h * 0.14);
  for (let k = 0; k < 4; k++) {
    const ty = y - h * 0.1 - k * h * 0.2, tw = w * (1 - k * 0.2);
    ctx.beginPath();
    ctx.moveTo(x - tw, ty);
    ctx.lineTo(x, ty - h * 0.34);
    ctx.lineTo(x + tw, ty);
    ctx.closePath();
    ctx.fill();
  }
}

function sign(ctx, view, x, text) {
  const X = x - view.camX, y = view.h * 0.7 + groundY(x) - view.camY;
  if (X < -120 || X > view.w + 120) return;
  ctx.fillStyle = '#4a3a28';
  ctx.fillRect(X - 3, y - 70, 6, 70);
  ctx.fillStyle = '#8a6e48';
  ctx.fillRect(X - 52, y - 82, 104, 30);
  ctx.fillStyle = '#fff0cc';
  ctx.font = '600 14px "Noto Sans TC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, X, y - 67);
}

export function drawScene(ctx, view, scenery, placed, worldLength) {
  const { w: W, h: H, camX, camY, t } = view;
  const sx = (x) => x - camX;
  const sy = (x) => H * 0.7 + groundY(x) - camY;

  // 天空
  let g = ctx.createLinearGradient(0, 0, 0, H * 0.7);
  g.addColorStop(0, '#04060d');
  g.addColorStop(1, '#080e18');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  scenery.stars.forEach((s) => {
    ctx.fillStyle = 'rgba(225,232,255,' + (0.35 + 0.25 * Math.sin(t * 0.002 + s.p)) + ')';
    ctx.fillRect((((s.x * W - camX * 0.02) % W) + W) % W, s.y * H, s.s, s.s);
  });

  // 遠山兩層
  [[0.12, 0.46, '#0d1624', 46, 1.3], [0.26, 0.54, '#0e1a22', 38, 2.6]].forEach(([par, band, col, amp, ph]) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W + 10; x += 10) {
      const wx = x + camX * par;
      ctx.lineTo(x, H * band - camY * par * 0.8 - amp * (Math.sin(wx * 0.003 + ph) * 0.6 + Math.sin(wx * 0.0087 + ph * 2) * 0.4));
    }
    ctx.lineTo(W, H);
    ctx.fill();
  });

  // 中景森林
  scenery.midTrees.forEach((tr) => {
    const x = tr.x - camX * 0.45;
    if (x < -80 || x > W + 80) return;
    pine(ctx, x, H * 0.66 - camY * 0.5 + 16 * Math.sin(tr.x * 0.004), tr.h, '#1b3029');
  });
  ctx.fillStyle = '#16241f';
  ctx.fillRect(0, H * 0.66 - camY * 0.5 + 8, W, H);

  // 地面
  g = ctx.createLinearGradient(0, H * 0.5, 0, H);
  g.addColorStop(0, '#2b3b33');
  g.addColorStop(1, '#0c130f');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, H + 20);
  for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, sy(camX + x));
  ctx.lineTo(W, H + 20);
  ctx.fill();

  scenery.backTrees.forEach((tr) => {
    const x = sx(tr.x);
    if (x < -90 || x > W + 90) return;
    pine(ctx, x, sy(tr.x) - 10 - tr.s * 10, tr.h, '#26443a');
  });

  // 土路
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#a08c68';
  ctx.lineWidth = 15;
  ctx.beginPath();
  for (let x = 0; x <= W + 8; x += 8) {
    const y = sy(camX + x) + 8;
    x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(205,185,140,.7)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = 0; x <= W + 8; x += 8) {
    const y = sy(camX + x) + 1.5;
    x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();

  scenery.rocks.forEach((r) => {
    const x = sx(r.x);
    if (x < -30 || x > W + 30) return;
    ctx.fillStyle = '#6d7a78';
    ctx.beginPath();
    ctx.ellipse(x, sy(r.x) + 19 + r.o, r.w, r.w * 0.6, 0, Math.PI, TAU);
    ctx.fill();
  });
  scenery.tufts.forEach((f) => {
    const x = sx(f.x);
    if (x < -10 || x > W + 10) return;
    const y = sy(f.x) + 2;
    ctx.strokeStyle = '#4f7a5e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + f.a * 10, y - f.h * 0.6, x + f.a * 22, y - f.h);
    ctx.stroke();
  });

  sign(ctx, view, START_X, '出發');
  sign(ctx, view, worldLength, '路還沒走完');
}
