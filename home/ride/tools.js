// 首頁工具資料與位置（純邏輯，不碰 DOM）。
// 新增工具只要在 TOOLS 加一筆；順序即世界裡由左到右的順序。

export const SPACING = 2400;
export const FIRST_X = 2000;
export const END_PAD = 1600;

export const TOOLS = [
  { id: 'soon-1', name: '即將開放', href: null, status: 'closed' },
  { id: 'disc', name: '找尋你的動物本色', href: '/animal-colors-disc/', status: 'open' },
  { id: 'soon-2', name: '即將開放', href: null, status: 'closed' },
  { id: 'soon-3', name: '即將開放', href: null, status: 'closed' },
];

// 回傳 { placed, worldLength }。不修改傳入的資料。
// 沒有網址的「開放」工具是錯誤資料，降為 closed，避免畫面出現點了沒反應的山屋連結。
export function placeTools(tools) {
  const placed = tools.map((t, i) => ({
    ...t,
    status: t.status === 'open' && t.href ? 'open' : 'closed',
    x: FIRST_X + i * SPACING,
  }));
  const lastX = placed.length ? placed[placed.length - 1].x : FIRST_X;
  return { placed, worldLength: lastX + END_PAD };
}
