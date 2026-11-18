// 暗幕與車燈：全畫面蓋一層近乎全黑，只挖出車燈錐形與車身周圍；另有疊加的光暈。
const TAU = Math.PI * 2;
let dark = null, dctx = null;

function ensure(w, h, dpr) {
  if (!dark) { dark = document.createElement('canvas'); dctx = dark.getContext('2d'); }
  if (dark.width !== Math.round(w * dpr) || dark.height !== Math.round(h * dpr)) {
    dark.width = Math.round(w * dpr);
    dark.height = Math.round(h * dpr);
  }
  dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function hole(x, y, r, a) {
  const g = dctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(0,0,0,' + a + ')');
  g.addColorStop(0.55, 'rgba(0,0,0,' + a * 0.5 + ')');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  dctx.fillStyle = g;
  dctx.beginPath(); dctx.arc(x, y, r, 0, TAU); dctx.fill();
}

function cone(x, y, ang, len, half, a) {
  dctx.save();
  dctx.beginPath(); dctx.moveTo(x, y); dctx.arc(x, y, len, ang - half, ang + half); dctx.closePath(); dctx.clip();
  const g = dctx.createRadialGradient(x, y, 0, x, y, len);
  g.addColorStop(0, 'rgba(0,0,0,' + a + ')');
  g.addColorStop(0.6, 'rgba(0,0,0,' + a * 0.6 + ')');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  dctx.fillStyle = g;
  dctx.fillRect(x - len, y - len, len * 2, len * 2);
  dctx.restore();
}

// view: {w,h,dpr}；params: {len,half,flicker?}；extraHoles: [{x,y,r,a}]（車身、山屋等）
export function drawDarkness(ctx, view, lamp, aim, params, extraHoles) {
  const dpr = Math.min(view.dpr || 1, 2);
  ensure(view.w, view.h, dpr);
  const fl = params.flicker || 1;
  dctx.globalCompositeOperation = 'source-over';
  dctx.clearRect(0, 0, view.w, view.h);
  dctx.fillStyle = 'rgba(0,0,0,.955)';
  dctx.fillRect(0, 0, view.w, view.h);
  dctx.globalCompositeOperation = 'destination-out';
  cone(lamp.x, lamp.y, aim, params.len * fl, params.half, 0.95);
  cone(lamp.x, lamp.y, aim, params.len * 0.8 * fl, params.half + 0.2, 0.4);
  (extraHoles || []).forEach((h) => hole(h.x, h.y, h.r * fl, h.a));
  ctx.drawImage(dark, 0, 0, view.w, view.h);
}

export function drawGlow(ctx, x, y, r, a, col) {
  if (a <= 0.003) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(' + col + ',' + a + ')');
  g.addColorStop(1, 'rgba(' + col + ',0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}

// 疊加層（用 lighter 混合）：車頭燈的光暈與車身周圍微光
export function drawLampGlow(ctx, lamp, aim, bodyX, bodyY, S) {
  ctx.globalCompositeOperation = 'lighter';
  drawGlow(ctx, lamp.x, lamp.y, 50, 0.75, '255,238,200');
  drawGlow(ctx, bodyX, bodyY - 50, 200 * S, 0.05, '255,215,150');
  ctx.globalCompositeOperation = 'source-over';
}
