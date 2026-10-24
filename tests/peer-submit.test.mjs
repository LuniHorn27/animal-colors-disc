// 他評收件窗口（backend/functions/peer-submit/index.ts）的純函式測試
// 執行：node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../backend/functions/peer-submit/index.ts';

const key = (n) => `P${String(n).padStart(2, '0')}`;
const good = () => ({
  code: 'ABCDEFGHJK', sid: 'sid-12345678', relation: '朋友', name: '',
  seq: Array.from({ length: 12 }, (_, k) => ({ i: k + 1, w: S.itemWords(k + 1) })),
  picks: Object.fromEntries(Array.from({ length: 12 }, (_, k) => {
    const w = S.itemWords(k + 1);
    return [key(k + 1), { most: w[0], least: w[2] }];
  })),
  times: Object.fromEntries(Array.from({ length: 12 }, (_, k) => [key(k + 1), 4000])),
  turnstile_token: 'x',
});

test('第 1 題組成', () => assert.deepEqual(S.itemWords(1), ['D1a', 'I2a', 'S3a', 'C4a']));
test('第 12 題組成', () => assert.deepEqual(S.itemWords(12), ['D4c', 'I1c', 'S2c', 'C3c']));
test('全部最像 D、最不像 S → D=12, S=-12', () => assert.deepEqual(S.scorePicks(good().picks), { D: 12, I: 0, S: -12, C: 0 }));
test('正確資料通過', () => assert.equal(S.validate(good()).ok, true));
test('最像等於最不像 → 拒絕', () => { const b = good(); b.picks.P01.least = b.picks.P01.most; assert.equal(S.validate(b).ok, false); });
test('選了不屬於該題的詞 → 拒絕', () => { const b = good(); b.picks.P01.most = 'D2b'; assert.equal(S.validate(b).ok, false); });
test('只有 11 題 → 拒絕', () => { const b = good(); delete b.picks.P12; assert.equal(S.validate(b).ok, false); });
test('seq 的詞和題目組成不符 → 拒絕', () => { const b = good(); b.seq[0].w = ['D1b', 'I2a', 'S3a', 'C4a']; assert.equal(S.validate(b).ok, false); });
test('seq 題號重複 → 拒絕', () => { const b = good(); b.seq[1] = { ...b.seq[0] }; assert.equal(S.validate(b).ok, false); });
test('關係不在六個選項 → 拒絕', () => { const b = good(); b.relation = '鄰居'; assert.equal(S.validate(b).ok, false); });
test('關係「其他」＋自填文字 → 通過，文字去掉前後空白', () => { const b = good(); b.relation = '其他'; b.relationNote = ' 社團學長 '; const v = S.validate(b); assert.equal(v.ok, true); assert.equal(v.data.relationNote, '社團學長'); });
test('關係「其他」沒填文字 → 拒絕', () => { const b = good(); b.relation = '其他'; b.relationNote = '  '; assert.equal(S.validate(b).ok, false); });
test('關係「其他」文字 20 字 → 通過（v14 放寬）', () => { const b = good(); b.relation = '其他'; b.relationNote = 'a'.repeat(20); assert.equal(S.validate(b).ok, true); });
test('關係「其他」文字超過 20 字 → 拒絕', () => { const b = good(); b.relation = '其他'; b.relationNote = 'a'.repeat(21); assert.equal(S.validate(b).ok, false); });
test('lang：zh-TW／en／mixed 通過並帶出，沒帶是 null', () => { for (const l of ['zh-TW', 'en', 'mixed']) { const b = good(); b.lang = l; assert.equal(S.validate(b).data.lang, l); } assert.equal(S.validate(good()).data.lang, null); });
test('lang：不認得的值 → 拒絕', () => { const b = good(); b.lang = 'fr'; assert.equal(S.validate(b).ok, false); });
test('關係「朋友」卻帶自填文字 → 拒絕', () => { const b = good(); b.relationNote = '同事'; assert.equal(S.validate(b).ok, false); });
test('關係「朋友」→ relationNote 是 null', () => assert.equal(S.validate(good()).data.relationNote, null));
test('名字 21 字 → 拒絕', () => { const b = good(); b.name = '一'.repeat(21); assert.equal(S.validate(b).ok, false); });
test('名字前後空白會去掉，空字串視為匿名', () => { const b = good(); b.name = '  '; assert.equal(S.validate(b).data.name, null); });
test('名字去掉前後空白後保留', () => { const b = good(); b.name = ' 小明 '; assert.equal(S.validate(b).data.name, '小明'); });
test('作答時間負數 → 拒絕', () => { const b = good(); b.times.P01 = -1; assert.equal(S.validate(b).ok, false); });
test('作答時間超過 10 分鐘 → 拒絕', () => { const b = good(); b.times.P01 = 600001; assert.equal(S.validate(b).ok, false); });
test('邀請碼格式錯誤 → 拒絕', () => { const b = good(); b.code = 'abc'; assert.equal(S.validate(b).ok, false); });
test('號碼牌格式錯誤 → 拒絕', () => { const b = good(); b.sid = 'x'; assert.equal(S.validate(b).ok, false); });
test('四型全為 0 → 變色龍', () => assert.equal(S.classify({ D: 0, I: 0, S: 0, C: 0 }, 2, 4).key, 'CH'));
test('差距達門檻 → 單型', () => assert.equal(S.classify({ D: 8, I: 2, S: -4, C: -6 }, 5.5, 11).key, 'D'));
test('前兩名相鄰且差距小 → 組合', () => assert.equal(S.classify({ D: 6, I: 4, S: -4, C: -6 }, 5.5, 11).key, 'DI'));
test('前兩名對角且都高出第三名 → 對角', () => assert.equal(S.classify({ D: 6, S: 5, I: -5, C: -6 }, 5.5, 11).key, 'DS'));
test('分數都很接近 → 變色龍', () => assert.equal(S.classify({ D: 2, I: 1, S: -1, C: -2 }, 5.5, 11).key, 'CH'));
