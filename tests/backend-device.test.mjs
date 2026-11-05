// js/backend.js 的裝置編號：看放進待送出區的內容，不會真的連線
// 執行：node --test tests/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const code = fs.readFileSync(new URL('../js/backend.js', import.meta.url), 'utf8');
const SEQ = ['D01'];

function load() {
  const data = new Map();
  const localStorage = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  };
  const window = { DISC_CONFIG: { supabaseUrl: 'https://x.test', supabaseAnonKey: 'k', turnstileSiteKey: 's' }, addEventListener() {} };
  // 不會完成的載入：作答停在待送出區，不會往外送
  const element = { addEventListener() {}, setAttribute() {}, style: {} };
  const document = { createElement: () => element, head: { appendChild() {} }, body: { appendChild() {} }, querySelector: () => null, getElementById: () => null, addEventListener() {} };
  new Function('window', 'localStorage', 'document', 'navigator', 'location', code)(window, localStorage, document, { onLine: false }, { origin: 'https://x.test', href: 'https://x.test/' });
  const send = (sid, cohort) => {
    Promise.resolve(window.DiscBackend.queue({ sid, seq: SEQ, answers: {}, times: {}, info: {}, cohort })).catch(() => {});
    const box = JSON.parse(data.get('disc-outbox-v1') || '[]');
    return box.find((x) => x.sid === sid)?.payload;
  };
  return { send, data };
}

test('班級作答會帶裝置編號，格式符合後端', () => {
  const { send } = load();
  assert.match(send('sid-00001', 'A101').device_id, /^[A-Za-z0-9-]{8,64}$/);
});

test('同一台裝置每次都是同一個編號', () => {
  const { send } = load();
  assert.equal(send('sid-00001', 'A101').device_id, send('sid-00002', 'B202').device_id);
});

test('不同裝置的編號不同', () => {
  assert.notEqual(load().send('sid-00001', 'A101').device_id, load().send('sid-00001', 'A101').device_id);
});

test('個人版不產生也不送裝置編號', () => {
  const { send, data } = load();
  assert.equal('device_id' in send('sid-00001', null), false);
  assert.equal(data.has('disc-device-v1'), false);
});

test('裝置上已有編號就沿用，壞掉的會換新', () => {
  const { send, data } = load();
  data.set('disc-device-v1', JSON.stringify('saved-device-id'));
  assert.equal(send('sid-00001', 'A101').device_id, 'saved-device-id');
  data.set('disc-device-v1', JSON.stringify('壞掉 的'));
  const next = send('sid-00002', 'A101').device_id;
  assert.notEqual(next, '壞掉 的');
  assert.match(next, /^[A-Za-z0-9-]{8,64}$/);
});
