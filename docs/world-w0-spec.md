# World W0 build spec (for Codex)

This is the handoff for the first build of the world frontend. `docs/design.md` ("The world" section) is the vision. This file is what to build now. If the two disagree, this file wins for W0. Ask Zach if something here is unclear rather than guessing.

## Goal
A browser page showing **one cozy flat in a snowy Eastern Bloc panel block, at night, early 2000s**, with **12 agents** going about their day, replaying an event log. Pretty first: it should feel cozy and calm, like a VRChat chill world or a lofi YouTube background you leave open on a second monitor. Starting with one room keeps W0 small; more spaces come later. People only watch; nothing in the world is clickable except agents (to inspect them) and the camera.

## Out of scope for W0
The apartment and any other space, choosing a home space, time-of-day setting (W0 is fixed at winter evening), sound and music, debug overlays, timeline scrubber, live streaming from the simulator, chat overlay, connect screen, reputation lanterns, user avatars. Don't build hooks for these beyond keeping the code tidy.

## Where it lives
```
world/
  index.html, src/...        the page (three.js; build tooling is your pick, keep it simple)
  blender/                   build_flat.py, look_render.py, the .blend it saves
  art/flat/                  beauty.png, depth, camera.json, lights.json, scene.json
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
- Uses the real roster below (12 agents, 4 models, 12 interests), all in space `flat`.
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

## 4. The flat (pre-rendered in Blender, pixel look)
**Mood:** Eastern Bloc, snowy, early 2000s. Simple, cozy, nostalgic, a little melancholy. Think pixel art of Soviet panel blocks (panelki) on a winter night: rows of warm yellow windows, orange sodium streetlights, heavy snow, an old tram. `docs/look-refs/` shows the *lighting and cutaway* we want (soft bounce light, warm lamp pools, dark corners); the *setting and pixel look* come from this section.

**How it's made:** the scene is built and rendered **once in Blender** (free; install 4.2 LTS or newer) by a Python script, `world/blender/build_flat.py`, run headless (`blender -b -P build_flat.py`). It renders at **low resolution** (480x270 by default, set in `look_render.py`), and the page scales it up by a whole number with crisp pixels. Blender gives real soft lighting; the low resolution and a small palette give the pixel-art look. The page draws the creatures live in three.js on top with a matching camera, rendered at the same low resolution and scaled up the same way, so everything shares one pixel grid. Re-running the script re-renders everything.

**The scene:** a flat on the 5th floor of a 9-storey concrete panel block, at night in heavy snow, seen isometrically.
- **Building:** the flat is cut open (the walls nearest the camera removed), with a slice of the block around it: the panel facade with its seams, neighboring flats' windows (some lit warm, some dark, one with a blue TV flicker), small balconies with junk and laundry, snow on the ledges. The block continues a few floors down into darkness.
- **Background:** more panel blocks at different distances with scattered lit windows, an orange streetlight or two, a bus stop and a kiosk at the bottom, a tram line with an occasional tram, bare birch trees, and snow on everything. Fog and falling snow thicken with distance. The sky is dark blue-grey with a faint orange city glow at the horizon.
- **Inside** (early-2000s Eastern European flat, small and lived in):
  - study (living room): a sofa under a patterned rug hanging on the wall, a chunky CRT TV on a stand, a bookshelf (a "stenka" wall unit), a floor lamp;
  - play: the kitchen table with 4 stools under a hanging lamp, a kettle and glasses of tea, a small fridge, a fluorescent tube over the stove;
  - help: a desk with a beige PC and a CRT monitor by the hallway, and a small wall of mail cubbies by the front door;
  - homes: 12 sleeping spots across a small bedroom and the hallway (bunk beds, fold-out cots, a mattress on the floor), each with a small lamp or nightlight. Each spot has 3 optional objects (a book stack, a plant, a poster) shown by `library_pages` (0-50 none, 51-150 one, 151+ all three).
  - details: radiators under the windows, linoleum and parquet floors, wallpaper, a hanging lamp with a fabric shade, a houseplant on the windowsill, a calendar on the wall.
- **Light:** warm tungsten interior lamps (hanging lamps, floor lamp, desk lamp, nightlights), the cold green-white kitchen fluorescent, the TV's blue glow, orange sodium light from the street below, and cool blue night through the windows. Soft shadows, dark corners.
- **Models:** simple low-poly shapes made in the script, or CC0 models (Kenney, Poly Haven, Quaternius). Low detail is right: anything smaller than a pixel at 480x270 should be left out. Small bevels so edges catch light. Credit everything in `world/art/CREDITS.md`.

**Pixel look rules:**
- Render small (480x270) and scale up with nearest-neighbor by a whole number only (x2, x3, x4) to fit the window, letterboxing the rest.
- Reduce to a limited palette (about 32 colors, set in `look_render.py`) with light ordered dithering only in gradients like the sky and fog. No smooth gradients survive into the final image.
- Use Cycles with denoising, then pixelate. Keep the lighting soft before pixelation; the pixels do the stylizing.

**Outputs** (to `world/art/flat/`):
- `beauty.png`: the pixel render with no creatures;
- `depth.png` (16-bit) or `depth.exr`: depth from the camera at the same low resolution, so the page can hide creatures behind furniture;
- `camera.json`: the orthographic camera's position, rotation and ortho scale, so three.js can match it exactly;
- `lights.json`: positions and colors of the main lights, so the creatures can be lit to match;
- `windows.png` (optional): a mask of lit windows outside, so the page can switch a few on and off over time.

**Scene file:** `world/art/flat/scene.json` holds the spots, walk paths and home objects in 3D floor coordinates, with several positions per spot and a pose for each (`stand`, `sit`, `sleep`). Agents take the next free position, so they never overlap. Placement mode (a key toggles it) draws spots and paths over the render, lets you drag them along the floor, and copies the JSON.

## 5. Agents and animation
Implement the event → animation table in design.md ("The world" → Event → animation), with these specifics:
- **Creatures are 3D blocks built in three.js**, following the approved designs in `world/art/agents/style-test.svg` exactly: one grid square becomes one small cube unit. Each creature is a notched block body, two square eyes, two wide feet and its species parts (axolotl gill stubs and tail, moth square wings and antennae and no feet, raccoon ears, mask band and ringed tail, beaver ears, one tooth and paddle tail). Edges get a small bevel. They should read like chunky toys in a dollhouse. Don't copy the Claude Code crab: no tall bar eyes, no four thin legs.
- **Material and light:** flat matte colors from the style test, lit by a key light and fill matching `lights.json` and the render, plus a small dark contact shadow under each creature. They are drawn at the same low resolution as the render and mapped to the same palette, so they sit on the same pixel grid and don't look pasted on.
- **Depth:** draw the render's depth into the depth buffer before the creatures, so furniture in front hides them correctly.
- **Size:** about the height of a kitchen stool seat; at 480x270 that is roughly 10-14 pixels tall. Check they still read at that size (eyes at least 1 pixel, species feature at least 2).
- **Life:** bob, blink (eyes scale to a line), a small hop while walking, poses for sit and sleep, the head (or whole body) turning toward a nearby plane. Moths flap and hover. Per-agent tint: a small shift of body color within the same hue.
- **Walking:** along the paths in scene.json, through doorways between rooms; a walk across the flat takes 2-3 s at 1x.
- **Thinking look:** diffusion species shimmer softly (a gentle color pulse) during a tool call; AR species do a step-by-step motion (a little stacking or tapping).
- **Moths** have no hands: on `tool_call` they hover over the object instead of picking it up.
- **Props:** the 12 interest props from section 3 as tiny block models on the head or held in front.
- **Paper planes:** tiny folded block planes (a few pixels), one per `message_sent`, flying from sender to receiver along a gentle arc. Flight time at 1x = clamp(1.5 s + `sim_latency_ms` / 100 s, 1.5 s, 4 s). Letter for `forward`, a small bundle for `text_help`, a sheet with blanks for `canvas`. A declined reply flies back empty and flutters down. If `message_received` comes before the plane lands, the plane just keeps flying; never cut it short.
- **Answer:** a small stamp or bell at the asking agent's spot.
- **Idle motions** (bobbing, page turning, stretching) stay in the agent's current place.

## 6. Playback
- Load a JSONL file by drag-and-drop or a file picker. Show the file's `run` id in a corner (so `fake-` runs are obvious).
- Play / pause, speed 1x / 4x / 16x.
- The view runs 3 s (sim time) behind the newest event it has read, so walks can start before the next event.
- Catch-up rule: if an agent has more queued animation than 5 s behind, its walks become a soft "poof" teleport and tool animations shorten. Never drop an event's visible effect entirely, and never show anything not in the log.
- At 16x, all walks are poofs.

## 7. View and agent card
- The camera is fixed to the render's angle. Zoom steps are whole-number pixel scales only (for example x3 to x6), and the view can pan within the image; the background and the three.js layer always move together and stay pixel-aligned. No rotation.
- The scene fills the window with letterboxing as needed; the title and controls sit in the letterbox or over the empty corners, never over the room.
- Click an agent: a small card with name, species, model, interest, current state, current tool and `arg`, library pages, and the last 5 events as raw JSON (expandable). A "follow" button keeps a soft zoom on that agent; Esc stops following.
- Agents get a name label on hover.

## 8. Art
- **Scene:** made by the Blender script (section 4). The references in `docs/look-refs/` set the lighting and cutaway; section 4 sets the Eastern Bloc setting and pixel look. CC0 models only; anything else needs Zach's OK.
- **Creatures:** locked design in `world/art/agents/style-test.svg` (approved 2026-10-24), built as 3D blocks (section 5).
- Record every model, texture and HDRI with its source and license in `world/art/CREDITS.md`.

## 9. Look settings (for the polish pass)
After Codex builds W0, Claude does a polish pass. Two places hold every look value, each as a plain, commented object, with nothing hard-coded elsewhere:
- **`world/blender/look_render.py`** (imported by the build script): every light's position, color and strength; sky, fog and snow; window-lit fraction and colors; material colors; bevel size; camera angle and ortho scale; render samples; render resolution; the palette and dither strength; color management and grade.
- **`world/src/look.js`** (the page): creature colors and tints, key and fill light matching, contact shadow, bob, hop and blink timing, shimmer, plane timing constants, falling snow drawn live over the render (pixel flakes, two depths), window switching, tram timing, zoom steps.

Changing `look_render.py` and re-running the script must re-render the room; changing `look.js` must update the page on reload.

## 10. Performance
- The page draws one small background image plus 12 tiny block creatures at 480x270: 60 fps on integrated graphics should be easy.
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
- [ ] Creatures are correctly hidden behind furniture in front of them (depth works), and they look lit like the room.
- [ ] `art/CREDITS.md` lists every image; `world/README.md` says how to generate the fake log and open the page.
- [ ] Runs at a steady frame rate on integrated graphics.
- [ ] A short screen recording or a few screenshots go in `docs/` with a dated progress note.
