import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.SITE_URL || 'http://127.0.0.1:8080';
const output = new URL('../tmp/verification/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = process.env.CDP_URL
  ? await chromium.connectOverCDP(process.env.CDP_URL)
  : await chromium.launch({ channel: 'chrome' });
// A fresh context avoids touching the user's existing tabs or site preferences.
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 }, colorScheme: 'dark', reducedMotion: 'reduce',
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => {
  if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
});

try {
  await page.goto(baseURL);
  for (const tab of await page.locator('.showcase-tab').all()) {
    await tab.click();
    const src = await tab.getAttribute('data-img');
    assert.equal(await page.locator('#showcase-img').getAttribute('src'), src);
    assert.equal(await tab.getAttribute('aria-pressed'), 'true');
    await page.locator('#showcase-img').evaluate(img => img.decode());
    const dimensions = await page.locator('#showcase-img').evaluate(img => ({
      reserved: [Number(img.getAttribute('width')), Number(img.getAttribute('height'))],
      natural: [img.naturalWidth, img.naturalHeight],
    }));
    assert.deepEqual(dimensions.reserved, dimensions.natural, `Wrong reserved image dimensions for ${src}`);
    assert.equal(await page.locator('#showcase-note').innerText(), await tab.getAttribute('data-note'));
    assert.equal(await page.locator('.showcase-tab[aria-pressed="true"]').count(), 1);
    await page.locator('#showcase-open').click();
    assert.equal(await page.locator('#lightbox-dialog').evaluate(dialog => dialog.open), true);
    assert.ok((await page.locator('#lightbox-img').getAttribute('src')).endsWith(src));
    assert.ok((await page.locator('#lightbox-caption').innerText()).includes(await tab.getAttribute('data-note')));
    await page.locator('#lightbox-img').evaluate(img => img.decode());
    await page.keyboard.press('Escape');
  }
  for (const button of await page.locator('[data-lightbox]').all()) {
    await button.click();
    await page.locator('#lightbox-img').evaluate(img => img.decode());
    assert.equal(await page.locator('#lightbox-dialog').evaluate(dialog => dialog.open), true);
    await page.getByRole('button', { name: 'Close screenshot', exact: true }).click();
  }
  await page.getByRole('button', { name: 'npx', exact: true }).click();
  assert.equal(await page.locator('#cli-code').innerText(), 'npx pi-cloud@latest');
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(baseURL).origin });
  await page.locator('#main-copy-btn').click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'npx pi-cloud@latest');
  await page.waitForFunction(() => document.getElementById('main-copy-btn').innerText === 'Copy');
  await page.getByRole('button', { name: 'npm', exact: true }).click();
  await page.locator('#main-copy-btn').click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'npm install -g pi-cloud && pi-cloud');
  await page.waitForFunction(() => document.getElementById('main-copy-btn').innerText === 'Copy');
  for (const video of await page.locator('video').all()) {
    assert.equal(await video.getAttribute('autoplay'), null);
    await video.evaluate(async element => { await element.play(); });
    await page.waitForTimeout(500);
    assert.ok(await video.evaluate(element => element.currentTime > 0));
    await video.evaluate(element => element.pause());
  }
  await page.locator('.showcase-tab').first().focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.showcase-tab').first().getAttribute('aria-pressed'), 'true');
  for (const theme of ['dark', 'light']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) {
      await page.locator('.theme-toggle').click();
    }
    for (const width of [1440, 768, 390, 360]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(async () => {
        for (const img of document.images) {
          img.loading = 'eager';
          await img.decode();
        }
      });
      const size = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
      assert.ok(size.content <= size.viewport, `Overflow: ${theme}, ${width}px`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.mouse.move(0, 0);
      await page.screenshot({ path: new URL(`site-${theme}-${width}.png`, output).pathname, fullPage: true });
    }
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const theme of ['dark', 'light']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) {
      await page.locator('.theme-toggle').click();
    }
    for (const tab of await page.locator('.showcase-tab').all()) {
      await tab.focus();
      await page.keyboard.press('Enter');
      await page.locator('#showcase-img').evaluate(img => img.decode());
      assert.equal(await page.locator('#showcase-img').getAttribute('src'), await tab.getAttribute('data-img'));
      assert.equal(await page.locator('#showcase-note').innerText(), await tab.getAttribute('data-note'));
    }
    await page.waitForTimeout(250);
    await page.locator('.showcase-card').screenshot({ path: new URL(`workflow-mobile-${theme}.png`, output).pathname });
    await page.locator('#showcase-open').click();
    assert.equal(await page.locator('#lightbox-dialog').evaluate(dialog => dialog.open), true);
    await page.locator('#lightbox-img').evaluate(img => img.decode());
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#lightbox-dialog').evaluate(dialog => dialog.open), false);
  }
  assert.deepEqual(errors, []);
  console.log('PASS: workflow images and dimensions, provenance captions, desktop/mobile keyboard activation and lightboxes, install tabs and clipboard, video playback, both themes, four viewport sizes, reduced/normal motion, and asset loading.');
} finally {
  await context.close();
  await browser.close();
}
