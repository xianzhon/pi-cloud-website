# Product media refresh

## Source and provenance

The current tour was captured from a fresh source build of **Pi Cloud 2.0.5**, commit `4270a87`. All screenshots show the actual application, not HTML reconstructions or DOM replacements.

The Atlas repository, three conversations, task drafts, and memories are **sample content seeded for demonstration**. The conversation is not evidence of a live model run or test execution. No live AI requests were made. A nonfunctional placeholder credential enabled the model selector in the isolated demo profile; it must never be reused as a real credential.

## Isolation

For the refresh, the production bundles were copied to a temporary application directory with its own `HOME`, `XDG_CONFIG_HOME`, agent profile directory, SQLite database, and allowed root. The copy deliberately excluded the source deployment's `.env`. The server was started with a minimal environment, loopback binding, separate authentication, and messaging gateways disabled.

Do not run the fixture setup against a personal or production database. Do not copy real sessions, credentials, shell history, gateway accounts, or provider configuration into captures. The existing application need not be restarted.

Browser automation used Playwright connected to Chrome over CDP on port 9222. Every run created and closed its own browser context, without reusing existing tabs, cookies, or local storage.

## Capture recipe

1. Build the current Pi Cloud source with `pnpm build` and start the isolated copy.
2. Create a small Git repository (`atlas`) with a TypeScript task-progress function, one uncommitted empty-list fix, a regression-test example, a Markdown README, architecture notes, and a Mermaid release mind map.
3. Populate clearly synthetic conversations, waiting tasks, project/global memories, and a pinned group containing sessions and files. Do not start tasks, polish prompts, or trigger AI generation while capturing.
4. Sign in with Playwright in a fresh context. Use English, a **1440 × 960** viewport, device scale 1, and dark theme. Capture light theme separately. Mobile uses **390 × 844**. These are responsive viewport captures, not physical-device tests.
5. Wait for fonts, Monaco, diagrams, and PDF pages to finish rendering. Move the pointer away from the subject and dismiss tooltips. Do not alter application DOM or CSS to fake product states.
6. Save original PNGs outside the published asset tree. Encode screenshots with Sharp as WebP at quality 88. Set intrinsic image dimensions in the HTML.
7. Inspect each image for private paths, account identifiers, credentials, and unrelated tabs before publishing.

| Published image | Scene |
| --- | --- |
| `workspace-overview.webp` | Sample bug-fix conversation beside `src/tasks.ts`; file tree hidden, editor resized for readability |
| `workspace-light.webp` | The same workspace in light theme |
| `command-center.webp` | Cmd/Ctrl+K with recent sessions and workspace actions |
| `sessions-pinned.webp` | Pinned group containing two sessions and project files |
| `task-inbox.webp` | Three waiting tasks, without starting any agent run |
| `git-review.webp` | Git Commit window with unstaged changes and the actual diff |
| `memory-project.webp` | Project Memory Center with sample rule, fact, and decision |
| `editor-markdown-preview.webp` | Maximized Markdown preview, Mermaid flowchart, and outline |
| `editor-mind-map.webp` | Maximized visual mind-map editor |
| `editor-pdf-annotation.webp` | Markdown converted through the application's PDF-copy action; rectangle drawn around the checklist |
| `settings-security.webp` | Current Security page: TOTP, passkey setup, API tokens, audit log |
| `workspace-mobile.webp` | Responsive conversation and composer |
| `demo-navigation-poster.webp` | First frame of the navigation recording |

## Recordings

The clips are silent, real UI interactions—not simulated typing or rendered mockups:

- **Navigation (~13s):** open Command Center → search `release` → open the release session → open/close Task Inbox → select Pinned.
- **Mind map (~14s):** start in Visual → Raw → Preview → Visual, pausing so each view can be read.

Record only the page viewport with CDP `Page.startScreencast` (JPEG quality 90), acknowledge frames, and retain capture timestamps. Assemble frames with FFmpeg's concat demuxer and frame durations. Encode as H.264, 24 fps, `yuv420p`, CRF 23, `+faststart`, with no audio. Preserve a final still long enough to read. Extract the navigation poster from its first frame.

MP4 is used instead of GIF for text clarity, smaller downloads, and playback controls. Videos have posters, `playsinline`, `preload="none"`, and no autoplay. Descriptions beside each player explain the workflow; no information depends on audio.

The old Git-bugfix video remains at its original URL because the Pi Cloud README links to it. Unused legacy screenshots are retained rather than breaking possible incoming links; the current page references only refreshed product media.

## Refresh checklist

- Compare current README/manuals and UI before changing claims.
- Match every image to its surrounding feature text.
- Check desktop, tablet, and phone widths in both themes.
- Check keyboard activation, screenshot zoom, Escape dismissal, and videos.
- Run the checks in the website README.
- Review the local preview before publishing. Do not deploy automatically as part of capture.
