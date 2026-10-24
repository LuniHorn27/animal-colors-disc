import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../peer-en.html', import.meta.url), 'utf8');

test('peer-en.html 預覽資訊全英文，且圖檔存在', () => {
  const metas = [...html.matchAll(/<meta[^>]+(?:og:|twitter:)[^>]*>/g)].map(m => m[0]).join('\n');
  assert.ok(metas.length > 0);
  assert.ok(!/[一-鿿]/.test(metas), '預覽 meta 不可含中文');
  const img = html.match(/og:image"\s+content="[^"]*\/(brand\/[^"]+)"/);
  assert.ok(img, '缺 og:image');
  assert.ok(existsSync(new URL('../' + img[1], import.meta.url)), 'og 圖檔不存在');
  assert.match(html, /peer\.html\?lang=en/);
});
