# 2026-10-24 · First modular room layout

Built a reviewable first layout from the generated art, following Zach's request to assemble what exists before doing more image work.

- 13 separate transparent furniture sprite types, placed as 18 independent instances.
- A separate empty room shell, with a simplified alternate retained alongside the original.
- All selected raw image outputs and exact generation prompts saved under world/art/nyc/modular-v1/. Generated with the built-in image_gen tool; no external art packs.
- Native sprites use nearest-neighbor cleanup, the shared palette and binary alpha edges. No dithering added.
- Optional modular scene uses the existing Canvas renderer. Furniture sorts by foot line and can move independently of the architecture.
- Placement mode: Furniture layer, drag centers, resize corners, Mirror, Duplicate and complete scene JSON export. Linked live lamp regions follow moves.
- Existing W0 scene remains available at the normal URL; the art-only review URL hides creatures and log controls.

Preview: http://127.0.0.1:5180/?scene=modular&art=1

Press P, select Furniture and choose a piece. Copy scene JSON exports the layout; save it over world/art/nyc/modular-v1/scene.json.

The table lamp and snowy balcony pine are not in this first assembled pass. Architecture (floor/walls/window/balcony) is one background; furniture is separate. Fine lighting and native-pixel cleanup still need a visual polish pass after layout review. Rejected photo-style generations are not used.

Checks: npm build passes; local Playwright checks drag, mirror, duplicate, resize and export; no browser console errors. Existing W0 interaction checks also passed after adding optional furniture layers. No commits or design-doc edits.

Screenshots: w0-modular-first-layout.png and w0-modular-placement.png. Focused check output: w0-modular-check.json. Exact prompts: world/art/nyc/modular-v1/generation.json.
