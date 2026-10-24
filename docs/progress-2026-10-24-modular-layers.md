# 2026-10-24 · W0 modular layers and sprite-sheet pipeline

Implemented the rewritten modular spec with deliberately plain placeholder artwork. No new AI generation, design-doc edits or commits. The earlier generated room and all render evidence remain on disk/history.

The active page autoloads fake-run.jsonl and displays all twelve creature agents with play/pause and 1x/4x/16x controls. Older preview query parameters no longer suppress playback or select retired assets.

## Changes

- Added sprite_cut.py: cleans an entire magenta sheet at the same explicit source-pixel scale as the shell, preserves #FF00FF through quantization, cuts eight-connected foreground regions, trims them and writes named PNGs plus size/base-line/source-bounds metadata. Count/name/scale conflicts stop rather than guessing. Four placeholder sheets exercise the real pipeline and yield 42 palette assets.
- Added separate backdrop.png and keyed shell.png, including window/surrounding transparency. Placeholder architecture suggests the L-shaped floor/terrace, stepped tower, curved glass corner and two-step sunken living area. It is intentionally schematic.
- Added layout.json for sprite instances and string/fairy/RGB polylines; scene.json now owns glass panes, glow, steam, attached spots and floor-aware paths.
- Render order: parallax skyline and twinkles; far snow; transparent shell; floor sprites; base-line-sorted objects/agents; glass tint/reflections; live code lights/glow; near snow and steam/dust. No furniture cut-out polygons are needed.
- Placement supports a thumbnail sprite palette, add/remove/flip/duplicate, integer scaling, base lines, layers and levels. It edits light-line vertices/styles/enabled flags, pane/reflection geometry, glow/steam, spots and paths. Two export buttons copy the complete canonical JSON files separately.
- Attached spots use local coordinates that follow sprite translation, flipping and scaling. Glow and steam can follow sprites too. Removing furniture detaches its spots at their current locations.
- Reused existing JSONL parsing, controls, state/tool/plane animation, catch-up handling, hangout choice and raw-event card. Extended the waypoint graph with floor identity: only marked steps connect level 0 to -1. Normal walking refuses an unreachable level transition; 16x/catch-up still uses the specified poofs.
- All palette/light/weather/glass/camera/timing settings live in look.js. The existing pixel_clean.py is the established cleanup available in this repository; no new cleanup-method competition was run against missing production artwork.

## Done-when checklist

| Item from section 11 | Status | Evidence / boundary |
| --- | --- | --- |
| Deterministic generator and validator | PASS | Fresh duplicate seed-1 outputs match; existing fixture passes --check. Generator unchanged. |
| Complete playback at all three speeds | PASS | All 529 events processed at each speed in browser with controlled 0.1-second ticks and periodic renders; no console errors. |
| Crisp integer scale and letterbox | PASS | Fit 2x and fit+2 4x, native 480x360 frame; device pixel ratio 1.25 also exercised. UI stays outside scene. |
| Shared cleanup and named sprite cutting | PASS | All source placeholders use 4 source pixels per art pixel; exact magenta survives cleanup, then disappears from keyed sprites. 42 trimmed assets with base lines. Focused cutter checks pass. |
| Twelve distinct agents without overlap | PASS | Approved four species, body tints and interest props retained. Zero spacing violations during all full-log runs. Furniture can intentionally hide agents. |
| Base-line depth | PASS | Behind-sofa pixel exactly matches sprite art; in-front pixel contains the creature. Floor rugs render below agents. |
| Independent furniture and palette editing | PASS | Layout owns every instance; actual UI drag, flip, palette add/remove and JSON export pass. Duplicate and whole-step scale are available. |
| Transparent panes and surroundings | PASS | Alpha checks at an interior pane and outside the building return zero; backdrop renders through both. |
| Code-drawn editable light lines | PASS | String/fairy/RGB styles use look.js color/spacing/twinkle and on/off controls; actual vertex drag updates layout. |
| Event/activity table and resting | PASS | All existing state/tool/plane/answer effects retained and rendered during full runs; resting wander/nap behavior preserved. |
| Plane destination, declined shape and timing | PASS | Targeted declined canvas flight goes to node-02, lasts 3.5 seconds for 200 ms latency and survives an early receipt. |
| Flicker, weather and RGB | PASS | Attached lamp/fire/TV glow, live snow/twinkles/steam and code RGB; native-pixel RGB comparison changes with its look setting. |
| Busy catch-up within about five seconds | PASS | No events dropped. Measured walk pending time stays below five seconds; 16x has no walk queue. |
| Agent card and follow | PASS | Actual click checks name/tool/arg/raw history, then zoomed Follow centers the agent and Escape releases it. |
| Unknown events/fields | PASS | Unknown type and added fields exercised without breaking playback. |
| Look values and placement/export | PASS | Tuning in look.js; both JSON exports contain canonical data. Attached spots move with their parent. Steps graph reaches the lower floor and cannot cross after the step link is removed. |
| README | PASS | Current run, sheet preparation, naming/base-line conventions, shared scale, two JSON exports, floor levels and checks documented. |
| Screenshots and dated note | PASS | This note plus fit, fit+2 and placement screenshots; machine-readable check results beside them. |

These are implementation checks against the requested placeholder build. The real-art visual review is pending Zach's source images. No claim that all hardware runs at 60 fps was measured.

## Evidence and running

- docs/w0-modular-v2-check.json: full replay, spacing, actual step traversal, native depth pixels, transparency, RGB, placement, card/follow and parallax.
- docs/w0-modular-v2-generator-check.json: fresh deterministic fixture generation.
- docs/w0-modular-v2-fit.png, w0-modular-v2-fit-plus-2.png and w0-modular-v2-placement.png.
- world/tools/check_sprite_pipeline.py: exact key/scale, trim/manifest and naming checks, including all 42 current assets.

`npm run build --prefix world` passes. Review server: http://127.0.0.1:5180/. Press P to edit and use the separate Copy layout JSON / Copy scene JSON buttons to save changes for the next reload. No design documents changed and nothing committed.
