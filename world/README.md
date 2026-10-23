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
