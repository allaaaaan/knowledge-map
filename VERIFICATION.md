# Verification record

- Focused Node unit tests: 4 passing (semantic zoom thresholds, centered/clamped zoom, portable original demo scene, view-only/no persistence source guard).
- Production Vite build: passing after a clean dependency install.
- Production dependency audit: zero critical, high, or moderate findings; four low-severity transitive findings remain in the upstream Mermaid/KaTeX dependency chain. The map does not offer Mermaid or math input. Patched overrides pin lodash-es 4.18.1 and nanoid 3.3.20. This is not a claim of complete security.
- Source/private-data boundary: this project was authored from original generic demo text; no private repository files were read or copied into it. The public scene has no embedded files, links, deleted elements, or personal facts.
- Browser QA: attempted local Chromium launch; blocked by environment socket restrictions. An ordinary escalation failed at the environment wrapper, so desktop/mobile visual checks, real pointer/pinch behavior, keyboard interaction, and actual Excalidraw re-import are **not yet verified**. Test these before declaring the site ready.
- The first version was successfully deployed from commit `d552c364` by GitHub Actions. Verify each *new* commit's GitHub Pages deployment and live URL separately.

## Browser acceptance checklist

1. Desktop 1440×1050 and phone 390×844: diagram visible on initial load; no horizontal page overflow.
2. Zoom in from overview: connections appear at 70%, notes at 115%; zoom out hides each again. Fit restores overview. Repeat controls.
3. Drag/pinch canvas; verify real pan and zoom, no editing or save controls.
4. Tab through controls. Focus map and test +, −, 0. Check the minimal footer and collapsed text alternative.
5. Download `map.excalidraw`; import into free Excalidraw; confirm all 3 content levels exist in the drawing. Editing that copy cannot change the website.
6. Inspect console and network; confirm no errors, no private URLs, no data writes, local font loads.
7. Compare the deployed revision to the reviewed scene and inspect mobile once more on the live URL.

## Compact personal-view update (2026-10-28)

- Removed explanatory hero, usage walkthrough and footer legend; reduced node text across overview, connections and field notes.
- Added a deliberately subdued personal footer line. Maintained text-only fallback and read-only controls.
- Mobile: full-viewport canvas, comfortable touch targets, initial readable close-up with pan, and a separate whole-map Fit action. Current zoom thresholds remain 0 / 0.7 / 1.15.
- Browser gesture and viewport testing must be reported honestly; CI build/deploy success is necessary but not equivalent to visual mobile QA.
