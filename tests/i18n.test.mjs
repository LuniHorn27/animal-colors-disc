// 字典與語言共用函式的單元測試：node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './load.mjs';

test('t() 換變數、英文缺少的鍵改用中文、沒有的鍵回傳鍵名', () => {
  const x = load();
  x.ZH.ui['test.x'] = '共 {n} 題';
  assert.equal(x.t('test.x', { n: 3 }), '共 3 題');
  x.useDict({ ui: {}, animal: x.ZH.animal });
  assert.equal(x.t('home.start'), '開始作答');
  assert.equal(x.t('no.such.key'), 'no.such.key');
});
test('單複數：n 是 1 時用 .one 的版本', () => {
  const x = load(); x.useDict(x.EN);
  assert.equal(x.t('hist.count', { n: 1 }), '1 result. Tap it to open it.');
  assert.equal(x.t('hist.count', { n: 3 }), '3 results. Tap one to open it.');
});
test('動物名稱：中文「D 老虎」、英文「D-Tiger」', () => {
  const x = load();
  assert.equal(x.LBL('D'), 'D 老虎');
  x.useDict(x.EN);
  assert.equal(x.LBL('D'), 'D-Tiger');
  assert.equal(x.t('res.cham'), 'Chameleon (Balanced)');
  assert.equal(x.t('sub.combo', { ab: 'DI' }), 'DI Blend');
  assert.equal(x.t('sub.diag', { ab: 'DS' }), 'DS Opposite Pair');
});
test('markAnimals：中文和改動前相同；英文認得單數的動物名，不會多留「D-」', () => {
  const x = load();
  assert.equal(x.markAnimals('和 D 老虎相處'), '和 \u0001D\u0002 相處');
  assert.equal(x.markAnimals('和老虎、孔雀'), '和 \u0001D\u0002、\u0001I\u0002');
  x.useDict(x.EN);
  assert.equal(x.markAnimals('Work with D-Tiger and an Owl.'), 'Work with \u0001D\u0002 and an \u0001C\u0002.');
  assert.equal(x.markAnimals('Tigers and Bowl'), 'Tigers and Bowl');
});
test('pickLang：網址優先、不分大小寫、其他值不理會', () => {
  const { pickLang } = load();
  assert.equal(pickLang('?lang=EN', null), 'en');
  assert.equal(pickLang('?lang=en-US', 'zh'), 'zh');
  assert.equal(pickLang('?lang=fr', 'en'), 'en');
  assert.equal(pickLang('?lang=zh', 'en'), 'zh');
  assert.equal(pickLang('', null), 'zh');
});
test('addLang：上線前開始作答的人，之前的部分當作中文', () => {
  const { addLang } = load();
  const a = { answers: { D01: 3 } }; addLang(a, 'en'); assert.deepEqual(a.langs, ['zh', 'en']);
  const b = { answers: {} }; addLang(b, 'en'); assert.deepEqual(b.langs, ['en']);
  const c = { answers: {}, langs: ['en'] }; addLang(c, 'en'); assert.deepEqual(c.langs, ['en']);
});
test('題目文字：英文字典有就用英文', () => {
  const x = load();
  assert.equal(x.qText('R01'), x.BYID.R01.text);
  x.useDict(x.EN);
  assert.equal(x.qText('D15'), 'When I speak, I usually get straight to the point.');
  assert.equal(x.scaleT()[3], 'Somewhat true of me');
});
