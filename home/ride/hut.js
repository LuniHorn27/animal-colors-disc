// 山屋（開放工具）與暗著的小屋（未開放工具）的繪製。
import { groundY } from './world.js';
import { drawGlow } from './light.js';

const TAU = Math.PI * 2;
const K = 1.5; // 山屋縮放

const pos = (view, x) => ({ X: x - view.camX, Y: view.h * 0.7 + groundY(x) - view.camY });

export function drawHutStructure(ctx, view, x) {
  const { X, Y } = pos(view, x);
  ctx.save();
  ctx.translate(X, Y);
  ctx.scale(K, K);
  ctx.fillStyle = '#4a3a2c'; ctx.fillRect(-52, -70, 104, 70);
  ctx.strokeStyle = '#33261b'; ctx.lineWidth = 1.2;
  for (let y = -60; y < 0; y += 10) { ctx.beginPath(); ctx.moveTo(-52, y); ctx.lineTo(52, y); ctx.stroke(); }
  ctx.fillStyle = '#2d2a35';
  ctx.beginPath(); ctx.moveTo(-68, -66); ctx.lineTo(0, -120); ctx.lineTo(68, -66); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#4a4658'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#2a2630'; ctx.fillRect(30, -112, 12, 26); // 煙囪
  ctx.fillStyle = '#ffd88a'; ctx.fillRect(-38, -52, 26, 24); // 窗
  ctx.strokeStyle = '#2a1c10'; ctx.lineWidth = 3; ctx.strokeRect(-38, -52, 26, 24);
  ctx.beginPath(); ctx.moveTo(-25, -52); ctx.lineTo(-25, -28); ctx.moveTo(-38, -40); ctx.lineTo(-12, -40); ctx.stroke();
  ctx.fillStyle = '#ffcf7a'; // 敞開的門
  ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(10, -48); ctx.lineTo(36, -48); ctx.lineTo(36, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3a2a18';
  ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(10, -48); ctx.lineTo(18, -44); ctx.lineTo(18, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 3; // 燈籠柱與燈串座
  ctx.beginPath(); ctx.moveTo(72, 0); ctx.lineTo(72, -84); ctx.moveTo(-96, 0); ctx.lineTo(-96, -60); ctx.stroke();
  ctx.fillStyle = '#ffe6a8'; ctx.fillRect(67, -100, 10, 16);
  ctx.strokeStyle = '#2a1c10'; ctx.lineWidth = 2; ctx.strokeRect(67, -100, 10, 16);
  ctx.fillStyle = '#d8c8a0'; // 屋頂小星
  ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 - Math.PI / 2, r = i % 2 ? 2.4 : 7; ctx.lineTo(Math.cos(a) * r, -128 + Math.sin(a) * r); }
  ctx.fill();
  ctx.restore();
}

const BULBS = (() => {
  const o = [];
  const seg = (x0, y0, x1, y1, sag) => { for (let i = 1; i <= 6; i++) { const t = i / 7; o.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag]); } };
  seg(60, -67, 72, -84, 6); seg(-60, -67, -96, -60, 10); seg(-96, -60, -132, -6, 0);
  return o;
})();

