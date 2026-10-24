# OuterNet illustrated W0

From world/: `npm install`, then `npm run dev`. Open the printed URL. `npm run build` packages the page and art into dist/.

From the repository root:

    python world/tools/fake_log.py --seed 1 --minutes 10 > world/fixtures/fake-run.jsonl
    python world/tools/fake_log.py --check world/fixtures/fake-run.jsonl

Copy the regenerated log into world/public/fixtures/ for production. The event contract and generator are unchanged. Open log or drag a JSONL onto the page. Play/pause and 1x/4x/16x retain the original behavior. Click a puppet for the existing agent card; Follow gently zooms toward it, Esc stops following.

## Placement mode
Press P. Playback freezes while editing. Drag colored spot circles, path waypoint circles, furniture foot-line handles or decor handles. Copy scene JSON exports the current configuration (downloads if clipboard is unavailable). Save that JSON over art/cabin/scene.json and reload. Pink foot lines change sorting only, not the artwork position. Each furniture entry also has x/y offsets editable in JSON. Escape stops follow; P exits placement.

## Replaceable art contract
- cabin/sky.png, room.png, front.png, light.png, night.png: transparent RGBA 3840×2160. Furniture is a sixth logical layer, with individual full-size transparent PNGs under furniture/.
- scene.json: image dimensions, layer filenames, furniture offsets and footY, spot positions/facing/poses, directed path waypoints, decor sticker placements, light-region rectangles and window bounds.
- agents/<species>/*.png: 512×512 transparent parts. <species>.json defines part drawing order, pivot and position in that shared canvas, foot origin, and head/hand anchors. A different part layout can be supplied through JSON.
- props/*.png and decor/*.png: 128×128. planes/*.png: 192×128.
- Swap files under the same names and reload. No renderer edits required. Art is plainly labeled placeholder, not final illustration.

To regenerate original placeholders from the repository root: `node world/tools/placeholder_art.mjs` (overwrites art and placements; do not run after adding final art).

Canvas 2D draws sky, room, foot-sorted furniture/puppets, front, additive light regions, then multiply night. Settings live in src/look.js; positional art metadata lives in scene.json and puppet JSON.

## Locked block SVG art (2026-10-24)
The active cabin layers/furniture are now 1920×1080 SVGs. Four roster species use SVG parts split directly from style-test.svg, in 144×112 canvases. Props are 64×64, planes 80×64, decor 32×32. scene.json references the active files. The older PNG files are inactive for the roster but retained for fallback species. Do not run placeholder_art.mjs over this art. Press P to adjust scene placements and copy the JSON.

See docs/progress-2026-10-24-block-art.md for checklist limitations.

## Blender flat render checkpoint
From repository root run `world/.tools/blender-4.2.0-windows-x64/blender.exe -b -t 8 -P world/blender/build_flat.py` (or use any installed Blender 4.2+). It uses CPU Cycles. Tune blender/look_render.py. Output is art/flat/beauty.png plus 4× preview, raw render, depth.exr, camera.json and lights.json. The saved source is blender/flat.blend. The current page still uses the earlier renderer until the render is approved and camera/depth matching is implemented.

## New York render checkpoint
Run `world/.tools/blender-4.2.0-windows-x64/blender.exe -b -t 8 -P world/blender/build_nyc.py` from the repository root with Blender 4.2+. Settings are in blender/look_render.py. The previous flat build uses preserved look_flat.py. NYC outputs go to art/nyc/: beauty.png (960×1080), beauty-x4.png (whole tall image enlarged), penthouse-x4.png (intimate crop), raw.png, depth.exr, normal.exr, camera.json and lights.json. No dithering is applied. This is the scene-review checkpoint; RGB/window masks and frontend matching follow approval.

## Active HD-2D scene review
`cd world; npm install; npm run dev` opens the live penthouse and terrace. Scroll zooms; drag gives a limited orbit that springs back. This is step 1 only; the page does not currently replay logs. Existing playback/card code is saved in src/legacy-playback.js for reintegration in step 3.

Edit src/scene/nyc/layout.json to move/rotate objects; each type has a module. All tunable scene settings, model parts and the texture palette live in src/look.js. Textures are original procedural CC0 stand-ins. `python world/tools/standin_textures.py` regenerates them from repository root (requires Pillow). `python world/tools/pixel_clean.py input.png output.png --size 64 64` resizes and snaps an image to look.js's palette, without dithering; Node and Pillow are required. Prompts for special artwork are in docs/texture-wishlist.md. `npm run build` packages art and the page.

## City review (step 2)
Scene now includes surrounding towers, a stepped main tower, river lights and snowy street. Cars, pedestrians, steam, traffic signals, antenna and window brightness animate live. Scroll pulls back toward the street. Texture prompts are prioritized in docs/texture-wishlist.md. Detailed verification/limitations: docs/progress-2026-10-24-hd2d-city.md. Agent/playback integration remains step 3.
