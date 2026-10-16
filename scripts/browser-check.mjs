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
    await page.locator('#showcase-open').click();
    assert.equal(await page.locator('#lightbox-dialog').evaluate(dialog => dialog.open), true);
    assert.ok((await page.locator('#lightbox-img').getAttribute('src')).endsWith(src));
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
  await page.getByRole('button', { name: 'npm', exact: true }).click();
  for (const video of await page.locator('video').all()) {
    assert.equal(await video.getAttribute('autoplay'), null);
    await video.evaluate(async element => { await element.play(); });
    await page.waitForTimeout(500);
    assert.ok(await video.evaluate(element => element.currentTime > 0));
    await video.evaluate(element => element.pause());
  }
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
      await page.screenshot({ path: new URL(`site-${theme}-${width}.png`, output).pathname, fullPage: true });
    }
  }
  assert.deepEqual(errors, []);
  console.log('PASS: showcase, lightboxes, install tabs, video playback, both themes, four viewport sizes, and asset loading.');
} finally {
  await context.close();
  await browser.close();
}
