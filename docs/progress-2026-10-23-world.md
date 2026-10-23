# World W0 progress — 2026-10-23

Built the first runnable cabin prototype in world/. No design documents changed and no commit made.

Verification: deterministic generator/checker succeeds; Vite production build succeeds. Local Playwright uses installed Edge. A complete 16x run consumed 529/529 events with no page errors. Screenshots: world-w0-cabin.png and world-w0-evening.png. Integrated GPU performance has not been measured.

## Spec checklist
- PASS: generator is seeded and its output passes --check (validator covers required fields and enums, but could be stricter about scalar types).
- PARTIAL: 16x full playback passed; full-duration 1x and 4x were not run.
- PARTIAL: 12 creatures render, species/tints differ; crowd overlaps and bunks can obscure some at default angle.
- PARTIAL: all event types handled; several tool actions use floating symbols instead of the specified physical animation. Moth hovering, paired seating, page turning and home-lamp state still need work.
- PARTIAL: message endpoints and duration formula implemented; declined replies have a distinct flutter, but letters/bundles/canvas currently use sprites.
- PASS by implementation: events dispatch without a queue; interrupted walks poof, and 16x always poofs. This bounds backlog but does not implement a measured five-second threshold.
- PARTIAL: card, history, picking and follow implemented; not fully exercised by automated UI interactions.
- PASS by inspection: unknown event types and extra fields do not break dispatch; not separately exercised in browser.
- PARTIAL: main palette, camera, lighting, motion and weather controls are in look.js; geometry and CSS literals remain in main.js. A polish pass cannot yet rely exclusively on look.js.
- PASS: credits and run instructions present. No third-party art was imported; original primitive artwork is CC0. Asset-pack exploration was not completed.
- UNVERIFIED: steady 60 fps on integrated graphics.
- PASS: screenshots and this note saved.

## Choices
Animations use real seconds at all playback speeds; log dispatch uses simulation seconds. Initial delay is three simulation seconds. A new state interrupts an unfinished walk with a poof. Ambient weather continues while playback is paused. These choices can be changed locally.

## Remaining work
This is a runnable first pass, not full spec completion. Finish physical tool animations, stable crowd slots and paired seating; centralize remaining look literals; improve validator edge cases and deliberately silent fixture interval; verify all playback speeds, interaction behavior and integrated-GPU performance. The fixture currently has playing partners that need not be simultaneously playing. Update both fixtures/fake-run.jsonl and public/fixtures/fake-run.jsonl after regeneration.
