# World W0 build spec (for Codex)

This is the handoff for the first build of the world frontend. `docs/design.md` ("The world" section) is the vision. This file is what to build now. If the two disagree, this file wins for W0. Ask Zach if something here is unclear rather than guessing.

## Goal
A browser page showing **one cozy room, the cabin**, with **12 agents** going about their day, replaying an event log. Pretty first: it should feel cozy and calm, like a VRChat chill world or a lofi YouTube background you leave open on a second monitor. Starting with one room keeps W0 small; more spaces come later. People only watch; nothing in the world is clickable except agents (to inspect them) and the camera.

## Out of scope for W0
The apartment and any other space, choosing a home space, time-of-day setting (W0 is fixed at winter evening), sound and music, debug overlays, timeline scrubber, live streaming from the simulator, chat overlay, connect screen, reputation lanterns, user avatars. Don't build hooks for these beyond keeping the code tidy.

## Where it lives
```
world/
  index.html, src/...        the page (three.js; build tooling is your pick, keep it simple)
  assets/                    3D models and textures, plus CREDITS.md
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

## 4. The cabin
One room, seen as an isometric cutaway (two walls and the floor, orthographic camera, ~35° tilt, 45° yaw), like a dollhouse room or a lofi YouTube background. Mood: a Kananaskis mountain lodge on a winter evening.
- **Light:** warm amber lamps and the fireplace glow are the main lights; cool blue-white light comes in from the window. One shadow-casting light. A cheap soft glow on lamps and fire is welcome if it stays light on the GPU.
- **Materials:** wood, wool, stone; forest greens, browns and deep reds. Toon or flat shading.
- **Window:** a big window with snow falling outside onto pines and mountain peaks (a simple backdrop plane or a few low-poly shapes; doesn't need to be 3D).
- **Spots** (spaced so walks take 2-3 s at 1x):
  - study: bookshelves and two or three armchairs by the fireplace;
  - play: a game table on a rug, seats for two pairs;
  - help: a mail desk with cubbyholes near the door;
  - homes: 12 sleeping cubbies or loft bunks along one wall, one per agent, each with a tiny lamp and a spot to pin notes. Decor grows with `library_pages`: 0-50 bare, 51-150 a small shelf, 151+ shelf, jars and posters.
- **Spots hold a crowd:** several agents can be at the same spot (gather around the fire, queue at the mail desk). Give each spot a few standing or sitting positions and use the next free one.
- **Ambient:** falling snow, flickering fire, a little steam from a mug, drifting dust in the lamp light. Nothing that looks like an agent event.

## 5. Agents and animation
Implement the event → animation table in design.md ("The world" → Event → animation), with these specifics:
- **Walking:** when `state` changes, the agent walks from where it is to the new spot on a simple path (no pathfinding needed; a few fixed waypoints around the furniture are fine). A walk across the room takes about 2-3 s at 1x.
- **Thinking look:** diffusion species shimmer softly all over while doing a tool call; AR species do a step-by-step motion (paws working, a stacking motion).
- **Moths** have no hands: on `tool_call` they hover over the object instead of picking it up.
- **Paper planes:** one plane per `message_sent`, flying from sender to receiver along a gentle arc. Flight time at 1x = clamp(1.5 s + `sim_latency_ms` / 100 s, 1.5 s, 4 s). Letter for `forward`, a small bundle for `text_help`, a sheet with blanks for `canvas`. A declined reply flies back empty and flutters down. If `message_received` comes before the plane lands, the plane just keeps flying; never cut it short.
- **Answer:** a small stamp or bell at the asking agent's spot.
- **Idle motions** (bobbing, page turning, stretching) stay in the agent's current place.

## 6. Playback
- Load a JSONL file by drag-and-drop or a file picker. Show the file's `run` id in a corner (so `fake-` runs are obvious).
- Play / pause, speed 1x / 4x / 16x.
- The view runs 3 s (sim time) behind the newest event it has read, so walks can start before the next event.
- Catch-up rule: if an agent has more queued animation than 5 s behind, its walks become a soft "poof" teleport and tool animations shorten. Never drop an event's visible effect entirely, and never show anything not in the log.
- At 16x, all walks are poofs.

## 7. Camera and agent card
- Mouse drag to pan, wheel to zoom (clamped), Q/E or buttons to rotate in 90° steps. When the camera rotates, whichever walls face it fade out or hide so the room always stays open like a dollhouse.
- Click an agent: a small card with name, species, model, interest, current state, current tool and `arg`, library pages, and the last 5 events as raw JSON (expandable). A "follow" button keeps the camera on that agent; drag or Esc stops following.
- Agents get a name label on hover.

## 8. Assets
- Try CC0 low-poly packs first (Kenney's furniture and nature kits for the room and the view outside; Quaternius or similar for animals). Record every pack, author and license in `world/assets/CREDITS.md`. Nothing non-CC0 without asking Zach.
- An axolotl, moth or beaver may not exist in CC0 packs. If not, build them from simple shapes in three.js (capsules, spheres, cones): rounded, big-eyed, cute. Same for props. That's fine for W0; custom art can replace it later.

## 9. Look settings (for the polish pass)
After Codex builds W0, Claude does a visual polish pass by tuning values, not rewriting code. So every look value lives in **one file**, `world/src/look.js` (or similar), as a plain, commented object. The rest of the code reads from it, with no look numbers hard-coded elsewhere.
- **Light:** each lamp's color and strength, fire glow color and flicker, window light color and strength, ambient light, shadow softness.
- **Glow and fog:** glow on or off, strength and threshold; fog color and distance.
- **Palette:** wall, floor, wood, fabric and outline colors; the tint for each agent.
- **Weather and ambient:** how fast and how thick the snow falls, how much dust drifts, mug steam.
- **Camera:** tilt, yaw, default zoom, zoom limits.
- **Motion:** walk duration, plane flight formula constants, idle-motion amount, shimmer speed.

The page reloads cleanly when `look.js` changes (or hot-reloads, if the build tooling makes that easy). The apartment will later get its own look file with the same shape, plus neon colors.

## 10. Performance
- 60 fps on the desktop or laptop integrated graphics with 12 agents. The M0 GPUs are busy with models, so it must stay light: low poly counts, few lights, one shadow-casting light, no post-processing beyond simple outlines if cheap.

## 11. Done when
- [ ] `fake_log.py` writes a deterministic log that passes its own `--check`.
- [ ] The page loads `fake-run.jsonl` and plays it start to finish at 1x, 4x and 16x without errors in the console.
- [ ] All 12 agents are visible, each species and each agent within a species is tellable apart at default zoom.
- [ ] Every row of the event → animation table has been seen on screen during the fake run.
- [ ] Planes go to the right agent, declined replies look different, and timing follows the formula.
- [ ] During the busy stretch the view stays within ~5 s of the log.
- [ ] Clicking an agent shows the card with correct current state and raw events; follow mode works.
- [ ] A line with an unknown event type or extra fields is ignored without breaking playback.
- [ ] Every look value is in the look-settings file, and changing one there changes the scene.
- [ ] `CREDITS.md` lists every asset; `world/README.md` says how to generate the fake log and open the page.
- [ ] Runs at a steady frame rate on integrated graphics.
- [ ] A short screen recording or a few screenshots go in `docs/` with a dated progress note.
