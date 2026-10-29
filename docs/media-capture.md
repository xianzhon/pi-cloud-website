# Product media refresh

## Source and provenance

The current workflow tour reuses **Pi Cloud 2.0.6** media from the Chinese WeChat article series. All screenshots show the actual application, not HTML reconstructions or DOM replacements. The site copy stays English, with the Chinese-language sample interface identified beside the tour. It does not embed Yuque resources or depend on the demo server.

### Article media reused in the workflow tour

Sources below are relative to the article workspace, `pi-cloud/tmp/wechat-article-series/`. Final assets live in this website's `assets/screenshots/`; the source PNGs and runtime data are not copied into the public site.

| Published WebP | Article source | Dimensions | What it demonstrates |
| --- | --- | --- | --- |
| `workspace-overview-2-0-6.webp` | `assets/01/01-workspace-dark.png` | 1440 × 960 | Conversation/editor layout with a seeded conversation and script-prepared sample fix |
| `first-session-2-0-6.webp` | `assets/02/02-session-setup.png` | 1440 × 960 | Session setup with placeholder credentials; no request sent |
| `task-draft-2-0-6.webp` | `assets/04/01-task-draft.png` | 1440 × 1080 | Unsubmitted task draft, not an executing task |
| `worktree-setup-2-0-6.webp` | `assets/05/01-new-session-worktree.png` | 1440 × 1080 | Worktree configuration, not a created worktree |
| `git-review-2-0-6.webp` | `assets/06/01-regression-test-diff.png` | 1440 × 1080 | Actual sample test diff, not AI-generated changes or a commit |
| `memory-draft-2-0-6.webp` | `assets/07/02-memory-draft.png` | 1440 × 1080 | Unsaved rule draft, not verified recall |
| `gateway-setup-2-0-6.webp` | `assets/09/02-wechat-unpaired.png` | 1440 × 1080 | Unpaired, disabled gateway configuration; no messages sent |
| `prompt-library-2-0-6.webp` | `assets/08/01-prompts.png` | 1440 × 1080 | Viewing a built-in task prompt, not running it |
| `mcp-setup-2-0-6.webp` | `assets/08/03-mcp.png` | 1440 × 1080 | MCP setup without configured servers or tool calls |
| `editor-markdown-2-0-6.webp` | `assets/10/01-reading-preview.png` | 1440 × 1080 | Actual Markdown/Mermaid rendering of manually prepared notes |
| `editor-mind-map-2-0-6.webp` | `assets/10/02-mindmap.png` | 1440 × 1080 | Actual visual rendering of a manually prepared map |
| `settings-security-2-0-6.webp` | `assets/12/01-security.png` | 1440 × 1080 | Unconfigured MFA and API token options; local demo audit entries |
| `workspace-mobile-2-0-6.webp` | `assets/01/07-workspace-mobile.png` | 390 × 844 | Responsive viewport with the same seeded sample, not a physical-device test |

The 13 optimized screenshots total **578,260 bytes**. Convert each approved PNG without resizing or carrying metadata:

```sh
cwebp -q 88 -metadata none SOURCE.png -o assets/screenshots/NAME-2-0-6.webp
```

The article recording `assets/01/06-navigation-demo.mp4` is copied unchanged to `assets/videos/demo-workspace-2-0-6.mp4`: **8.167 seconds**, 1440 × 960, H.264, silent, 293,623 bytes. It shows Command Center → return → Task Inbox → return, not model execution. SHA-256: `8a72c79e3fcdf31d460e5bd8df3e1861a6b247d4e9ec2d2fb41a27fdb1f7232e`. `demo-workspace-poster-2-0-6.webp` is its first frame, extracted with FFmpeg and encoded at WebP quality 88.

The website uses MP4 instead of embedding the article GIF: text is clearer, the download is smaller, and playback remains under user control. Both players have posters, `controls`, `playsinline`, and `preload="none"`; neither autoplays. Images below the hero are lazy-loaded and reserve their actual intrinsic dimensions. Workflow switching updates image dimensions, visible provenance, and the lightbox caption together.

Review sources and preparation details in the article workspace's `evidence/01-demo-notes.md`, `evidence/02-publishing-notes.md`, `evidence/04-06-media-notes.md`, `evidence/07-12-media-notes.md`, and `demo/README.md`. The selected source hashes were checked against the article upload manifest before conversion. New optimized images were visually reviewed; source-frame review sheets for the recording remain in the private article runtime and are not public assets.

No model calls, task execution, account pairing, MCP connections, memory saves, tokens, commits, or pushes were performed for this website refresh. Do not turn configuration screenshots into claims of successful integration or autonomous delivery.

### Retained 2.0.5 media and earlier capture history

The PDF annotation screenshot and mind-map recording still used on the page come from **Pi Cloud 2.0.5**, commit `4270a87`, and are individually version-labelled. Other older media remain at their existing URLs for compatibility. The following sections preserve that earlier capture procedure and history.

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
