// 騎士與腳踏車的繪製（黑色剪影）。回傳車頭燈的畫面座標。
const TAU = Math.PI * 2;

// 兩段肢體的膝／肘位置（雙關節求解）
function limb(ax, ay, bx, by, l1, l2, pxv, pyv) {
  const dx = bx - ax, dy = by - ay, D = Math.hypot(dx, dy) || 1, d = Math.min(D, l1 + l2 - 0.01);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const mx = ax + (dx / D) * a, my = ay + (dy / D) * a;
  let nx = -dy / D, ny = dx / D;
  if (nx * pxv + ny * pyv < 0) { nx = -nx; ny = -ny; }
  return [mx + nx * h, my + ny * h];
}

export function drawRider(ctx, p) {
  const { x: X, y: Y, face, speedRatio: sp, wheelAngle: wheelA, pedalPhase: phase, slope: sl, scale: S, bob = true } = p;
  ctx.save();
  ctx.translate(X, Y);
  ctx.rotate(sl * 0.7 * face);
  ctx.scale(face * S, S);
  const bobY = bob ? Math.abs(Math.sin(wheelA * 1.5)) * 1.6 * sp : 0;
  ctx.translate(0, -bobY);
  ctx.strokeStyle = '#06080b';
  ctx.fillStyle = '#06080b';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  [-31, 31].forEach((cx) => {
    ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.arc(cx, -21, 21, 0, TAU); ctx.stroke();
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const a = wheelA + (i * TAU) / 6;
      ctx.beginPath(); ctx.moveTo(cx, -21); ctx.lineTo(cx + Math.cos(a) * 20, -21 + Math.sin(a) * 20); ctx.stroke();
    }
  });
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-31, -21); ctx.lineTo(0, -24); ctx.lineTo(-13, -56); ctx.lineTo(-31, -21);
  ctx.moveTo(0, -24); ctx.lineTo(24, -54); ctx.lineTo(-13, -56);
  ctx.moveTo(24, -54); ctx.lineTo(31, -21);
  ctx.moveTo(24, -54); ctx.lineTo(21, -65); ctx.lineTo(31, -67);
  ctx.moveTo(-19, -58); ctx.lineTo(-7, -58);
  ctx.stroke();
  const hip = [-13, -62], a1 = phase;
  const p1 = [Math.cos(a1) * 11, -24 + Math.sin(a1) * 11], p2 = [-Math.cos(a1) * 11, -24 - Math.sin(a1) * 11];
  ctx.lineWidth = 7;
  [[p2, 0.55], [p1, 1]].forEach(([pt, al]) => {
    ctx.globalAlpha = al;
    const kn = limb(hip[0], hip[1], pt[0], pt[1], 27, 27, 1, 0);
    ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(kn[0], kn[1]); ctx.lineTo(pt[0], pt[1]); ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.lineWidth = 11;
  ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(8, -90); ctx.stroke();
  ctx.lineWidth = 6;
  const el = limb(8, -88, 29, -67, 22, 22, 0, 1);
  ctx.beginPath(); ctx.moveTo(8, -88); ctx.lineTo(el[0], el[1]); ctx.lineTo(29, -67); ctx.stroke();
  ctx.beginPath(); ctx.arc(15, -102, 8.5, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-14, -96, 14, 26, 5); ctx.fill();
  ctx.fillStyle = '#fff3d2';
  ctx.fillRect(31, -70, 5, 6); // 車頭燈
  ctx.restore();
  return { lamp: { x: X + face * 34 * S, y: Y - 68 * S } };
}
