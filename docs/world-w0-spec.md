# World W0 build spec (for Codex)

This is the handoff for the first build of the world frontend. `docs/design.md` ("The world" section) is the vision. This file is what to build now. If the two disagree, this file wins for W0. Ask Zach if something here is unclear rather than guessing.

## Goal
A browser page showing **a college student's dream penthouse in Midtown New York on a snowy night, as an isometric pixel-art room**, with **12 agents** going about their day, replaying an event log. Pretty first: it should feel like a VRChat hangout world or a lofi YouTube background you leave open on a second monitor, an escape while you work. Starting with one room keeps W0 small; more spaces come later. People only watch; nothing in the world is clickable except agents (to inspect them) and the camera.

## Out of scope for W0
The apartment and any other space, choosing a home space, time-of-day and weather settings (W0 is fixed at a snowy evening, but keep them as look values), sound and music, debug overlays, timeline scrubber, live streaming from the simulator, chat overlay, connect screen, reputation lanterns, user avatars. Don't build hooks for these beyond keeping the code tidy.

## Where it lives
```
world/
  index.html, src/...        the page (2D canvas; build tooling is your pick, keep it simple)
  art/nyc/                   room.png (the pixel room), scene.json (occluders, spots, paths, light regions), CREDITS.md
  art/agents/                style-test.svg (approved creature designs) and the sprites made from it
  tools/pixel_clean.py       snaps an AI image to a clean pixel grid and palette
  tools/fake_log.py          the fake-log generator
  README.md                  how to run it
```
The previous 3D build (three.js, CC0 models, city) is kept in git history (last commit 8fe9e3f plus later work) and in `docs/look-refs/hd2d-*.webp`; it is retired for W0.

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

## 4. The New York penthouse (isometric pixel room)
**Target look:** `docs/look-refs/ref-iso-pixel-room.png`: a hand-drawn-style isometric pixel-art cutaway room (two walls and a floor, the near walls removed), warm and cozy, clean pixels, soft pixel lighting. Mood and color: the lofi references (`ref-lofi-window-tokyo.webp`, `ref-lofi-neon-room.png`, `ref-lofi-terrace.webp`, `ref-anime-city-night.png`): warm lamps inside, purple RGB glow, a glowing night city with snow beyond big windows. Layout ideas: `concept-nyc-ai.webp`.

**Why 2D:** the 3D builds (`hd2d-close-final.webp`, `hd2d-far-final.webp`) got clean but never got the painted lofi warmth. The look comes from illustration, so W0 is a single illustrated pixel room with live animation on top.

**How the room is made:**
- Zach generates the room with an AI image tool (prompt in `docs/room-prompt.md`): an **empty** room, no characters, with the window showing the snowy city.
- `tools/pixel_clean.py` turns it into true pixel art: detect the pixel size, downscale to the native art size (about 480x360 art pixels; set in look.js), and snap to a palette, with no dithering. The cleaned file is `art/nyc/room.png`.
- Small fixes can be done by hand in any pixel editor (Aseprite, Piskel, LibreSprite) or by Claude.

**Depth without separate art (occluders):** in placement mode, draw polygons around furniture that agents can walk behind (sofa back, kitchen island, desk, plants, the TV unit) and set each one's **foot line** (the y where it meets the floor). The page draws the room, then agents and occluder cut-outs sorted by foot y: an occluder is re-drawn over any agent whose feet are above (behind) its foot line. So one image is enough.

**Live layers on top** (all drawn at art-pixel scale, crisp):
- light regions: polygons that glow additively and flicker (lamps, TV, fire, RGB strip). The RGB strip region is tinted by the owner's chosen color (default purple);
- the window: snow falling (two depths) clipped to the window polygon, a few city windows twinkling (small rects listed in scene.json), and a slow sky shimmer;
- steam from a mug, dust motes in lamp light;
- falling snow outside the room only where the outside is visible.

**Scene file** `art/nyc/scene.json` (image pixel coordinates): occluder polygons and foot lines, light regions with color and flicker, window polygon and twinkle rects, the RGB strip region, and **hangout spots**: each with x, y, pose (`sit`, `lie`, `stand`, `floor`), facing (left or right), and tags (`comfy`, `game` grouped for partners, `window`, `snack`, `terrace`), plus walk paths between spots. Agents take the nearest free spot for their activity, so they never overlap. Placement mode edits all of it by dragging and copies the JSON.

## 5. Agents and animation
Implement the event → animation table in design.md ("The world" → Event → animation). Agents act like people: **the activity shows in what an agent holds and does, not at a fixed station.**
- **Studying:** walks to a free `comfy` spot and reads a book (pages flip on `open_page`).
- **Playing:** both partners walk to a `game` spot group and play together (controllers at the TV, pieces on the coffee table).
- **Helping:** stays where it is and opens a little laptop. Planes fly to and from it wherever it is.
- **Serving owner:** puts on headphones where it is.
- **Resting:** hangs out freely: picks a random `comfy`, `window`, `snack` or `terrace` spot every 20-60 s, naps sometimes ("z"s), looks out the window, eats a snack. Cosmetic only; the agent card always shows the true state.
- **Tool calls:** `search` = squints at the laptop; `save_note` = scribbles a sticky note that fades after a minute; `load_skill` = pulls a little book from its bag.

