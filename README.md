# Knowledge map

A free, static, read-only knowledge map. It contains four top-level topics: **Money**, **Physical Health**, **Mental Health**, **Learning**. The first approved resource is [What is Bank](https://www.youtube.com/watch?v=CNMo3EtWHu8) under Money. No other knowledge content has been published.

## Viewer

The website deliberately uses very little interface copy: the map fills most of the screen, with compact read-only zoom/fit controls. On narrow screens the initial view fits all four roots without cropping either column. A small personal statement sits unobtrusively below the map. Semantic zoom supports future knowledge layers:

| Canvas zoom | Visible content |
| --- | --- |
| Below 70% | Four category blocks |
| 70%–114% | Money → What is Bank video link; future knowledge nodes |
| 115% and above | Reserved for deeper notes |

The four roots remain visible at `customData.minZoom: 0`. The Money video node (card, title, connector) is revealed at `0.7`, with a YouTube URL in Excalidraw's native `link` field on both card and title, so tapping the linked element opens the video in view mode. The `1.15` level is reserved for future details. Fit restores all four categories. The collapsible text alternative contains the four categories and an accessible video hyperlink. The downloadable `map.excalidraw` is a normal Excalidraw v2 file; open it in the free Excalidraw editor. All drawing elements are present in the file; semantic visibility is a feature of this website, stored as each element's `customData.minZoom`.

## Private source → public map

The owner's private `allaaaaan/personal` repository remains the source of truth for facts and discussion. **This public repository never reads, fetches, clones, imports or automatically synchronizes that private repository.** No cross-repository secrets or personal access tokens are required.

1. Discuss/author in the private repository using your own AI or the free Excalidraw editor.
2. Explicitly select and approve the exact material for a public release. Make a separate sanitized export; do not copy the private working directory.
3. Inspect every element, including hidden/deleted elements, `customData`, links, and embedded files. Remove unpublished facts, private names/URLs, secrets, and source notes. Anything in the public file or Git history is public, even if hidden at a zoom level.
4. Replace `public/map.excalidraw` with that **approved public export**. Update the text alternative in `src/main.jsx`. Ensure `customData.minZoom` uses 0, 0.7, or 1.15.
5. Run `npm ci`, `npm test`, and `npm run build`. Review the map locally, then commit/merge using the owner's GitHub account. The Pages workflow publishes `dist/` only.

GitHub repository write permissions control publication. There is no browser login, public editing endpoint, save API, database, AI service, or billing dependency. Keep repository write access restricted to the owner; don't grant collaborators or bots write access unless deliberately wanted. Visitors can download/fork/edit their **own copies**; read-only publishing is not DRM. Do not place secrets or unpublished information anywhere in this public repository.

The original demo generator was removed. Preserve stable root identifiers (`topic-<slug>-box` and `topic-<slug>-title`) when extending the scene.

## Run locally

Requires Node.js 22 and npm.

```sh
npm ci
npm test
npm run build
npm run dev -- --host 127.0.0.1
```

Open the shown local URL with `/knowledge-map/`. For a different repository name, update `base` in `vite.config.js`, the public source links and scene `source` field. Build copies Excalidraw's fonts locally; production requires no external font CDN.

## Publish to GitHub Pages

Create a new **public** repository named `knowledge-map` under the intended owner. Keep `personal` private. Push these files to `main`, then in the public repository's **Settings → Pages → Build and deployment**, select **GitHub Actions**. Run the included workflow or push a commit. Confirm its deployment succeeds and visit the URL reported by the deploy job. The expected project URL is `https://allaaaaan.github.io/knowledge-map/`, but it is not live until GitHub confirms deployment.

GitHub Pages for a public repository and the MIT-licensed Excalidraw component do not require an Excalidraw subscription. GitHub account/usage policies still apply.

## Verification

`npm test` checks the four category roots, absence of demo content, semantic zoom extensibility, center-preserving zoom, scene portability and controlled view-only mode. These are focused tests, not a security audit. For browser QA, verify desktop and phone fit, pan, zoom thresholds, keyboard controls, legible mobile initial view, download import into Excalidraw, no horizontal overflow, and absence of errors/network writes. Do not claim deployment until the actual Pages URL works.

API references: [Excalidraw props](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/), [imperative API](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/excalidraw-api), [self-hosting fonts](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/installation).

## Visual browser QA

A separate GitHub Actions workflow, `.github/workflows/playwright-visual-qa.yml`, uses real headless Chromium through Playwright to check the **deployed public URL** and save desktop (1440×900) and phone (390×844) screenshots.

- Runs automatically after a successful `Build and deploy public map` workflow, or manually via **Actions → Playwright visual QA → Run workflow**. It does **not** publish content or read the private `personal` repository.
- Installs Playwright and Chromium on the GitHub Actions runner and executes `scripts/visual-qa.mjs`.
- Tests HTTP status, page rendering, overflow, public Excalidraw node/link metadata, zoom controls across the 70% threshold, and the accessible YouTube link opening a new tab.
- Uploads `knowledge-map-visual-qa` artifact with desktop and phone screenshots, `report.json`, and console diagnostics. Artifacts are retained for 30 days.
- Excalidraw's **canvas-embedded link gesture** is not conclusively tested by clicking the fallback HTML link; use screenshots and manual pointer QA for that interaction.

The workflow is a repeatable verification step. A successful build alone is not evidence that a map is visually correct.
