# OuterNet W0 · modular pixel room

The active page uses Canvas 2D. The previous generated-art preview and 3D sources are retained, but the active scene now follows the modular magenta-sheet format. It deliberately uses plain placeholder art until Zach supplies the backdrop, shell and sheets described in `docs/room-prompt.md`.

## Run

From `C:/Outernet`:

```powershell
npm install --prefix world
npm run dev --prefix world
```

Open the address printed by Vite. The running review server is http://127.0.0.1:5180/. Playback controls are visible and the fake log loads automatically, including when an older preview URL still has query parameters. `npm run build --prefix world` writes a static build to `world/dist`.

## Active art and data

```text
art/nyc/
  backdrop.png           wide skyline at native art scale
  shell.png              architecture with transparent panes and surroundings
  sprites/*.png          independently trimmed sprites
  sprites/manifest.json  sizes, source bounds and base lines
  layout.json            sprite instances and code-drawn light polylines
  scene.json             spots, paths/steps, glass panes, glow and steam
  sources/               placeholder source sheets, key shell and naming files
  CREDITS.md
```

The frame is 480 by 360 native pixels. Its backdrop is 640 by 360 and slides a little when you pan. The shell is native-size, never stretched. Floor sprites draw first; object sprites and agents sort by foot/base line. Glass tint/reflections draw over the panes, followed by code-drawn lights, glow, near snow and steam. Snow has two depths and the backdrop has live window twinkles.

`src/look.js` holds visual tuning: palette, shared source scale, light styles, RGB color, glass, weather, grade, camera and agent timing. Architecture, sprite geometry and placement belong in art/data, rather than that tuning object.

## Prepare final images at one shared scale

Requires Node and Python with Pillow. Use the **same source pixels per art pixel** for the shell, backdrop and every sprite sheet. Current placeholders use 4. Do not independently fit each sprite to an arbitrary size.

```powershell
# Shell: clean at 4 source pixels per art pixel, then remove exact magenta.
python world/tools/sprite_cut.py docs/look-refs/chosen-shell.png --pixel-scale 4 --shell --out world/art/nyc/shell.png

# Backdrop: set its native output size to the source size divided by that same 4.
python world/tools/pixel_clean.py docs/look-refs/chosen-backdrop.png world/art/nyc/backdrop.png --pixel-size 4 --size 640 360

# Sheet: clean the WHOLE sheet at the shared scale, then cut connected regions.
python world/tools/sprite_cut.py docs/look-refs/chosen-sheet-a.png --pixel-scale 4 --names world/art/nyc/sources/a-living-names.json
```

Select the actual scale from the chosen art; 4 is the placeholder default, not a claim that every AI image has a 4-pixel grid. Set `look.art.size`, the scene dimensions and shared source scale consistently if the selected shell's native dimensions change.

The cutter preserves #FF00FF exactly through nearest-neighbor cleanup and palette quantization, with **no dithering**. It uses eight-connected foreground regions, trims each region, removes magenta and writes transparent PNGs plus a merged manifest. Background-colored holes remain transparent. Cleaned sheets are saved in `sprites/_sheets/` for inspection. Source images are not changed.

Names are a JSON array ordered by region **top edge, then left edge**. All placeholder objects are top-aligned in their sheet cells. A count mismatch stops rather than silently assigning wrong names. If a real sheet has detached parts, each disconnected part is a separate region: inspect the cleaned sheet and repair/rename the source deliberately. Names omitted from the command become `sheet-name-001`, etc. `--min-area` can explicitly discard small noise regions; the default keeps all regions.

Manifest `size`/`width`/`height` use trimmed art pixels. `baseLine` is the distance from the trimmed top to the ground edge (default: height). Optional `--baselines baselines.json` overrides it per sprite name. Rerunning a sheet replaces only that sheet's manifest entries; cross-sheet name collisions are rejected.

Record the real image tool and prompts in `art/nyc/CREDITS.md` when replacing placeholders. No generated art is needed to test this format.

## Placement and data

Wheel or + / - selects fit, fit+1 and fit+2, always at an integer scale. Drag to pan. The title and controls remain outside the scene. Click a creature for its card, expandable raw history and Follow; Esc releases follow.

Press **P** or **Place** to freeze playback and edit:

