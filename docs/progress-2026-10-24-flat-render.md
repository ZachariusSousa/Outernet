# Blender render checkpoint — 2026-10-24

Step 1 only. Built world/blender/build_flat.py and look_render.py. Portable Blender 4.2 is in world/.tools (ignored). Cycles uses CPU, 48 samples and denoising, at 480×270. Postprocessing maps to the configured 32 colors with low-contrast-region ordered dithering. beauty-x4.png repeats each source pixel 4× in each dimension.

Exports: beauty.png, beauty-x4.png, raw.png, depth.exr, camera.json and lights.json under world/art/flat. Saved source scene: world/blender/flat.blend. Camera and lights use Blender Z-up; coordinate conversion is recorded in camera.json. Depth is raw Cycles Z distance in EXR, not normalized hardware depth; step 2 must convert and verify it against a test cube.

Scene includes concrete panel floors beneath the cutaway, snow ledges, neighboring blocks, tram, rails, kiosk, bus stop, sofa/wall rug, CRT, tea table/stools, fridge/stove, radiators, PC desk, floor lamp and twelve simplified sleeping pads. Remaining art refinements: proper bedroom/hallway division, wall unit, balconies, laundry, birches, calendar, and more readable snowfall. Lighting/framing are awaiting Zach's review before integration.

No frontend changes, design-doc edits or commits. W0's final checklist is deferred: this is the requested render-only approval checkpoint, before camera/depth matching or live creatures.

Run from repository root:
world/.tools/blender-4.2.0-windows-x64/blender.exe -b -t 8 -P world/blender/build_flat.py