// 疊加層：窗光、門前光、燈籠、燈串、屋頂星、光柱、炊煙。亮度比原型柔和（原型的窗光、燈串曾過亮）。
// reduced 時關閉閃爍與飄動的炊煙／光點。
export function drawHutLights(ctx, view, x, t, reduced) {
  const { X, Y } = pos(view, x);
  const P = (px, py) => [X + px * K, Y + py * K];
  const wob = (f, a) => (reduced ? 0 : a * Math.sin(t * f));
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const top = P(0, -128);
  { // 光柱
    const n = 60, segH = top[1] / n;
    for (let i = 0; i < n; i++) {
      const u = i / n, w = (22 + u * 40) * K * 0.5;
      const g = ctx.createLinearGradient(X - w, 0, X + w, 0);
      const a = (1 - u) * (1 - u) * 0.1;
      g.addColorStop(0, 'rgba(255,210,140,0)');
      g.addColorStop(0.5, 'rgba(255,215,150,' + a + ')');
      g.addColorStop(1, 'rgba(255,210,140,0)');
      ctx.fillStyle = g;
      ctx.fillRect(X - w, top[1] - (i + 1) * segH, w * 2, segH + 0.6);
    }
  }
  drawGlow(ctx, top[0], top[1], 36 * K, 0.34 + wob(0.005, 0.06), '255,215,150');
  drawGlow(ctx, top[0], top[1], 5 * K, 0.85, '255,245,210');
  if (!reduced) {
    for (let i = 0; i < 14; i++) { // 飄升的光點
      const u = (t * 0.00013 + i / 14) % 1;
      drawGlow(ctx, top[0] + Math.sin(i * 7 + u * 5) * 22 * K, top[1] - u * 260 * K, 5, 0.5 * (1 - u), '255,225,160');
    }
  }
  const w = P(-25, -40), d = P(23, -24);
  drawGlow(ctx, w[0], w[1], 70 * K, 0.24 + wob(0.004, 0.04), '255,190,100');
  drawGlow(ctx, w[0], w[1], 10 * K, 0.4, '255,235,180');
  ctx.save(); ctx.translate(X + 23 * K, Y + 6); ctx.scale(1, 0.16); drawGlow(ctx, 0, 0, 150 * K, 0.26, '255,190,100'); ctx.restore();
  ctx.save(); ctx.translate(X - 25 * K, Y + 4); ctx.scale(1, 0.15); drawGlow(ctx, 0, 0, 100 * K, 0.16, '255,190,100'); ctx.restore();
  drawGlow(ctx, d[0], d[1], 55 * K, 0.13, '255,200,120');
  const l = P(72, -92);
  drawGlow(ctx, l[0], l[1], 46 * K, 0.3 + wob(0.006, 0.06), '255,185,90');
  drawGlow(ctx, l[0], l[1], 6 * K, 0.8, '255,240,200');
  BULBS.forEach((b, i) => {
    const p = P(b[0], b[1]);
    drawGlow(ctx, p[0], p[1], 8 * K, 0.26 + (reduced ? 0.08 : 0.14 * Math.sin(t * 0.004 + i * 1.3)), '255,215,140');
    drawGlow(ctx, p[0], p[1], 1.8 * K, 0.8, '255,248,220');
  });
  if (!reduced) { // 炊煙
    const ch = P(36, -114);
    for (let i = 0; i < 6; i++) {
      const u = (t * 0.00018 + i / 6) % 1;
      ctx.fillStyle = 'rgba(255,205,160,' + (1 - u) * 0.09 + ')';
      ctx.beginPath(); ctx.arc(ch[0] + Math.sin(u * 6 + i) * 10 * K, ch[1] - u * 130 * K, (6 + u * 18) * K, 0, TAU); ctx.fill();
    }
  }
  ctx.restore();
}

export function drawClosedCabin(ctx, view, x) {
  const { X, Y } = pos(view, x);
  if (X < -120 || X > view.w + 120) return;
  ctx.save();
  ctx.translate(X, Y);
  ctx.scale(0.85, 0.85);
  ctx.fillStyle = '#3a4150'; ctx.fillRect(-45, -62, 90, 62);
  ctx.fillStyle = '#262a36';
  ctx.beginPath(); ctx.moveTo(-56, -60); ctx.lineTo(0, -104); ctx.lineTo(56, -60); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1b1e27'; ctx.fillRect(14, -46, 20, 46);
  ctx.fillStyle = '#1d222c'; ctx.fillRect(-32, -44, 22, 20);
  ctx.strokeStyle = '#2a2e3a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(56, 0); ctx.lineTo(56, -62); ctx.stroke();
  ctx.fillStyle = '#262a36'; ctx.fillRect(51, -76, 10, 14);
  ctx.restore();
}
