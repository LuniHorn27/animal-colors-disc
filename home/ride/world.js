// 地形與固定亂數場景物件（純邏輯）。

export function groundY(x) {
  return -x * 0.03 + 18 * Math.sin(x * 0.0035) + 10 * Math.sin(x * 0.011);
}

// 固定種子的亂數：每次載入的場景都一樣
function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// 數量依世界長度等比例調整（原型世界長度約 11000）
export function buildScenery(worldLength, waypointXs) {
  const r = rng(17);
  const k = worldLength / 11000;
  const midTrees = [], backTrees = [], rocks = [], tufts = [], stars = [], flies = [];
  for (let i = 0; i < Math.round(800 * k); i++) midTrees.push({ x: r() * (worldLength * 0.45 + 1600) - 200, h: 60 + r() * 90 });
  for (let i = 0; i < Math.round(480 * k); i++) {
    const x = r() * (worldLength + 300), h = 70 + r() * 120, s = r();
    if (waypointXs.some((p) => Math.abs(p - x) < 150)) continue; // 路標、山屋前不長樹
    backTrees.push({ x, h, s });
  }
  for (let i = 0; i < Math.round(230 * k); i++) rocks.push({ x: r() * worldLength, w: 5 + r() * 13, o: r() * 10 });
  for (let i = 0; i < Math.round(520 * k); i++) tufts.push({ x: r() * worldLength, h: 6 + r() * 12, a: (r() - 0.5) * 0.6 });
  for (let i = 0; i < 34; i++) stars.push({ x: r(), y: r() * 0.2, s: 0.5 + r() * 1.1, p: r() * 50 });
  for (let i = 0; i < Math.round(110 * k); i++) flies.push({ x: r() * worldLength, dy: 30 + r() * 200, p: r() * 50, s: 0.5 + r() });
  midTrees.sort((a, b) => a.x - b.x);
  backTrees.sort((a, b) => a.x - b.x);
  return { midTrees, backTrees, rocks, tufts, stars, flies };
}
