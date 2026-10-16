# Pi Cloud Website

The landing page for [Pi Cloud](https://github.com/xianzhon/pi-cloud).

## Local preview

Serve this directory with any static HTTP server, for example:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080. There is no build step.

## Checks

Dependency-free content/asset checks (Node.js 22+):

```sh
node --test scripts/site.test.mjs
node --check script.js
```

Optional browser checks, with the preview server running and Chrome installed:

```sh
npm install --no-save --package-lock=false playwright
node scripts/browser-check.mjs
```

To reuse an existing CDP browser instead of launching Chrome:

```sh
NO_PROXY=127.0.0.1,localhost CDP_URL=http://127.0.0.1:9222 node scripts/browser-check.mjs
```

Override `SITE_URL` for a different preview port. Browser checks use an isolated context, exercise the showcase, screenshot lightboxes, installation tabs, and both videos, and verify four viewport sizes in both themes. Review captures under `tmp/verification/` (ignored by Git).

## Product media

The current tour uses real Pi Cloud 2.0.5 UI with isolated sample content, 12 refreshed product screenshots, and two short opt-in MP4 demos. See [media capture notes](docs/media-capture.md) for provenance, scene descriptions, isolation requirements, and the recapture workflow. Legacy media URLs are retained for existing links.
