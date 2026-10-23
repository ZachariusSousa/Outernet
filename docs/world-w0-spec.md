# World W0 build spec (for Codex)

This is the handoff for the first build of the world frontend. `docs/design.md` ("The world" section) is the vision. This file is what to build now. If the two disagree, this file wins for W0. Ask Zach if something here is unclear rather than guessing.

## Goal
A browser page showing **one cozy room, the cabin**, with **12 agents** going about their day, replaying an event log. Pretty first: it should feel cozy and calm, like a VRChat chill world or a lofi YouTube background you leave open on a second monitor. Starting with one room keeps W0 small; more spaces come later. People only watch; nothing in the world is clickable except agents (to inspect them) and the camera.

## Out of scope for W0
The apartment and any other space, choosing a home space, time-of-day setting (W0 is fixed at winter evening), sound and music, debug overlays, timeline scrubber, live streaming from the simulator, chat overlay, connect screen, reputation lanterns, user avatars. Don't build hooks for these beyond keeping the code tidy.

## Where it lives
```
world/
  index.html, src/...        the page (a 2D renderer such as PixiJS; build tooling is your pick, keep it simple)
  art/cabin/                 layer PNGs, furniture PNGs, scene.json
  art/agents/                puppet parts and pivots per species, props, planes
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
- Uses the real roster below (12 agents, 4 models, 12 interests), all in space `cabin`.
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

## 4. The cabin (2.5D pixel-block illustration)
The cabin is a **flat pixel-block illustration (same style as the creatures, section 8) in a few depth layers**, with 2D creatures animated on top, like a lofi YouTube background that is alive. No 3D models and no models built from code: the look comes from the art. Mood: a Kananaskis mountain lodge on a winter evening.

**Framing:** one fixed 16:9 view of the fireside half of the lodge (fireplace, armchairs, floor lamp, big window, game table) with the bunks and the mail desk at the edges. The camera doesn't rotate.

**Layers** (back to front), each an SVG drawn on an 8 px grid at 1920x1080 (the page scales it up or down by whole steps where it can and keeps edges crisp):
1. `sky`: night sky, layered mountain silhouettes, snowy pines, a small moon (seen through the window).
2. `room`: walls, floor, window frame, fireplace, shelves, bunks, everything that never sits in front of an agent.
3. `furniture/*.png`: one PNG per piece that agents can be in front of or behind (armchairs, game table, mail desk, side table, bunk fronts). Each has a foot line (the y where it touches the floor) so the page can sort it against agents.
4. `front`: a few things that frame the shot and are always in front (a beam edge, a plant, a blanket over a chair arm).
5. `light`: a glow layer of flat light shapes (lamp and fire light pools), drawn additively and flickered by code.
6. `night`: a shading layer of flat dark shapes (multiply) that darkens corners. It's the main source of mood.

Code adds weather and life on top: snow at two depths outside the window, fire flicker, steam from a mug, dust motes in the lamp light.

**Scene file:** `world/art/cabin/scene.json` lists the layers, the furniture foot lines, the spots and the walk paths, all in image pixel coordinates:
- spots: `study` (armchairs and rug by the fire), `play` (game table, 4 seats), `help` (mail desk, a short queue), and 12 `home` spots (one bunk each). Each spot has several positions with x, y, facing and pose (`stand`, `sit`, `sleep`). An agent takes the next free position, so agents never overlap.
- paths: a few waypoint polylines between spots. A walk across the scene takes 2-3 s at 1x.
- home decor: for each bunk, the positions of 3 optional decor stickers (shelf, jars, poster), shown by `library_pages` (0-50 none, 51-150 one, 151+ all three).

A small **placement mode** (a key toggles it) shows spots, paths and foot lines over the art, and lets you drag them and copy the JSON. When the art changes, the scene file gets fixed in a few minutes without touching code.

## 5. Agents and animation
Implement the event → animation table in design.md ("The world" → Event → animation), with these specifics:
- **Walking:** when `state` changes, the agent walks from where it is to the new spot on a simple path (no pathfinding needed; a few fixed waypoints around the furniture are fine). A walk across the room takes about 2-3 s at 1x.
- **Thinking look:** diffusion species shimmer softly all over while doing a tool call; AR species do a step-by-step motion (paws working, a stacking motion).
- **Moths** have no hands: on `tool_call` they hover over the object instead of picking it up.
- **Paper planes:** one plane per `message_sent`, flying from sender to receiver along a gentle arc. Flight time at 1x = clamp(1.5 s + `sim_latency_ms` / 100 s, 1.5 s, 4 s). Letter for `forward`, a small bundle for `text_help`, a sheet with blanks for `canvas`. A declined reply flies back empty and flutters down. If `message_received` comes before the plane lands, the plane just keeps flying; never cut it short.
- **Answer:** a small stamp or bell at the asking agent's spot.
- **Idle motions** (bobbing, page turning, stretching) stay in the agent's current place.
- **Creatures are cut-out puppets**, not frame-by-frame animation. Each species is a handful of PNG parts (body, eyes, eyes closed, feet, and the species parts: gills, wings, antennae, ears, mask, tails, tooth) with pivot points in `world/art/agents/<species>.json`. Code animates them: a bob that moves in whole grid steps, blinking every 3-6 s, a hop while walking, poses for sit and sleep, and the head turning toward a nearby plane. Props are separate PNGs attached to a head or hand anchor.
- **Depth:** agents and furniture are drawn in order of their foot y, so an agent behind the game table is hidden by it.
- **Size:** one agent is about 1/8 of the frame height.

## 6. Playback
- Load a JSONL file by drag-and-drop or a file picker. Show the file's `run` id in a corner (so `fake-` runs are obvious).
- Play / pause, speed 1x / 4x / 16x.
- The view runs 3 s (sim time) behind the newest event it has read, so walks can start before the next event.
- Catch-up rule: if an agent has more queued animation than 5 s behind, its walks become a soft "poof" teleport and tool animations shorten. Never drop an event's visible effect entirely, and never show anything not in the log.
- At 16x, all walks are poofs.

## 7. View and agent card
- The view is fixed. A slight parallax (layers drift a few pixels with the mouse) and a gentle zoom toward a followed agent are the only camera moves. No rotation and no free panning.
- The scene fills the window with letterboxing as needed and never stretches the art.
- Click an agent: a small card with name, species, model, interest, current state, current tool and `arg`, library pages, and the last 5 events as raw JSON (expandable). A "follow" button keeps a soft zoom on that agent; Esc stops following.
- Agents get a name label on hover.

## 8. Art
The art decides the look, so it is made separately from the code and dropped in.
- **Art style (locked 2026-10-24):** flat pixel-block art on an 8 px grid, drawn as SVG by Claude. Only flat colors: no gradients, shine, blush or outlines. Shapes are blocks with cut corners. The reference is `world/art/agents/style-test.svg`: each creature is a notched block body, two square eyes, two wide feet and one species feature (axolotl gill stubs and tail, moth square wings and antennae and no feet, raccoon ears, mask band and ringed tail, beaver ears, one tooth and paddle tail). They are inspired by the simplicity of the Claude Code crab but must not copy it: no tall bar eyes, no four thin legs. The cabin, props and planes use the same blocks and grid. Colors: warm amber light (#ffb35c to #ffcf8a) against a cool blue night (#1c2638 to #2b3a52), with honey and brown wood for the lodge.
- **Deliverables:** the six layers and the furniture PNGs from section 4; for each of the 4 species, the puppet parts (split from style-test.svg); the 12 interest props (section 3); decor stickers; the paper plane in 3 kinds (letter, bundle, sheet with blanks).
- **Placeholders first:** until the real art exists, Codex makes plain placeholder art in exactly this format (simple shapes are fine, clearly rough), so all the code can be built and tested. Swapping in real art must need only new files and a scene.json update.
- Record the source and license of every image in `world/art/CREDITS.md`. Any image that isn't made for us or CC0 needs Zach's OK.

## 9. Look settings (for the polish pass)
After Codex builds W0, Claude does a visual polish pass by tuning values, not rewriting code. So every look value lives in **one file**, `world/src/look.js` (or similar), as a plain, commented object. The rest of the code reads from it, with no look numbers hard-coded elsewhere.
- **Light:** strength and flicker of the `light` layer per lamp and for the fire (each lamp is a region of it, or its own sublayer), strength of the `night` layer, soft bloom strength and threshold.
- **Grade:** overall color grade (warmth, contrast, saturation), vignette, film grain.
- **Agents:** size, per-agent tint, rim light, bob amount, blink timing, walk hop.
- **Weather and ambient:** snow speed and thickness at each depth, dust, steam.
- **View:** parallax amount, follow zoom.
- **Motion:** walk duration, plane flight formula constants, shimmer speed.

The page reloads cleanly when `look.js` changes (or hot-reloads, if the build tooling makes that easy). The apartment will later get its own art folder and look file with the same shape, plus neon colors.

## 10. Performance
- 60 fps on integrated graphics with 12 agents. A 2D renderer (PixiJS or similar) with a few filters is enough; the M0 GPUs are busy with models.

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
- [ ] Swapping a placeholder layer for a new PNG of the same size works with no code change, and placement mode can fix scene.json.
- [ ] `art/CREDITS.md` lists every image; `world/README.md` says how to generate the fake log and open the page.
- [ ] Runs at a steady frame rate on integrated graphics.
- [ ] A short screen recording or a few screenshots go in `docs/` with a dated progress note.
