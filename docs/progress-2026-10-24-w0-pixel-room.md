# 2026-10-24 · W0 pixel-room migration

The active page now uses one native 480 × 360 Canvas 2D image plus live pixel layers. There is no three.js import in the active module graph. Old 3D sources, models, renders and Git history are preserved. No commit was made and no design/spec/reference documents were edited.

The room is intentionally a plain schematic placeholder. Zach's final AI room has not arrived. Replacing room.png and adjusting scene.json in placement mode is the intended next art step, not another renderer rewrite.

## What changed

- Recovered the Canvas approach from f5d6064, retaining the earlier JSONL parsing, file/drop controls, raw-event card and event dispatch structure. Adapted the later tagged-hangout behavior to image coordinates. The fake generator and existing fixture remain unchanged.
- Native-resolution composition, whole-number zoom steps, letterboxing, panning, hover names and centered follow. Canvas backing size tracks CSS stage size without a device-pixel-ratio multiplier.
- Occluder cut-outs are clipped directly from the room image and sorted against sprite feet. Placement edits polygons, centers, foot lines, spots and poses/tags, path vertices, window rectangles and steam; it creates/deletes objects and exports complete JSON.
- Additive lamp/TV/RGB regions, clipped two-depth snow, twinkles, steam and dust; stepped native-pixel grade/vignette.
- Approved SVG rectangles become tiny transparent PNG frames directly at 1/4 scale. Body-only tint is refreshed from look.js at page load. Sit/floor, lie, flip, 1-pixel bob, blink, hop, moth flap, activity items, interest props, effects and plane variants use the same native pixel grid.
- Destination reservations include sprite spacing, as well as live movement collision checks. Shared game spots form a coffee-table group. Helping/serving retain their location; resting agents wander without changing their true state.
- Cleaner detects consistent enlarged integer grids, samples with nearest-neighbor, aspect-fits the native canvas, and quantizes without dithering. An explicit pixel-size override handles uncertain/inconsistent AI grids.

## Done-when checklist

| Spec item | Result | Evidence / limit |
| --- | --- | --- |
| 1. Deterministic generator and --check | PASS | Two seed-1 ten-minute outputs have identical bytes; existing fixture validates OK. Generator unchanged. |
| 2. Complete playback at 1×, 4×, 16× | PASS | Browser processes all 529 events at each speed; no page/console errors. Controlled 0.1-second clock ticks exercise the complete run without thirty minutes of wall time. |
| 3. Crisp integer scale and letterbox | PASS | Fit is 2× in 1440×1000; fit+2 is 4×. Native composition then nearest-neighbor upscale. Title/controls outside the stage; resize checks pass at 900, 1440 and 1920 widths, including device pixel ratio 1.25. |
| 4. Grid/palette cleaner, no dither | PASS | Supplied reference produces 480×360 with 44 palette colors and no dither; a synthetic 4× source is detected as 4. Reference is conservatively treated as native 1×, rather than asserting a grid the detector cannot establish. |
| 5. Twelve distinct sprite agents, no overlap | PASS | Four approved species, three body tints and twelve interest props. Full-run spacing checks report zero overlaps at all three speeds, including walking. Furniture can intentionally hide sprites. |
| 6. Behind/front occlusion | PASS | Exact native-pixel check: behind-sofa pixel equals the original room; in-front pixel contains the creature. |
| 7. Activity and event animations, free resting | PASS | All five states and six tool effects exercised/rendered; activity screenshot includes books, controllers, laptop, headphones and feedback. Targeted resting check moved all twelve agents. Targeted paired-play check puts both in the same game group, separated. |
| 8. Planes, destinations, declined variant, timing | PASS | Letter/bundle/canvas variants; empty fluttering declined sprite. A 200 ms event lasts 3.5 real seconds by the formula. Receiver ID is correct and an early receipt leaves the plane alive. |
| 9. Flicker, RGB, snow | PASS | Live window snow/twinkles and lamp/TV/RGB flicker. Native-pixel color comparison confirms RGB recoloring. |
| 10. Busy catch-up within about 5 seconds | PASS | Every event is dispatched; animation effects are retained. Walk queue is bounded at five real seconds; 16× has no walking queue. Tools shorten after five seconds of demand. |
| 11. Card and follow | PASS | Actual browser click checks current tool/arg and expandable raw JSON; Follow centers at zoom and Escape releases it. |
| 12. Unknown events/extra fields | PASS | Unknown type ignored; known event with extra fields still applies without errors. |
| 13. Look tuning and complete placement export | PASS | Palette/light/weather/grade/view/timing/tint settings in look.js. Actual drag/export and new-polygon/foot-line checks pass. Intrinsic sprite shapes remain in the approved art. |
| 14. README | PASS | Run/build, fake log, cleaner overrides, art swap, placement, controls and focused checks documented. |
| 15. Screenshots and dated note | PASS | This note; fit, fit+2, placement, activities and cleaner images in docs/. |

No checklist item is left as a known failing implementation item. Final illustrated room art and its visual polish are still pending Zach's image; current checks concern the requested placeholder build. Broad claims such as 60 fps on every PC were not measured.

## Evidence

- w0-pixel-verification.json: full-log playback, overlap checks, states/effects and plane timing.
- w0-pixel-interaction-check.json: depth pixels, RGB, real card/follow interactions, drag/export/new polygon and resize.
- w0-pixel-hangout-check.json: resting movement and paired game grouping.
- w0-pixel-art-check.json: deterministic generator hash, palette and cleaner/grid checks.
- pixel-clean-test.png: requested reference cleaning result.
- w0-pixel-fit.png and w0-pixel-fit-plus-2.png: normal playback at both requested zooms.
- w0-pixel-placement.png and w0-pixel-activities.png: editor and targeted live animation evidence.

The existing fake generator sometimes names a playing partner without a matching playing-state event for that partner. Playback respects the true log state; it does not fabricate a second state event. The paired-state check separately verifies group selection when both partners are playing.

## Run

`npm run dev --prefix world` from C:/Outernet, then open the Vite URL. The review server is http://127.0.0.1:5180. `npm run build --prefix world` passes. Local Playwright checks use installed Edge and are listed in world/README.md.
