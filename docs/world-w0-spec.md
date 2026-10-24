# World W0 build spec (for Codex)

This is the handoff for the first build of the world frontend. `docs/design.md` ("The world" section) is the vision. This file is what to build now. If the two disagree, this file wins for W0. Ask Zach if something here is unclear rather than guessing.

## Goal
A browser page showing **a college student's dream penthouse in Midtown New York on a snowy night, as cozy pixel art**, with **12 agents** going about their day, replaying an event log. Pretty first: it should feel like a VRChat hangout world or a lofi YouTube background you leave open on a second monitor, an escape while you work. Starting with one room keeps W0 small; more spaces come later. People only watch; nothing in the world is clickable except agents (to inspect them) and the camera.

## Out of scope for W0
The apartment and any other space, choosing a home space, time-of-day and weather settings (W0 is fixed at a snowy evening, but keep them as look values), sound and music, debug overlays, timeline scrubber, live streaming from the simulator, chat overlay, connect screen, reputation lanterns, user avatars. Don't build hooks for these beyond keeping the code tidy.

## Where it lives
```
world/
  index.html, src/...        the page (three.js; build tooling is your pick, keep it simple)
  blender/                   build_nyc.py, look_render.py, the .blend it saves
  art/nyc/                   beauty.png, depth, rgb mask, camera.json, lights.json, scene.json
  art/agents/                style-test.svg (the approved creature designs)
  art/CREDITS.md
  fixtures/fake-run.jsonl    generated fake log (see below)
  tools/fake_log.py          the fake-log generator
  README.md                  how to run it
```

## 1. Event contract
The page reads JSONL, one event per line, sorted by `t`. Every line has:
```json
{"t": 12.43, "run": "fake-001", "node": "node-04", "model": "qwen3.5-9b", "event": "...", "detail": {...}}
```
`t` is seconds since the run started (sim time). Other fields from design.md's event log (`bytes`, `sim_latency_ms`, etc.) may be present; ignore what you don't need. Unknown event types and unknown fields must be ignored, not crash the page.

| `event` | `detail` | Notes |
|---|---|---|
| `roster` | `{"nodes": [{"node", "name", "model", "engine": "diffusion" or "ar", "interest", "space", "library_pages"}]}` | First line of every run. `node` at top level is `"sim"`. |
| `state` | `{"state": "studying" or "playing" or "helping" or "serving_owner" or "resting", "partner": "node-07"}` | `partner` only when `playing`. |
| `tool_call` | `{"tool": "search" or "open_page" or "save_note" or "load_skill" or "ask_peer" or "answer", "arg": "short text"}` | `arg` is a short preview (max ~60 chars), for the card. |
| `message_sent` | `{"msg_id": "q17-3", "kind": "request" or "reply", "to": "node-09", "mode": "forward" or "text_help" or "canvas", "declined": false}` | `declined` only on replies; true when the reply's answer is null. Top-level `sim_latency_ms` gives the delay. |
| `message_received` | `{"msg_id": "q17-3", "kind": "request" or "reply", "from": "node-04", "mode": "..."}` | Marks the plane landing. |
| `answer` | `{"question_id": "q17", "correct": true}` | `correct` is optional (missing = not scored). |

The M0 simulator must write this same format (the event log section of design.md points here).

## 2. Fake-log generator
M0 hasn't run yet, and an M0 run will mostly show helping (libraries are frozen, no play until M3). So W0 is built and checked against a generated log.
- `python world/tools/fake_log.py --seed 1 --minutes 10 > world/fixtures/fake-run.jsonl`. Same seed gives the same file.
- The run id always starts with `fake-` so it can never be mistaken for real results.
- Uses the real roster below (12 agents, 4 models, 12 interests), all in space `nyc`.
- Produces believable days: every state appears, each agent changes state every 30-120 s, tool calls inside states (`search`/`open_page`/`save_note` while studying, `ask_peer` while helping, and so on), request/reply message pairs with `sim_latency_ms` 50-200, some declined replies, some playing pairs, answers with `correct` true and false.
- Include a busy stretch (several events per second) to test the catch-up rule, and a quiet stretch.
- Must follow the contract exactly; add a `--check FILE` mode that validates any JSONL against the contract and prints problems. Use it on real M0 logs later.

## 3. Roster (W0)
Interests are assigned across models with three unrelated interests per model. Names are placeholders; Zach may rename them.