**Creatures are pixel sprites** made from `world/art/agents/style-test.svg` (approved 2026-10-24): one SVG grid square (8 px) = 2 art pixels, so a creature is about 28x24 art pixels. Same flat colors, square eyes, two wide feet, species parts. Don't copy the Claude Code crab: no tall bar eyes, no four thin legs.
- Per-agent tint: a small shift of body color within the same hue. The interest prop (section 3) is a tiny pixel sprite on the head or held in front.
- Facing: flip the sprite horizontally for left/right. Poses: `sit` (feet hidden, body lowered 2 px), `lie` (rotated or a lying variant), `floor` (sitting on the floor).
- Life, all in whole art pixels: bob 1 px, blink (eyes become a 1 px line), a 1-2 px hop while walking, moths flap (wings up/down frames) and hover. Diffusion species get a soft 1-2 frame color pulse during tool calls; AR species a tapping motion.
- Held items (book, laptop, controller, headphones, snack) are tiny pixel sprites.
- A 1 px soft shadow ellipse under each agent.
- **Paper planes:** tiny pixel planes flying along a gentle arc from sender to receiver. Flight time at 1x = clamp(1.5 s + `sim_latency_ms` / 100 s, 1.5 s, 4 s). Letter for `forward`, bundle for `text_help`, sheet with blanks for `canvas`. A declined reply flies back empty and flutters down. If `message_received` comes before the plane lands, the plane keeps flying.
- **Answer:** a small pixel sparkle above the asker.
- **Walking:** along the paths in scene.json; across the room takes 2-3 s at 1x.

## 6. Playback
- Load a JSONL file by drag-and-drop or a file picker. Show the file's `run` id in a corner (so `fake-` runs are obvious).
- Play / pause, speed 1x / 4x / 16x.
- The view runs 3 s (sim time) behind the newest event it has read, so walks can start before the next event.
- Catch-up rule: if an agent has more queued animation than 5 s behind, its walks become a soft "poof" teleport and tool animations shorten. Never drop an event's visible effect entirely, and never show anything not in the log.
- At 16x, all walks are poofs.

## 7. View and agent card
- One fixed view of the room, scaled up by a **whole number** (nearest-neighbor) to fit the window, letterboxed. Scroll steps between whole-number zooms (fit, fit+1, fit+2) and you can pan when zoomed in. No rotation.
- The title and controls sit in the letterbox or over empty background, never over the room.
- Click an agent: a small card with name, species, model, interest, current state, current tool and `arg`, library pages, and the last 5 events as raw JSON (expandable). A "follow" button keeps the view centered on it when zoomed; Esc stops following.
- Agents get a name label on hover (pixel font).

## 8. Art
- **Room:** an AI-generated image from `docs/room-prompt.md`, cleaned with `tools/pixel_clean.py` into `art/nyc/room.png`. Until Zach provides it, use the clearly-placeholder room so the code can be built. Record the tool used and the prompt in `art/nyc/CREDITS.md`.
- **Creatures, props, planes and held items:** pixel sprites from the approved designs; Claude can draw any small sprite that's missing.
- Anything not made by us, Zach's AI tool, or CC0 needs Zach's OK.

## 9. Look settings (for the polish pass)
Every look value lives in **`world/src/look.js`**, a plain, commented object, with nothing hard-coded elsewhere:
- art size and default zoom; palette for `pixel_clean.py`;
- light regions: strength, flicker speed and amount; RGB color (default purple) and glow;
- snow: amount per weather, speed, flake sizes, two depths; city twinkle rate; steam and dust;
- a final grade: warmth, contrast, a soft vignette;
- agents: tints, bob, hop and blink timing, resting wander timing, plane timing constants.
Changing look.js updates the page on reload.

## 10. Performance
- A single 2D canvas with one small image and a few dozen sprites: 60 fps anywhere.

## 11. Done when
- [ ] `fake_log.py` writes a deterministic log that passes its own `--check`.
- [ ] The page loads `fake-run.jsonl` and plays it start to finish at 1x, 4x and 16x without errors in the console.
- [ ] The room is crisp pixel art at a whole-number scale, letterboxed, never stretched or blurred.
- [ ] `pixel_clean.py` turns an AI image into a clean `room.png` (no dithering, palette-snapped, true pixel grid).
- [ ] All 12 agents are visible as pixel sprites; each species and each agent within a species is tellable apart; agents never overlap each other.
- [ ] Occluders work: an agent behind the sofa or island is hidden by it, and one in front is not.
- [ ] Every row of the event → animation table has been seen on screen; studying, playing and helping read clearly from what agents hold; resting agents wander naturally.
- [ ] Planes go to the right agent, declined replies look different, and timing follows the formula.
- [ ] Lamps, TV and RGB glow flicker gently; snow falls in the window; changing the RGB color in look.js recolors the strip.
- [ ] During the busy stretch the view stays within ~5 s of the log.
- [ ] Clicking an agent shows the card with correct current state and raw events; follow mode works.
- [ ] A line with an unknown event type or extra fields is ignored without breaking playback.
- [ ] Every look value is in look.js; placement mode can edit and export scene.json.
- [ ] `world/README.md` says how to generate the fake log, clean a room image and open the page.
- [ ] A few screenshots go in `docs/` with a dated progress note.
