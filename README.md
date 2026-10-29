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

Override `SITE_URL` for a different preview port. Browser checks use an isolated context, exercise all six workflow views, verify screenshot dimensions and provenance captions, test lightboxes, keyboard activation, installation tabs, clipboard copying, and both videos, and verify four viewport sizes in both themes. Mobile workflow controls and lightboxes are also exercised with normal motion, in addition to the reduced-motion checks. Review captures under `tmp/verification/` (ignored by Git).

## Product media

The tour follows six practical steps: start a session, capture a task, isolate an experiment, review changes, keep a project memory, and configure a messaging entry point. Supporting sections cover reusable prompts, MCP setup, documents, mind maps, PDF feedback, security, and mobile follow-up.

It reuses 13 privacy-reviewed Pi Cloud 2.0.6 screenshots from the WeChat article series, optimized to WebP, and the series' 8-second browser recording as click-to-play MP4. The site copy remains English; these captures show the Chinese-language UI. The earlier 2.0.5 PDF screenshot and 14-second mind-map video remain, with explicit version labels.

Sample conversations are seeded, setup screens do not prove execution or successful connections, and no live model runs are presented. See [media capture notes](docs/media-capture.md) for source mappings, isolation requirements, and recapture instructions. Legacy media URLs are retained; the site has no runtime dependency on the article workspace or demo server.
