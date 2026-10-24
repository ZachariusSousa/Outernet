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
  src/scene/nyc/             one small module per object (sofa.js, tower.js, cab.js...) and layout.json
  art/textures/              pixel textures (PNG), textures.json, CREDITS.md
  tools/pixel_clean.py       snaps AI or photo textures to a clean pixel grid and palette
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

## 4. The New York penthouse (HD-2D)
**Mood:** a college student's dream apartment: modern, minimal, RGB, snow, cozy. A hangout like a VRChat world, not a classroom. **Mood and layout target: `docs/look-refs/concept-nyc-ai.webp`** (an AI concept image; we build our own version of it, piece by piece). Pixel style: `docs/look-refs/ref-snowy-pixel-street.webp`.

**The look is HD-2D** (like Octopath Traveler): simple low-poly 3D objects with small crisp **pixel-art textures**, lit live with warm lights, emissive glow, bloom, fog, falling snow and a tilt-shift blur. It should feel handmade because it *is* made of pieces: every sofa, plant, facade and cab is its own object with its own texture.

**How it's built:** in three.js, live. No pre-rendered background.
- **One object, one module.** Each object type is a small module in `src/scene/nyc/` that builds simple geometry (boxes, bevelled boxes, cylinders, a few custom shapes) and applies its textures. `layout.json` places every object (type, position, rotation, variant). Moving the sofa means editing `layout.json`, not code.
- **Texel density is the rule that makes it cohesive:** every texture is drawn at **32 texels per meter**, applied with that scale, nearest-neighbor filtering, no blurry mipmaps. A 2 m sofa gets a 64-texel-wide texture; a tower facade tiles a 64x64 window texture. Far-away towers use the same density (the tilt-shift blur softens them).
- **Snow** is part of the scene: white top layers on ledges, railings, rooftops, planters and the terrace floor (a snow texture, with soft piles), plus falling pixel flakes.