| node | name | model | engine | species | interest | prop |
|---|---|---|---|---|---|---|
| node-01 | Pip | llada2.2-mini | diffusion | axolotl | beekeeping | beekeeper veil hat |
| node-02 | Lumo | llada2.2-mini | diffusion | axolotl | jazz | tiny saxophone |
| node-03 | Fen | llada2.2-mini | diffusion | axolotl | deep-sea creatures | brass diving helmet |
| node-04 | Wisp | dream-v0-instruct-7b | diffusion | moth | volcanoes | rock hammer |
| node-05 | Dusk | dream-v0-instruct-7b | diffusion | moth | mushrooms | mushroom basket |
| node-06 | Sable | dream-v0-instruct-7b | diffusion | moth | Japanese woodblock prints | carving knife and print scroll |
| node-07 | Rook | qwen3.5-9b | ar | raccoon | chess openings | knight piece |
| node-08 | Tamsin | qwen3.5-9b | ar | raccoon | Formula 1 | racing helmet |
| node-09 | Odo | qwen3.5-9b | ar | raccoon | the Apollo program | tiny rocket |
| node-10 | Bram | gemma-4-e4b | ar | beaver | Byzantine history | mosaic tile crown |
| node-11 | Curd | gemma-4-e4b | ar | beaver | cheese making | cheese wheel |
| node-12 | Meeple | gemma-4-e4b | ar | beaver | board game design | big die |

Species comes from `model` (unknown diffusion model = jellyfish, unknown AR model = red panda, per design.md). The three agents sharing a species also get a small color tint each so they can be told apart.

## 4. The New York penthouse (pre-rendered in Blender, clean pixel art)
**Mood:** a college student's dream apartment: modern, minimal, RGB, snow, cozy. A hangout like a VRChat world, not a classroom. Art style target: `docs/look-refs/ref-snowy-pixel-street.webp` (clean pixel art, flat color bands, warm windows against blue snow, no speckle). Lighting and cutaway: the other refs in `docs/look-refs/`.

**How it's made:** the scene is built and rendered **once in Blender** (4.2 LTS or newer) by `world/blender/build_nyc.py`, run headless (`blender -b -P build_nyc.py`), reusing what worked in the Eastern Bloc build (camera, depth, outputs). The page shows the render and draws the creatures live in three.js on top, on the same pixel grid.

**Pixel look rules (the main fix from the last render):**
- **No dithering anywhere.** The speckle is what made the last render look "too pixelated".
- Shade in **3-4 flat bands** per surface (toon ramps or posterize per material, before or after the render), so light pools read as clean steps.
- A limited palette (about 48 colors, in `look_render.py`).
- **Soft dark edges:** an edge pass (depth and normal changes) darkens edge pixels to a darker shade of the object's own color, never black.
- Pixel size like the reference: shapes clearly pixel art, but window frames, lights and small furniture still read.

**Canvas and zoom:** the render is one tall image, in art pixels, of about 960x1080 (width x height; set in `look_render.py`). Top: the penthouse and terrace, cut open, with towers around and behind. Bottom: the tower dropping down to a snowy street. The page shows it at whole-number zooms only: x4 (default, the penthouse fills the screen, intimate), x3, x2 (more skyline and the street below), x1 (the whole scene). Creatures render at the same art-pixel size and scale with it.

**The building and city:**
- The penthouse is the top floor of a sleek Midtown tower, cut open (the two walls nearest the camera removed), with a **snowy terrace** wrapping one side: snow piled on the railing and floor, string lights, a fire pit.
- Towers all around at different heights: lit windows (a random mix of warm, cool and dark), water towers, antennas with red blinking lights, and shapes that **hint** at the Empire State and Chrysler buildings (no exact copies). Snow on every ledge and roof. Fog thickens with distance.
- The street far below: snowy sidewalks, streetlights, steam vents, a crosswalk, a few storefront lights.

**Inside** (one open floor, modern and minimal):
- dark floors, pale walls, big floor-to-ceiling windows;
- RGB LED strips (under the TV wall, along the ceiling edge, behind the desk): rendered as a separate grayscale mask (`rgb.png`) so the page can tint them with the owner's chosen color (default purple) and make them glow, without re-rendering;
- a big sectional facing a wall TV with a console, beanbags, floor cushions by the window, a low coffee table with board games, a kitchen island with stools, a desk with two monitors, plants, a few warm lamps, a small bookshelf.
- No beds and no per-agent spots: agents nap on the sectional, beanbags or cushions.

