# NYC render checkpoint — 2026-10-24

Scope: step 1 only, awaiting visual review before camera/depth, RGB masks or frontend work. Read the revised spec and inspected snowy-pixel-street and prior-render references.

Added build_nyc.py and NYC look_render.py. Preserved look_flat.py and adjusted build_flat.py's import so the older scene remains reproducible. CPU Cycles, denoising, 960×1080. No dither/noise is added by postprocessing. Four-level luminance shaping, depth/normal edge darkening in the source color, then nearest mapping to the 48 configured palette entries. This is an initial banding approximation; per-material ramps may need refinement after review.

Procedural scene: modern open penthouse, sectional/chaise, game table, beanbags, island/stools, two monitors, plants, snowy terrace/firepit/string lights; tall tower, varied neighboring towers, water tanks and stepped skyline crowns, street/crosswalk/shops/cabs. RGB strips are unlit in beauty. Mask rendering, street life, creatures and integration are intentionally deferred to steps 2–3.

Outputs: art/nyc/beauty.png, whole-image beauty-x4.png, intimate penthouse-x4.png, raw.png, depth.exr, normal.exr, camera.json, lights.json, render-check.json. Camera and lights are Blender Z-up. Raw Cycles depth still requires matching/conversion in step 2.

Final W0 checklist is not applicable yet: playback, hangout behaviors, all zooms, occlusion, RGB recoloring and integrated-GPU performance await integration. No design-doc edits or commits.

Verification: Cycles finished in about 44 seconds; reprocessing exited cleanly. render-check.json reports 960×1080, 48 configured palette entries and 45 used colors, four luminance bands, dithering false. Visual inspection caught residual sampling speckle; a configurable median cleanup before/after quantization removes isolated noise. Reprocessed previews were inspected. Remaining broad mottling on distant fog can be refined after composition feedback. Settings are preserved in look_render.py; reprocess_nyc.py can update palette/cleanup from the saved raw render without rerunning Cycles.
