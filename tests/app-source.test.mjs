// 來源 App 判斷（appSource）：作答（submit）與他評（peer-submit）兩支收件程式各有一份，要一字不差
// 執行：node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { appSource } from '../backend/functions/peer-submit/index.ts';

const fnText = (path) => {
  const src = fs.readFileSync(new URL(path, import.meta.url), 'utf8');
  const m = src.match(/export function appSource[\s\S]*?\n}\n/);
  assert.ok(m, `${path} 找不到 appSource`);
  return m[0];
};

test('兩支收件程式的 appSource 一字不差', () => {
  assert.equal(
    fnText('../backend/functions/submit/index.ts'),
    fnText('../backend/functions/peer-submit/index.ts'),
  );
});

// 範例取自正式環境的連線紀錄（去掉版本細節不影響判斷）
const cases = [
  ['threads', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22G86 Barcelona 404.0.0.30.79 (iPhone15,3; iOS 18_6; zh_TW; zh-Hant; scale=3.00; 1290x2796; IABMV/1; 789545765) Safari/604.1'],
  ['threads', 'Mozilla/5.0 (Linux; Android 15; SM-S9210 Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.7390.122 Mobile Safari/537.36 Barcelona 405.0.0.42.70 Android (35/15; 450dpi; 1080x2340; samsung; SM-S9210; e1q; qcom; zh_TW; 812312545)'],
  ['instagram', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 400.0.0.0.0 (iPhone14,5; iOS 18_5; zh_TW; zh-Hant; scale=3.00; 1170x2532; 0)'],
  ['facebook', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/500.0.0.0;FBBV/1;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/18.5;FBSS/3;FBLC/zh_TW]'],
  ['line', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/26.17.0'],
  ['line', 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.0.0 Mobile Safari/537.36 Line/26.17.0/IAB'],
  ['other_app', 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.0.0 Mobile Safari/537.36'],
  ['other_app', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'],
  ['browser', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.0.0 Mobile/15E148 Safari/604.1'],
  ['browser', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1'],
  ['browser', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'],
  ['browser', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15'],
  ['unknown', ''],
  ['unknown', null],
  ['unknown', undefined],
  ['unknown', 'curl/8.7.1'],
];

for (const [want, ua] of cases) {
  test(`來源 ${want}：${String(ua).slice(0, 60)}`, () => assert.equal(appSource(ua), want));
}

test('回傳值都在資料庫允許的分類裡', () => {
  // 上線前放在 backend/未上線/，上線後搬到 backend/
  const path = ['../backend/升級_v21_來源App.sql', '../backend/未上線/升級_v21_來源App.sql']
    .map((p) => new URL(p, import.meta.url)).find((u) => fs.existsSync(u));
  assert.ok(path, '找不到 升級_v21_來源App.sql');
  const sql = fs.readFileSync(path, 'utf8');
  const allowed = [...sql.match(/source in \(([^)]*)\)/)[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
  for (const [want] of cases) assert.ok(allowed.includes(want), want);
});
