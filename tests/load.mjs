// 測試共用：從 index.html 取出資料和 I18N 區塊，在 Node 裡執行（不需要瀏覽器）
import fs from 'node:fs';
const root = new URL('../', import.meta.url);
export const html = fs.readFileSync(new URL('index.html', root), 'utf8');
const g = (a, b) => { const i = html.indexOf(a), j = html.indexOf(b, i); if (i < 0 || j < 0) throw new Error('找不到 ' + a); return html.slice(i, j); };
export function load() {
  const code = [g('const TYPES = ', 'const TCOLOR'), g('const ITEMS = [', '/* ===== 2.'), g('const R_V3 = {', 'const TEXT_DEFAULT')].join('\n');
  const window = {};
  new Function('window', fs.readFileSync(new URL('js/lang-en.js', root), 'utf8'))(window);
  const api = new Function(code + ';return {ZH, get L(){return L;}, useDict, t, LBL, markAnimals, qText, scaleT, addLang, pickLang, ITEMS, PAIRS, ATTN, SCALE, BLIND, R_V3, SUB_V3, BYID};')();
  return { ...api, EN: window.DISC_LANG_EN, src: JSON.parse(fs.readFileSync(new URL('js/lang-en.src.json', root), 'utf8')) };
}