- **Sprites:** drag the center or choose an instance in the list. Flip, duplicate or remove it. Open the sprite palette, choose an image, click Add sprite, then click the room. Choose floor/object layer and an integer scale. The ground/base handle can override an instance's base line.
- **City buildings:** choose City buildings to isolate outdoor handles. Drag a visible opaque part of a tower (even if its center is offscreen), or select its instance in the list. Flip, duplicate, remove and palette-add work as for furniture; new building assets default to the City layer. That layer sorts buildings by base line behind the room, independently of indoor objects and agents. Save positions with Copy layout JSON. Only sky/river remain in the parallax backdrop.
- **Light polylines:** drag vertices or the center. Shift-click appends a vertex; Alt-click removes one. Add object/path starts a new line; click points and press Enter. Choose string/fairy/RGB and toggle Enabled. Color, spacing and twinkle come from `look.light.lines`; RGB uses `look.light.rgbColor`.
- **Spots:** drag and edit pose, facing, tags, group and floor. Attach a spot to a sprite to store a local offset. Moving, flipping or scaling the sprite moves the spot with it. Attached spots inherit the owner's level unless explicitly overridden.
- **Paths/steps:** drag vertices, edit path floor/type and each selected vertex's floor. Only a path marked `steps` may connect different floor levels. New paths are click-to-draw, Enter to finish. Normal walking cannot bypass a missing staircase link.
- **Glass/glow/steam:** drag pane polygons/reflection handles and glow regions. Glow and steam may attach to sprites, so their effects follow furniture moves.

Two copy buttons export the complete files separately: save **layout.json** over `world/art/nyc/layout.json` and **scene.json** over `world/art/nyc/scene.json`. Clipboard failure downloads the corresponding file. Edits are not written to disk automatically. Exported layout contains canonical sprite IDs/positions/scale/flip/layer/level, not calculated image widths or cached base coordinates.

Building art and exact generation prompts are in `art/nyc/sources/buildings/`; cleaned sprites are in `art/nyc/sprites/`. Reimport a building with `python world/tools/import_city.py --name tower-art-deco --source path/to/generated.png`. This preserves the original, cleans/trim-snaps the sprite and updates the manifest without rebuilding furniture or layout. Do not run the placeholder builder over selected real art.

The selected room art is now `shell-v2.png` plus 42 separate `*-v2.png` furniture/decor sprites. Generated originals, prompts and import reports are under `art/nyc/sources/room-v2/`. Reimport a sheet using `python world/tools/import_room_art.py living path/to/sheet.png` (also `kitchen`, `decor`, `terrace`); use `shell` for an architecture image. The import preserves instance centers/base lines and existing sprite IDs. Window/glow polygons and spot anchors remain editable for any art-specific adjustment. The pointed Art Deco tower is archived and absent from the active scene/palette.

Floor level 0 is the main room/terrace; -1 is the sunken living area. Coordinates already describe the illustrated floor height, so no extra vertical offset is added to sprites. Navigation uses a floor-aware waypoint graph; level changes go through the explicitly authored steps. Fast catch-up/16x still uses visible poofs, as required by playback.

## Fake log and playback

```powershell
python world/tools/fake_log.py --seed 1 --minutes 10 | Set-Content -Encoding utf8 world/fixtures/fake-run.jsonl
python world/tools/fake_log.py --check world/fixtures/fake-run.jsonl
Copy-Item world/fixtures/fake-run.jsonl world/public/fixtures/fake-run.jsonl
```

Vite serves the fixture copy under public. Open log and file drop also work. Play/pause and 1x/4x/16x are unchanged; the view starts three simulated seconds behind. The JSONL parser, event contract, state/tool/plane effects, catch-up rules, hangout choice and agent card are reused. Resting agents wander; helping and serving stay put. Unknown event types and extra fields are ignored.

## Rebuild placeholders and focused checks

```powershell
# Rebuilds art AND the initial layout/scene: keep edited JSON before running.
python world/tools/build_modular_placeholder.py
python world/tools/check_sprite_pipeline.py
node world/tools/check_layers_v2.mjs
npm run build --prefix world
```

The browser check uses local Playwright with installed Edge and a server at port 5180 (override with WORLD_URL). It advances a complete log with controlled clock ticks at all three speeds, checks spacing and steps, tests exact depth pixels, palette placement, attached spots, light polylines, exports, card/follow, RGB and parallax. Screenshots at fit/fit+2 and detailed results go in docs/. Earlier checks for retired scene formats are kept as history; use these current checks for this build.
