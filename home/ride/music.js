// 預設嘗試循環播放；瀏覽器限制自動播放時，圖示按鈕可啟用或靜音。
export function initMusicControls() {
  const audio = document.getElementById('backgroundMusic');
  const button = document.getElementById('musicToggle');
  if (!audio || !button) return;

  audio.volume = 0.4;

  const updateButton = () => {
    const playing = !audio.paused && !audio.muted;
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? '靜音背景音樂' : '取消靜音背景音樂');
  };

  let awaitingFirstGesture = false;
  const removeGestureListeners = () => {
    document.removeEventListener('pointerdown', resumeOnGesture, true);
    document.removeEventListener('keydown', resumeOnGesture, true);
  };
  const resumeOnGesture = async (event) => {
    if (!awaitingFirstGesture || button.contains(event.target)) return;
    awaitingFirstGesture = false;
    audio.muted = false;
    try {
      await audio.play();
    } catch {
      audio.muted = true;
      awaitingFirstGesture = true;
      updateButton();
      return;
    }
    updateButton();
    removeGestureListeners();
  };
  document.addEventListener('pointerdown', resumeOnGesture, true);
  document.addEventListener('keydown', resumeOnGesture, true);

  const start = async () => {
    try {
      await audio.play();
    } catch {
      // 若有聲自動播放被擋，先靜音循環；首次操作頁面時再接續播放。
      audio.muted = true;
      awaitingFirstGesture = true;
      try { await audio.play(); } catch { /* 使用者仍可按圖示重試。 */ }
    }
    updateButton();
  };

  button.addEventListener('click', async () => {
    if (audio.muted || audio.paused) {
      awaitingFirstGesture = false;
      removeGestureListeners();
      audio.muted = false;
      try {
        await audio.play();
      } catch {
        audio.muted = true;
        awaitingFirstGesture = true;
      }
    } else {
      awaitingFirstGesture = false;
      removeGestureListeners();
      audio.muted = true;
    }
    updateButton();
  });

  audio.addEventListener('play', updateButton);
  audio.addEventListener('pause', updateButton);
  audio.addEventListener('volumechange', updateButton);
  updateButton();
  start();
}
