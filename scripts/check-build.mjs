import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';

// Check the deployed URL graph, including font URLs relative to their stylesheet.
const base = process.env.VITE_BASE_PATH || '/';
const origin = 'https://build-check.invalid';
const html = await readFile('dist/index.html', 'utf8');
assert.ok(!html.includes('/src/main.tsx'), 'Deploy the compiled output, not the TSX entry point');
assert.ok(html.includes('Designed by'), 'The complete homepage must be prerendered');
const stylesheets = new Set();
let checked = 0;

async function check(reference, parent) {
  if (/^(?:#|data:|https?:|mailto:|tel:|\/\/)/i.test(reference)) return;
  const url = new URL(reference, parent);
  assert.ok(url.pathname.startsWith(base), `Asset escapes deployment base ${base}: ${reference}`);
  const file = path.resolve('dist', decodeURIComponent(url.pathname.slice(base.length)));
  assert.ok(file.startsWith(path.resolve('dist') + path.sep), `Invalid asset path: ${reference}`);
  assert.ok((await stat(file)).isFile(), `Missing build asset: ${reference}`);
  checked++;
  if (url.pathname.endsWith('.css')) stylesheets.add(url.href);
}

for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  await check(match[1], origin + base);
}
for (const stylesheet of stylesheets) {
  const pathname = new URL(stylesheet).pathname;
  const css = await readFile(path.join('dist', pathname.slice(base.length)), 'utf8');
  for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
    await check(match[1], stylesheet);
  }
}
console.log(`Build check passed: ${checked} local asset references resolve under ${base}`);