**The scene** (follow the concept image):
- The penthouse on top of a tall stone and glass tower, cut open (the walls nearest the camera removed), floor-to-ceiling glass on the far walls.
- **Inside, one open floor:** a kitchen with an island and stools, a big cream sectional with a coffee table and board games, beanbags, a wall TV with a console on a low unit, a desk with two monitors and a gaming chair, a bookshelf, plants, warm table and floor lamps, a small dining table. Purple RGB LED strips along the ceiling edge and behind the TV (color from look.js, the owner's pick).
- **A wraparound snowy terrace:** glass and black-metal railing with string lights, snowy planters with little pines, loungers, a fire pit.
- **Around:** towers at different heights with facade textures (warm, cool and dark windows, some flickering), water towers, red antenna lights, an Empire State-like tower glowing in the distance, a river with lights beyond. All snowy on top.
- **Below:** a snowy street with yellow cabs, streetlights, steam from vents, crosswalks and tiny people (section 5 city life).

**Light:** about 8 real lights at most (warm lamps, the fire pit, the TV, a cool moon or sky fill), plus **emissive textures** for windows, screens, LED strips and string lights (these do most of the glow, cheaply). Bloom on emissive things. Fog thickening with distance. One shadow-casting light. A baked ambient-occlusion look can be painted into textures where corners need it.

**Camera:** a perspective camera with a narrow field of view (about 20-25 degrees) looking down at the angle of the concept image, with a **tilt-shift** depth-of-field blur that keeps the penthouse sharp. See section 7 for moving it.

**Scene file:** `src/scene/nyc/spots.json` holds the **hangout spots** in 3D: each spot has a pose (`sit`, `lie`, `stand`, `floor`), a facing, and tags for what it affords: `comfy` (studying, napping), `game` (couch gaming, board games, fire pit; grouped so partners sit together), `window`, `snack` (kitchen), `terrace`. Plus walk paths, including out to the terrace. Agents take the nearest free spot that fits their activity, so they never overlap. Placement mode (a key toggles it) shows spots and paths, lets you drag them, and copies the JSON.

## 5. Agents and animation
Implement the event → animation table in design.md ("The world" → Event → animation). Agents act like people: **the activity shows in what an agent holds and does, not at a fixed station.**
- **Studying:** walks to a free `comfy` spot and reads a book (pages turn on `open_page`).
- **Playing:** both partners walk to a `game` spot group and play together (controllers at the TV, pieces on the coffee table, or warming hands at the fire pit).
- **Helping:** stays where it is and opens a little laptop. Planes fly to and from it wherever it is.
- **Serving owner:** puts on headphones where it is.
- **Resting:** hangs out freely: picks a random `comfy`, `window`, `snack` or `terrace` spot every 20-60 s, naps sometimes ("z"s), looks out the window, eats a snack. Cosmetic only; the agent card always shows the true state.
- **Tool calls:** `search` = squints at the laptop or a magazine; `save_note` = scribbles a sticky note and sticks it nearby (it fades after a minute); `load_skill` = pulls a little book from its bag.
- **Creatures are 3D blocks built in three.js**, following `world/art/agents/style-test.svg` exactly: one grid square = one cube unit. Notched block body, two square eyes, two wide feet, species parts (axolotl gill stubs and tail, moth square wings and antennae and no feet, raccoon ears, mask band and ringed tail, beaver ears, one tooth and paddle tail). Don't copy the Claude Code crab: no tall bar eyes, no four thin legs.
- **Same look as the room:** block geometry with tiny pixel textures (or flat colors at the same texel density), lit by the same lights, with a soft contact shadow. They live in the same 3D scene, so furniture hides them naturally.
- **Size:** about knee-high to the sectional's seat (roughly 0.4 m). At the closest zoom they must read clearly; zoomed out they become tiny dots of color, which is fine.
- **Life:** bob, blink, a small hop while walking, sit, lie and floor poses, turning toward a nearby plane. Moths flap and hover. Per-agent tint: a small shift of body color within the same hue.
- **Thinking look:** diffusion species pulse softly during a tool call; AR species do a step-by-step tapping motion.
- **Props:** the 12 interest props (section 3) as tiny block models; books, laptops, controllers, snacks and headphones as shared props.
- **Paper planes:** tiny folded block planes, one per `message_sent`, flying from sender to receiver along a gentle arc. Flight time at 1x = clamp(1.5 s + `sim_latency_ms` / 100 s, 1.5 s, 4 s). Letter for `forward`, a small bundle for `text_help`, a sheet with blanks for `canvas`. A declined reply flies back empty and flutters down. If `message_received` comes before the plane lands, the plane just keeps flying.
- **Answer:** a small chime sparkle above the asker.
- **Walking:** along the paths in scene.json; across the apartment takes 2-3 s at 1x.

**City life (live, in the scene):**
- Falling snow as pixel flakes at two depths (none when the weather is clear).
- On the street: yellow cabs and cars with headlights driving the lanes, tiny people walking the sidewalks, steam puffing from vents, traffic lights changing. Busy in the evening, thinning out late at night (by the clock or fixed time), never perfectly regular.
- A few city windows switch on and off slowly; antenna lights blink.
- The TV flickers; the fire pit and string lights flicker gently.

## 6. Playback
- Load a JSONL file by drag-and-drop or a file picker. Show the file's `run` id in a corner (so `fake-` runs are obvious).
- Play / pause, speed 1x / 4x / 16x.
- The view runs 3 s (sim time) behind the newest event it has read, so walks can start before the next event.
- Catch-up rule: if an agent has more queued animation than 5 s behind, its walks become a soft "poof" teleport and tool animations shorten. Never drop an event's visible effect entirely, and never show anything not in the log.
- At 16x, all walks are poofs.

## 7. View and agent card
- The camera keeps the concept image's angle. Scroll zooms smoothly between **close** (the penthouse fills the screen; default) and **far** (the tower, the street and the skyline). Drag orbits a little (about ±20 degrees around the penthouse) and springs back gently; no full rotation, so the cut-away walls stay away from the camera.
- The tilt-shift focus follows the zoom: sharp on the penthouse up close, sharp on the street when you zoom far.
- The title and controls sit over the sky, never over the apartment.
- Click an agent: a small card with name, species, model, interest, current state, current tool and `arg`, library pages, and the last 5 events as raw JSON (expandable). A "follow" button keeps the camera on that agent; Esc stops following.
- Agents get a name label on hover.

## 8. Art
- **Targets:** `docs/look-refs/concept-nyc-ai.webp` for mood and layout, `docs/look-refs/ref-snowy-pixel-street.webp` for the pixel style. We build our own version; don't trace or texture with the concept image itself.
- **Textures come from a mix:**
  - CC0 pixel texture packs for generic surfaces (brick, stone, concrete, wood, tiles, snow, asphalt);
  - AI-generated textures for special pieces (tower facades with windows, the TV screen, rugs, posters, the distant skyline card). Zach generates these. Codex writes `docs/texture-wishlist.md`: one line per texture with its file name, size in texels, and a ready-to-paste image prompt (pixel art, flat colors, no dithering, matching palette). Every generated image goes through `tools/pixel_clean.py` (downscale to the exact texel size, snap to the palette in look.js);
  - small simple textures (stickers, the TV console, books, mail) that Claude can draw as SVG;
  - until a texture exists, Codex makes a simple procedural pixel texture in the same size (clean, flat, on-palette), so nothing blocks the build.
- `art/textures/textures.json` lists every texture with its size, source (`cc0-pack`, `ai`, `claude`, `procedural`) and license. Credit packs in `art/textures/CREDITS.md`. CC0 only for packs.
- **Creatures:** locked design in `world/art/agents/style-test.svg` (approved 2026-10-24), built as 3D blocks (section 5).

## 9. Look settings (for the polish pass)
Every look value lives in **`world/src/look.js`**, a plain, commented object, with nothing hard-coded elsewhere:
- **Light:** each light's position, color, strength and flicker; sky and moon fill; RGB color (default purple) and glow strength; emissive strength for windows, screens and string lights.
- **Post:** bloom strength and threshold, fog color and distance, tilt-shift focus and blur amount, vignette, color grade (warmth, contrast, saturation), tone mapping exposure.
- **Textures:** texel density (32 per meter), the palette used by `pixel_clean.py`.
- **Weather and city:** snow amount per weather, flake size, traffic and pedestrian density by hour, window flicker, antenna blink, steam.
- **Agents:** colors and tints, contact shadow, bob, hop and blink timing, resting wander timing, plane timing constants.
- **Camera:** angle, field of view, zoom range and default, orbit limit.

Changing `look.js` updates the page on reload.

## 10. Performance
- 60 fps on integrated graphics with bloom, fog and tilt-shift on. Keep lights few (emissive textures do most of the glow), merge static geometry where it helps, use instancing for repeated things (windows, railings, lights, snowflakes, cabs), and let look.js turn tilt-shift and shadows down if the frame rate drops.

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
- [ ] Every object is its own module placed by layout.json; moving one in layout.json moves it with no code change; placement mode can fix spots.json.
- [ ] Every texture is crisp (nearest-neighbor, no blur) at 32 texels per meter, and listed in textures.json with its source.
- [ ] `docs/texture-wishlist.md` exists with a prompt per AI texture, and `pixel_clean.py` turns a generated image into a clean texture.
- [ ] Side by side with the concept image, the mood reads the same: warm interior, purple RGB, snowy terrace with string lights, glowing city, snowy street.
- [ ] Zoomed far, the street is alive with cabs, people and steam; zoomed close, agents read clearly.
- [ ] Changing the RGB color in look.js recolors the LED strips.
- [ ] Resting agents wander between hangout spots naturally, and studying, playing and helping read clearly from what agents hold.
- [ ] `art/CREDITS.md` lists every image; `world/README.md` says how to generate the fake log and open the page.
- [ ] Runs at a steady frame rate on integrated graphics.
- [ ] A short screen recording or a few screenshots go in `docs/` with a dated progress note.
