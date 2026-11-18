// 輸入狀態：用 Node 內建 EventTarget 與手動建的事件物件測。
import test from 'node:test';
import assert from 'node:assert/strict';
import { createInput } from '../home/ride/input.js';

const key = (type, k) => {
  const e = new Event(type);
  e.key = k;
  e.prevented = false;
  e.preventDefault = () => { e.prevented = true; };
  return e;
};

test('ArrowRight 按下為 true，放開為 false，且 preventDefault', () => {
  const t = new EventTarget();
  const inp = createInput(t);
  const down = key('keydown', 'ArrowRight');
  t.dispatchEvent(down);
  assert.equal(inp.state.right, true);
  assert.equal(down.prevented, true);
  t.dispatchEvent(key('keyup', 'ArrowRight'));
  assert.equal(inp.state.right, false);
});

test('a/A 與 d/D 對應左右', () => {
  const t = new EventTarget();
  const inp = createInput(t);
  t.dispatchEvent(key('keydown', 'A'));
  t.dispatchEvent(key('keydown', 'd'));
  assert.equal(inp.state.left, true);
  assert.equal(inp.state.right, true);
});

test('視窗失去焦點（blur）清空狀態', () => {
  const t = new EventTarget();
  const inp = createInput(t);
  t.dispatchEvent(key('keydown', 'ArrowLeft'));
  t.dispatchEvent(key('keydown', 'ArrowRight'));
  t.dispatchEvent(new Event('blur'));
  assert.equal(inp.state.left, false);
  assert.equal(inp.state.right, false);
});

test('press() 與鍵盤互不覆蓋', () => {
  const t = new EventTarget();
  const inp = createInput(t);
  inp.press('left', true);
  t.dispatchEvent(key('keydown', 'ArrowRight'));
  assert.equal(inp.state.left, true);
  assert.equal(inp.state.right, true);
  t.dispatchEvent(key('keyup', 'ArrowRight'));
  assert.equal(inp.state.left, true);
});

test('dispose() 之後事件不再改變狀態', () => {
  const t = new EventTarget();
  const inp = createInput(t);
  inp.dispose();
  t.dispatchEvent(key('keydown', 'ArrowRight'));
  assert.equal(inp.state.right, false);
});

test('無關按鍵不 preventDefault', () => {
  const t = new EventTarget();
  createInput(t);
  const e = key('keydown', 'Tab');
  t.dispatchEvent(e);
  assert.equal(e.prevented, false);
});