**Light:** warm lamps, the RGB glow (from the mask), the TV's flicker, cool blue night and city glow through the windows, the warm fire pit and string lights on the terrace, orange streetlights below. Soft shadows, dark corners, then banded by the pixel rules.

**Outputs** (to `world/art/nyc/`): `beauty.png` (no creatures, RGB strips unlit), `rgb.png` (LED mask), `depth.png` (16-bit) or `depth.exr`, `windows.png` (mask of lit city windows, so a few can switch over time), `camera.json`, `lights.json`, plus `street.json` (the street's lanes, sidewalks and steam vent positions in 3D).

**Scene file:** `world/art/nyc/scene.json` holds **hangout spots** in 3D floor coordinates. Each spot has a pose (`sit`, `lie`, `stand`, `floor`), a facing, and tags for what it affords: `comfy` (studying, napping), `game` (couch gaming, board games, fire pit; grouped so partners sit together), `window`, `snack` (kitchen), `terrace`. Plus walk paths, including out to the terrace. Agents take the nearest free spot that fits their activity, so they never overlap. Placement mode (a key toggles it) draws spots and paths over the render, lets you drag them, and copies the JSON.

## 5. Agents and animation
Implement the event → animation table in design.md ("The world" → Event → animation). Agents act like people: **the activity shows in what an agent holds and does, not at a fixed station.**
- **Studying:** walks to a free `comfy` spot and reads a book (pages turn on `open_page`).
- **Playing:** both partners walk to a `game` spot group and play together (controllers at the TV, pieces on the coffee table, or warming hands at the fire pit).
- **Helping:** stays where it is and opens a little laptop. Planes fly to and from it wherever it is.
- **Serving owner:** puts on headphones where it is.
- **Resting:** hangs out freely: picks a random `comfy`, `window`, `snack` or `terrace` spot every 20-60 s, naps sometimes ("z"s), looks out the window, eats a snack. Cosmetic only; the agent card always shows the true state.
- **Tool calls:** `search` = squints at the laptop or a magazine; `save_note` = scribbles a sticky note and sticks it nearby (it fades after a minute); `load_skill` = pulls a little book from its bag.
- **Creatures are 3D blocks built in three.js**, following `world/art/agents/style-test.svg` exactly: one grid square = one cube unit. Notched block body, two square eyes, two wide feet, species parts (axolotl gill stubs and tail, moth square wings and antennae and no feet, raccoon ears, mask band and ringed tail, beaver ears, one tooth and paddle tail). Don't copy the Claude Code crab: no tall bar eyes, no four thin legs.
- **Same pixel look as the room:** rendered at art-pixel resolution with the same banded shading, palette and soft dark edges, lit to match `lights.json`, with a small contact shadow. Depth from the render hides them behind furniture.
- **Size:** about knee-high to the sectional's seat; at x4 zoom roughly 12-16 art pixels tall. Eyes at least 1 art pixel, species features at least 2.
- **Life:** bob, blink, a small hop while walking, sit, lie and floor poses, turning toward a nearby plane. Moths flap and hover. Per-agent tint: a small shift of body color within the same hue.
- **Thinking look:** diffusion species pulse softly during a tool call; AR species do a step-by-step tapping motion.
- **Props:** the 12 interest props (section 3) as tiny block models; books, laptops, controllers, snacks and headphones as shared props.
- **Paper planes:** tiny folded block planes, one per `message_sent`, flying from sender to receiver along a gentle arc. Flight time at 1x = clamp(1.5 s + `sim_latency_ms` / 100 s, 1.5 s, 4 s). Letter for `forward`, a small bundle for `text_help`, a sheet with blanks for `canvas`. A declined reply flies back empty and flutters down. If `message_received` comes before the plane lands, the plane just keeps flying.
- **Answer:** a small chime sparkle above the asker.
- **Walking:** along the paths in scene.json; across the apartment takes 2-3 s at 1x.

**City life (live, on top of the render):**
- Falling snow as pixel flakes at two depths (none when the weather is clear).
- On the street: yellow cabs and cars with headlights driving the lanes, tiny people walking the sidewalks, steam puffing from vents, traffic lights changing. Busy in the evening, thinning out late at night (by the clock or fixed time), never perfectly regular.
- A few city windows switch on and off slowly (from `windows.png`); antenna lights blink.
- The TV flickers; the fire pit and string lights flicker gently.

## 6. Playback
- Load a JSONL file by drag-and-drop or a file picker. Show the file's `run` id in a corner (so `fake-` runs are obvious).
- Play / pause, speed 1x / 4x / 16x.
- The view runs 3 s (sim time) behind the newest event it has read, so walks can start before the next event.
- Catch-up rule: if an agent has more queued animation than 5 s behind, its walks become a soft "poof" teleport and tool animations shorten. Never drop an event's visible effect entirely, and never show anything not in the log.
- At 16x, all walks are poofs.

## 7. View and agent card
- The camera is fixed to the render's angle. Zoom is whole-number steps only (x4 default, x3, x2, x1) via the scroll wheel; you can pan within the image. Background and three.js layer always move together and stay pixel-aligned. No rotation.
- The title and controls sit over empty sky or in the letterbox, never over the apartment.
- Click an agent: a small card with name, species, model, interest, current state, current tool and `arg`, library pages, and the last 5 events as raw JSON (expandable). A "follow" button keeps the view on that agent; Esc stops following.
- Agents get a name label on hover.

## 8. Art
- **Scene:** made by the Blender script (section 4). Target art style: `docs/look-refs/ref-snowy-pixel-street.webp`; lighting and cutaway: the other refs in `docs/look-refs/`.
- **Creatures:** locked design in `world/art/agents/style-test.svg` (approved 2026-10-24), built as 3D blocks (section 5).
- CC0 models only; record every model, texture and HDRI with its source and license in `world/art/CREDITS.md`.

## 9. Look settings (for the polish pass)
Two places hold every look value, each a plain, commented object, with nothing hard-coded elsewhere:
- **`world/blender/look_render.py`**: every light's position, color and strength; sky, fog and snow cover; window-lit fraction and colors; material colors; bevel size; camera angle and ortho scale; render samples; canvas size; shading band count; palette; edge darkness and width; color grade.
- **`world/src/look.js`**: RGB color (default purple) and glow strength; creature colors and tints; light matching; contact shadow; bob, hop and blink timing; resting wander timing; plane timing constants; snow amount per weather; traffic and pedestrian density by hour; window switching and antenna blink; TV and fire flicker; default zoom.

Changing `look_render.py` and re-running the script re-renders the scene; changing `look.js` updates the page on reload.

## 10. Performance
- The page draws one background image plus 12 tiny block creatures, a few dozen cars, people and snowflakes at art-pixel resolution: 60 fps on integrated graphics should be easy.
- Rendering in Blender is a one-off; it can take minutes. Don't run it while M0 models are using the GPUs.

## 11. Done when
- [ ] `fake_log.py` writes a deterministic log that passes its own `--check`.
- [ ] The page loads `fake-run.jsonl` and plays it start to finish at 1x, 4x and 16x without errors in the console.
- [ ] All 12 agents are visible, each species and each agent within a species is tellable apart, and no agent ever overlaps another agent or sits inside furniture.
- [ ] Every row of the event → animation table has been seen on screen during the fake run.
- [ ] Planes go to the right agent, declined replies look different, and timing follows the formula.
- [ ] During the busy stretch the view stays within ~5 s of the log.
- [ ] Clicking an agent shows the card with correct current state and raw events; follow mode works.
- [ ] A line with an unknown event type or extra fields is ignored without breaking playback.
- [ ] Every look value is in the look-settings file, and changing one there changes the scene.
- [ ] Re-running the Blender script re-renders the room and the page picks it up with no code change; placement mode can fix scene.json.
- [ ] Creatures are correctly hidden behind furniture in front of them (depth works), and they look lit like the room and share its pixel grid.
- [ ] No dithering anywhere; shading is in clean bands with soft dark edges.
- [ ] Every zoom step (x1-x4) stays pixel-crisp; zoomed out, the street is alive with cars, people and steam.
- [ ] Changing the RGB color in look.js recolors the LED strips without re-rendering.
- [ ] Resting agents wander between hangout spots naturally, and studying, playing and helping read clearly from what agents hold.
- [ ] `art/CREDITS.md` lists every image; `world/README.md` says how to generate the fake log and open the page.
- [ ] Runs at a steady frame rate on integrated graphics.
- [ ] A short screen recording or a few screenshots go in `docs/` with a dated progress note.
