// 鍵盤與觸控輸入狀態。
const KEYS = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };

export function createInput(target) {
  const state = { left: false, right: false };
  const keyDown = { left: false, right: false };   // 鍵盤來源
  const padDown = { left: false, right: false };   // 觸控按鈕來源
  const sync = () => {
    state.left = keyDown.left || padDown.left;
    state.right = keyDown.right || padDown.right;
  };
  const onKey = (down) => (e) => {
    const dir = KEYS[e.key];
    if (!dir) return;
    e.preventDefault(); // 避免方向鍵捲動頁面
    keyDown[dir] = down;
    sync();
  };
  const onDown = onKey(true);
  const onUp = onKey(false);
  const onBlur = () => {
    // 失去焦點時收不到 keyup，全部清空，避免回來後車子自己一直騎
    keyDown.left = keyDown.right = padDown.left = padDown.right = false;
    sync();
  };
  target.addEventListener('keydown', onDown);
  target.addEventListener('keyup', onUp);
  target.addEventListener('blur', onBlur);
  return {
    state,
    press(dir, down) { padDown[dir] = !!down; sync(); },
    dispose() {
      target.removeEventListener('keydown', onDown);
      target.removeEventListener('keyup', onUp);
      target.removeEventListener('blur', onBlur);
    },
  };
}
