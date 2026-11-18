// 相機跟隨玩家（純邏輯）。回傳新的相機 x。
export function followCamera(camX, playerX, face, speedRatio, viewW, dt, worldLength) {
  const target = playerX - viewW * (0.4 - face * 0.09 * speedRatio);
  const next = camX + (target - camX) * Math.min(1, dt * 5);
  return Math.min(worldLength + 200 - viewW, Math.max(-200, next));
}
