// js/peer-backend.js 的純函式測試（連線部分在瀏覽器驗證）
// 執行：node --test tests/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const P = createRequire(import.meta.url)('../js/peer-backend.js');

const CODE = 'ABCDEFGHJK', TOKEN = 'a'.repeat(64);

test('retryDelays：最短 3、8、20 秒', () => assert.deepEqual(P.retryDelays(() => 0), [3000, 8000, 20000]));
test('retryDelays：最長多 50%', () => assert.deepEqual(P.retryDelays(() => 1), [4500, 12000, 30000]));
test('parseHash 評的人', () => assert.deepEqual(P.parseHash('#r=' + CODE), { mode: 'rate', code: CODE }));
test('parseHash 邀請人', () => assert.deepEqual(P.parseHash(`#k=${CODE}.${TOKEN}`), { mode: 'owner', code: CODE, token: TOKEN }));
test('parseHash 邀請人只有邀請碼（已登入時用）', () => assert.deepEqual(P.parseHash('#k=' + CODE), { mode: 'owner', code: CODE, token: null }));
test('parseHash 邀請碼格式錯誤 → 邀請頁', () => assert.deepEqual(P.parseHash('#r=abc'), { mode: 'invite' }));
test('parseHash 專屬碼格式錯誤 → 邀請頁', () => assert.deepEqual(P.parseHash(`#k=${CODE}.xyz`), { mode: 'invite' }));
test('parseHash 空字串 → 邀請頁', () => assert.deepEqual(P.parseHash(''), { mode: 'invite' }));
test('errorFor：410 → closed', () => assert.equal(P.errorFor(410), 'closed'));
test('errorFor：404 → not_found', () => assert.equal(P.errorFor(404), 'not_found'));
test('errorFor：400 → invalid（不重試）', () => assert.equal(P.errorFor(400), 'invalid'));
test('errorFor：403（機器人驗證失敗，可能是 Cloudflare 暫時異常）→ network（換新驗證碼重試）', () => assert.equal(P.errorFor(403), 'network'));
test('errorFor：503、0（網路中斷）→ network（要重試）', () => { assert.equal(P.errorFor(503), 'network'); assert.equal(P.errorFor(0), 'network'); });
test('newSid 符合伺服器格式且每次不同', () => {
  const a = P.newSid(), b = P.newSid();
  assert.match(a, /^[A-Za-z0-9-]{8,64}$/);
  assert.notEqual(a, b);
});

// 從主測驗結果頁或「我的歷次結果」進來：#from=作答 id
const RID = '0f8fad5b-d9cb-469f-a165-70867728950e';
test('parseHash 從某一次結果進來', () => assert.deepEqual(P.parseHash('#from=' + RID), { mode: 'invite', from: RID }));
test('parseHash from 格式錯誤 → 一般邀請頁', () => assert.deepEqual(P.parseHash('#from=abc'), { mode: 'invite' }));
test('claimFor：從每份作答的憑證裡找到對應的那一張', () =>
  assert.deepEqual(P.claimFor(RID, { s1: { id: 'x', token: 't1' }, s2: { id: RID, token: 't2' } }, null), { id: RID, token: 't2' }));
test('claimFor：沒指定作答時用最近一次', () =>
  assert.deepEqual(P.claimFor(null, {}, { id: 'x', token: 't1' }), { id: 'x', token: 't1' }));
test('claimFor：指定的作答在這個瀏覽器沒有憑證 → 只有 id（要靠登入）', () =>
  assert.deepEqual(P.claimFor(RID, { s1: { id: 'x', token: 't1' } }, { id: 'x', token: 't1' }), { id: RID, token: null }));
