// 訪客主動開啟背景音樂；播放時可靜音並在同一位置恢復。
export function initMusicControls() {
  const audio = document.getElementById('backgroundMusic');
  const button = document.getElementById('musicToggle');
  if (!audio || !button) return;

  const updateButton = (playing) => {
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? '靜音背景音樂' : (audio.paused ? '播放背景音樂' : '開啟背景音樂'));
    button.textContent = playing ? '♫ 靜音音樂' : (audio.paused ? '♫ 播放音樂' : '♫ 開啟音樂');
  };

  button.addEventListener('click', async () => {
    if (audio.paused) {
      audio.muted = false;
      try {
        await audio.play();
        updateButton(true);
      } catch {
        audio.muted = true;
        updateButton(false);
      }
      return;
    }

    audio.muted = !audio.muted;
    updateButton(!audio.muted);
  });

  audio.addEventListener('ended', () => updateButton(false));
  updateButton(false);
}
