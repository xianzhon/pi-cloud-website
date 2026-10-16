import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');

test('all local assets and screenshot targets exist', async () => {
  const paths = new Set([...html.matchAll(/(?:src|href|poster|data-img|data-lightbox)="(assets\/[^"#]+)"/g)].map(match => match[1]));
  assert.ok(paths.size > 10);
  for (const path of paths) {
    assert.ok((await stat(new URL(path, root))).size > 0, path);
  }
});

test('navigation anchors resolve to page sections', () => {
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(html.includes(`id="${id}"`), `Missing anchor: ${id}`);
  }
});

test('demo videos are opt-in and have poster images and fallbacks', () => {
  const videos = [...html.matchAll(/<video\b([^>]+)>([\s\S]*?)<\/video>/g)];
  assert.equal(videos.length, 2);
  for (const [, attributes, content] of videos) {
    assert.match(attributes, /\bcontrols\b/);
    assert.match(attributes, /\bplaysinline\b/);
    assert.match(attributes, /preload="none"/);
    assert.match(attributes, /poster="assets\/screenshots\//);
    assert.doesNotMatch(attributes, /\bautoplay\b/);
    assert.match(content, /type="video\/mp4"/);
    assert.match(content, /<a href="assets\/videos\//);
  }
});

test('product images reserve space and screenshot buttons have accessible names', () => {
  for (const [tag] of html.matchAll(/<img\b[^>]+>/g)) {
    if (tag.includes('id="lightbox-img"')) continue;
    assert.match(tag, /width="\d+"/);
    assert.match(tag, /height="\d+"/);
    assert.match(tag, /alt="[^"]+"/);
  }
  for (const [tag] of html.matchAll(/<button\b[^>]*class="screenshot-button[^>]+>/g)) {
    assert.match(tag, /aria-label="[^"]+"/);
  }
});
