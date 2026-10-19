// js/peer-bank.js（他評題庫、計分、判定、換算）的測試，並和收件窗口比對
// 執行：node --test tests/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as S from '../backend/functions/peer-submit/index.ts';
const B = createRequire(import.meta.url)('../js/peer-bank.js');

const N12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

test('48 個詞、編號格式正確', () => {
  const ids = Object.keys(B.WORDS);
  assert.equal(ids.length, 48);
  ids.forEach((id) => assert.match(id, /^[DISC][1-4][abc]$/));
});
test('48 個詞的文字不重複、2–6 字', () => {
  const words = Object.values(B.WORDS);
  assert.equal(new Set(words).size, 48);
  words.forEach((w) => { const n = w.replace(/[「」]/g, '').length; assert.ok(n >= 2 && n <= 6, w); });
});
test('12 題用完 48 個詞且不重複', () => assert.equal(new Set(N12.flatMap(B.itemWords)).size, 48));
test('和收件窗口的題目組成一致', () => N12.forEach((n) => assert.deepEqual(B.itemWords(n), S.itemWords(n))));
test('和收件窗口的計分、判定一致（隨機 500 份）', () => {
  let seed = 12345;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const { gate, high } = B.GATES[12];
  for (let k = 0; k < 500; k++) {
    const picks = {};
    N12.forEach((n) => {
      const w = B.itemWords(n);
      const m = Math.floor(rnd() * 4);
      let l = Math.floor(rnd() * 3); if (l >= m) l++;
      picks[B.itemKey(n)] = { most: w[m], least: w[l] };
    });
    const x = B.scorePicks(picks);
    assert.deepEqual(x, S.scorePicks(picks));
    assert.equal(B.classify(x).key, S.classify(x, gate, high).key);
  }
});
test('itemKey', () => { assert.equal(B.itemKey(1), 'P01'); assert.equal(B.itemKey(12), 'P12'); });
test('makeSeq：12 題各一次、每題 4 個詞集合不變', () => {
  const s = B.makeSeq();
  assert.deepEqual(s.map((x) => x.i).sort((a, b) => a - b), N12);
  s.forEach((x) => assert.deepEqual([...x.w].sort(), [...B.itemWords(x.i)].sort()));
});
test('makeSeq：用固定的亂數會打亂順序', () => {
  const s = B.makeSeq(() => 0);
  assert.notDeepEqual(s.map((x) => x.i), N12);
});
test('normSelf：一型 5 分其他 1 分 → 該型 1', () => assert.equal(B.normSelf({ D: 5, I: 1, S: 1, C: 1 }).D, 1));
test('normSelf：四型相同 → 全部 0', () => assert.deepEqual(B.normSelf({ D: 3, I: 3, S: 3, C: 3 }), { D: 0, I: 0, S: 0, C: 0 }));
test('normPeer：12 → 1、-6 → -0.5', () => assert.deepEqual(B.normPeer({ D: 12, I: -6, S: 0, C: -6 }), { D: 1, I: -0.5, S: 0, C: -0.5 }));
test('average', () => assert.deepEqual(B.average([{ D: 2, I: 0, S: -2, C: 0 }, { D: 4, I: 0, S: -4, C: 0 }]), { D: 3, I: 0, S: -3, C: 0 }));
test('gapLines：孔雀他評高 0.3、老虎自評高 0.2、其他差 0.05 → 兩行，孔雀在前', () =>
  assert.deepEqual(B.gapLines({ D: .4, I: .2, S: 0, C: -.6 }, { D: .2, I: .5, S: .05, C: -.65 }), [{ t: 'I', dir: 'peer' }, { t: 'D', dir: 'self' }]));
test('gapLines：差距都小於 0.15 → 空陣列', () =>
  assert.deepEqual(B.gapLines({ D: .1, I: 0, S: 0, C: -.1 }, { D: .05, I: .05, S: 0, C: -.1 }), []));
test('classify：全 0 → 變色龍', () => assert.equal(B.classify({ D: 0, I: 0, S: 0, C: 0 }).key, 'CH'));
test('classify：平均後的小數分數也能判定', () => assert.equal(B.classify({ D: 7.5, I: 1, S: -3.5, C: -5 }).key, 'D'));
test('FEATURE 四型都有', () => assert.deepEqual(Object.keys(B.FEATURE).sort(), ['C', 'D', 'I', 'S']));
