// 疊在畫面上的 DOM：山屋連結、「？」標籤、邊緣方向提示。
// 一切依傳入的工具資料產生，不寫死工具數量或位置。
const ENTER_RANGE = 170;

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

// opts: { onFocusTool(x), navigate(href) }
export function createUi(root, placed, opts = {}) {
  const navigate = opts.navigate || ((href) => window.location.assign(href));
  const nodes = placed.map((tool) => {
    if (tool.status === 'open') {
      const a = el('a', 'node hut');
      a.href = tool.href;
      const label = el('span', 'label', tool.name);
      const sub = el('small', 'sub', '往前騎，靠近山屋');
      label.appendChild(sub);
      a.appendChild(label);
      a.addEventListener('focus', () => opts.onFocusTool && opts.onFocusTool(tool.x));
      root.appendChild(a);
      return { tool, node: a, sub, dy: 215, r1: 450, r2: 800 };
    }
    const d = el('div', 'node soon');
    d.appendChild(el('span', 'label', '？'));
    root.appendChild(d);
    return { tool, node: d, dy: 125, r1: 200, r2: 420 };
  });
  const edgeL = el('div', 'edge edge-l', '‹ 山屋');
  const edgeR = el('div', 'edge edge-r', '山屋 ›');
  root.append(edgeL, edgeR);

  let playerX = 0;
  const onKey = (e) => {
    if ((e.key !== 'Enter' && e.key !== ' ') || document.activeElement !== document.body) return;
    const near = nodes.find((n) => n.tool.status === 'open' && Math.abs(playerX - n.tool.x) < ENTER_RANGE);
    if (!near) return;
    e.preventDefault();
    navigate(near.tool.href);
  };
  window.addEventListener('keydown', onKey);

  const openNodes = nodes.filter((n) => n.tool.status === 'open');
  return {
    // frame: {playerX, camX, viewW, viewH, camY, groundY}
    update(frame) {
      playerX = frame.playerX;
      nodes.forEach((n) => {
        const x = n.tool.x - frame.camX, d = Math.abs(frame.playerX - n.tool.x);
        n.node.style.left = x + 'px';
        n.node.style.top = frame.viewH * 0.7 + frame.groundY(n.tool.x) - frame.camY - n.dy + 'px';
        n.node.style.setProperty('--o', Math.max(0, Math.min(1, (n.r2 - d) / (n.r2 - n.r1))).toFixed(2));
        if (n.sub) n.sub.textContent = d < ENTER_RANGE ? '按 Enter，走進去' : '往前騎，靠近山屋';
      });
      // 邊緣提示：指向離玩家最近的開放山屋
      let nearest = null;
      openNodes.forEach((n) => { if (!nearest || Math.abs(frame.playerX - n.tool.x) < Math.abs(frame.playerX - nearest.tool.x)) nearest = n; });
      const sx = nearest ? nearest.tool.x - frame.camX : 0;
      edgeR.classList.toggle('on', !!nearest && sx > frame.viewW + 30);
      edgeL.classList.toggle('on', !!nearest && sx < -30);
    },
    dispose() { window.removeEventListener('keydown', onKey); },
  };
}
