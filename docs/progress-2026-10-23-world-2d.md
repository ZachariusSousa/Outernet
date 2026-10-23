# Illustrated W0 — 2026-10-23

Replaced the Three.js renderer with Canvas 2D. Preserved the fake-log generator and contract, extracted and adapted the existing event dispatch, parser, playback clock/controls, message timing and card. Removed Three.js dependency. Added PNG layer and puppet assets, pivots, scene.json, additive light-region flicker, multiply night, foot-y sorting, blinking, poses, hop/squash motion, plane-facing heads, prop anchors, waypoint paths, fixed letterboxed framing, mouse parallax, follow zoom and P placement editing with JSON export.

All artwork is intentionally plain placeholder. No design-doc changes or commits.

## Done when review
- PASS: preserved fake log passes --check. Seeded generator unchanged; determinism previously checked.
- PARTIAL: page loads without JavaScript errors; complete 1x/4x/16x replays not rerun after migration.
- PARTIAL: 12 puppets render and slots reserve destinations. Shared waypoint routes can overlap while walking, and placeholder species silhouettes need more distinction. Cannot claim zero overlaps.
- PARTIAL: event dispatch retained; tools use symbols rather than all physical actions in the animation table.
- PASS by code inspection: planes retain endpoints, timing clamp and declined flutter; receipt cannot cancel them. End-to-end timing not measured this pass.
- PASS by implementation: immediate event consumption and interrupted-walk poofs prevent queue buildup. Original behavior retained, rather than introducing a measured five-second queue.
- PARTIAL: existing card and raw events retained; follow wired to 2D zoom. Full click/follow regression not automated.
- PASS by inspection: unknown fields/types tolerated by existing parser/dispatcher.
- PARTIAL: principal settings centralized in look.js; inherited CSS and some sprite constants remain inline. Grade/bloom/rim controls are not yet implemented.
- PASS: art loads externally, replacement needs no code; P exposes draggable spots, paths, decor and foot lines plus JSON copy/export. Export roundtrip still needs a manual check.
- PASS: art/CREDITS.md and README cover all generated images and running/replacing art.
- UNVERIFIED: integrated GPU 60fps. Canvas renderer has no WebGL dependency; production JS is about 15 KB before gzip.
- PASS: docs/world-2d-normal.png and docs/world-2d-placement.png captured with local Playwright/Edge; 12 agents, no page errors. Production build passes and includes art.

Remaining: strict collision avoidance in motion, richer physical tool actions, dust/steam, remaining look centralization and grade effects, full replay/interaction checks. This is an incomplete W0 implementation with the requested 2D foundation in place.
