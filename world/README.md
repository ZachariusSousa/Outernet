# OuterNet W0 Â· pixel room

A native 480 Ã— 360 Canvas 2D room, with live pixel sprites and JSONL playback. The page no longer imports three.js. The retired 3D implementation remains in Git history and its source folders.

## Run

From `C:/Outernet`:

```powershell
npm install --prefix world
npm run dev --prefix world
```

Open the local address printed by Vite. The current review server is http://127.0.0.1:5180. `npm run build --prefix world` makes a static build in `world/dist`.

## Fake log

The generator and validator are unchanged. Same seed gives the same log.

```powershell
python world/tools/fake_log.py --seed 1 --minutes 10 | Set-Content -Encoding utf8 world/fixtures/fake-run.jsonl
python world/tools/fake_log.py --check world/fixtures/fake-run.jsonl
Copy-Item world/fixtures/fake-run.jsonl world/public/fixtures/fake-run.jsonl
```

Vite serves the copy under `public`. You can also open any JSONL through **Open log**, or drop it on the page. The run ID stays visible. Controls: pause/play and 1Ã— / 4Ã— / 16Ã—. The initial clock is three simulated seconds behind. Walks last 2.5 real seconds at 1Ã—; a blocked walk resolves by a visible poof within five real seconds, and 16Ã— always uses poofs. Tool effects shorten when animation demand passes five seconds. Message receipts never remove an in-flight plane.

## Clean Zach's room image

Requires Python with Pillow (`python -m pip install Pillow`). Native size and palette come from `src/look.js`:

```powershell
python world/tools/pixel_clean.py path/to/generated-image.png world/art/nyc/room.png
# Optional overrides for inconsistent AI grids or a different native canvas:
python world/tools/pixel_clean.py input.png output.png --pixel-size 4 --size 480 360
```

The cleaner reports the detected integer source pixel size and confidence. It only trusts a repeated edge phase on both axes. Inconsistent or already native art defaults to 1; it cannot infer an artist's intended grid perfectly. It recovers that grid, uses nearest-neighbor resizing, preserves aspect ratio with letterboxing, and snaps to the configured palette with **no dithering**. The reference test is `docs/pixel-clean-test.png` (44 palette colors).

Replace only `art/nyc/room.png`, then edit the scene to fit it. Record Zach's image tool and prompt in `art/nyc/CREDITS.md`. No final AI room has been supplied yet: the current room is explicitly a schematic placeholder.

## View and placement

Wheel or + / âˆ’: fit, fit+1, fit+2. Each step adds one integer scale factor; the scene never stretches. Drag to pan when zoomed. A smaller-than-native window stays at 1Ã— and can pan. Title and controls have separate space. Click a creature for its state, tool preview, library pages and expandable last five raw events. **Follow** centers it at a zoomed scale; Esc releases it.

**P** or **Place** pauses the scene for editing. Pick a layer and an object in the editor:

- Drag spot centers; edit pose, facing, comma-separated tags and game group.
- Drag path waypoints. Add object creates a new path; click waypoints, then Enter.
- Drag polygon vertices or the center to move an entire region. Orange foot-line handles set occluder depth independently.
- Shift-click appends a polygon vertex; Alt-click removes one. Add object draws a polygon; Enter finishes and Esc cancels.
- Lights have editable color and flicker multiplier. RGB tint and overall strengths live in `look.js`.
- Window rectangles have move and resize handles. Select a window, then Add twinkle. Snow clips to the window polygon.
- Add object also creates spots and steam sources. Delete selected removes an object.

**Copy scene JSON** copies all edits, or downloads `scene.json` if clipboard access is unavailable. Save it over `world/art/nyc/scene.json`; edits are not written to disk automatically.

Spots, walk paths and occluders use native image pixels. Spots reserve their destination; collision checks also protect moving agents. Studying chooses a nearby free comfy spot; playing prefers its partner's game group; helping and serving stay put. Resting wanders every 20â€“60 real seconds and may nap or snack without changing the card's true state.

The room is drawn once. Agents and clipped cut-outs of that same image are then sorted by foot y, so furniture can hide an agent behind it. Window snow, city twinkles, RGB, lamp flicker, mug steam and dust are live layers.

## Art and tuning

`src/look.js` contains palette, lighting, grade, weather, camera and sprite timings. Approved creature rectangles are rasterized directly from `art/agents/style-test.svg`, with 8 SVG units = 2 native pixels. Body-only tint variants, blink, feet-hidden seated frames and moth wing frames are prebuilt; flips, 1-pixel bob, walking hop and lying poses happen on the native canvas. Interest props reuse the project SVGs; activity items and effects are tiny procedural sprites.

`python world/tools/build_pixel_assets.py` rebuilds the **placeholder** room, scene and sprite frames. Do not run it over a real room or a hand-edited scene without keeping those files first. Source artwork and retired render evidence are preserved.

## Focused checks

With the dev server on port 5180 (or adjust the URL in the scripts):

```powershell
node world/tools/verify_canvas.mjs
node world/tools/check_canvas_interactions.mjs
node world/tools/check_pixel_hangouts.mjs
npm run build --prefix world
```

Checks use local Playwright with installed Edge. The first fast-forwards the complete log using controlled 0.1-second clock ticks at all three speeds, checks overlaps, renders the scene during playback and saves fit / fit+2 / placement screenshots. The second checks exact occlusion pixels, RGB tint, actual card clicks, follow, placement export and viewport resizing. These checks avoid waiting thirty minutes of wall time. Results and the dated checklist are in `docs/`.


## Modular art layout preview

Open `http://127.0.0.1:5180/?scene=modular&art=1` for the first assembled generated-art layout. The architecture is one image, and furniture is independent transparent PNGs. Press **P**, choose **Furniture**, then drag a center, resize a corner, or use **Mirror** / **Duplicate**. **Copy scene JSON** exports all placements; save to `world/art/nyc/modular-v1/scene.json`.

There are currently 13 sprite types and 18 placed instances. The table lamp and balcony pine are pending. Raw art and exact image_gen prompts are retained in the pack's `raw/` and `generation.json`. `python world/tools/prepare_modular_room.py` rebuilds cleaned sprites and the initial layout (keep edited scene.json before running it). The cleaner now preserves transparency; `--trim --alpha-cutoff 128` produces crisp cut-out furniture edges.
