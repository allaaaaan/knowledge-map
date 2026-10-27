# Knowledge garden

A free, static, read-only knowledge map built with the open-source Excalidraw React component. The included map is **original generic demonstration content about learning**, not the owner's personal facts.

## Explore

Drag to pan; pinch or use + / − to zoom. Zoom reveals three layers:

| Canvas zoom | Visible content |
| --- | --- |
| Below 70% | Main ideas and arrows |
| 70%–114% | Supporting connections |
| 115% and above | Field notes and examples |

Fit returns to the overview. Keyboard: focus the map then use + / − and 0 (fit). A plain-text alternative follows the canvas. The downloadable `map.excalidraw` is a normal Excalidraw v2 file; open it in the free Excalidraw editor. All drawing elements are present in the file; semantic visibility is a feature of this website, stored as each element's `customData.minZoom`.

## Private source → public map

The owner's private `allaaaaan/personal` repository remains the source of truth for facts and discussion. **This public repository never reads, fetches, clones, imports or automatically synchronizes that private repository.** No cross-repository secrets or personal access tokens are required.

1. Discuss/author in the private repository using your own AI or the free Excalidraw editor.
2. Explicitly select and approve the exact material for a public release. Make a separate sanitized export; do not copy the private working directory.
3. Inspect every element, including hidden/deleted elements, `customData`, links, and embedded files. Remove unpublished facts, private names/URLs, secrets, and source notes. Anything in the public file or Git history is public, even if hidden at a zoom level.
4. Replace `public/map.excalidraw` with that **approved public export**. Update the text alternative in `src/main.jsx`. Ensure `customData.minZoom` uses 0, 0.7, or 1.15.
5. Run `npm ci`, `npm test`, and `npm run build`. Review the map locally, then commit/merge using the owner's GitHub account. The Pages workflow publishes `dist/` only.

GitHub repository write permissions control publication. There is no browser login, public editing endpoint, save API, database, AI service, or billing dependency. Keep repository write access restricted to the owner; don't grant collaborators or bots write access unless deliberately wanted. Visitors can download/fork/edit their **own copies**; read-only publishing is not DRM. Do not place secrets or unpublished information anywhere in this public repository.

The demo generator in `scripts/create-demo.py` is optional and overwrites the demo; do not run it over a curated map.

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

`npm test` checks semantic levels, center-preserving zoom, scene portability and the demo's absence of external/private data, plus controlled view-only mode. These are focused tests, not a security audit. For browser QA, verify desktop and phone fit, pan, zoom thresholds, keyboard controls, help dismissal, download import into Excalidraw, no horizontal overflow, and absence of errors/network writes. Do not claim deployment until the actual Pages URL works.

API references: [Excalidraw props](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/), [imperative API](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/excalidraw-api), [self-hosting fonts](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/installation).
