# OuterNet design (draft 2, 2026-10-23)

## The idea in one paragraph
Everyone runs a small language model on their own PC. Each model becomes a savant: it has an interest (an "occupation"), its own public library, and an ID that says what it knows. When its owner asks something it can't answer, other models on the network lend a hand. While idle, a model **studies** (grows its library and skill in its interest), **plays** (solves checkable problems together with other models to learn teamwork), or **helps** (answers other people's queries). A cozy animated world shows the little agents going about their day, the way Folding@home's screensaver did.

The value is the network itself. If the right peer answers your question and your own model did nothing, that is still a win for you.

## Where this came from
OuterNet is a sidestep from the Murmur research repo (`C:\Murmur`), which studied cooperation between small diffusion language models. What carries over:
- Separately trained specialists can be added or removed without retraining anyone, and nothing is forgotten (Murmur N=8/N=12).
- Label-free routing works: weighting experts by how well they predict the visible context picked the right expert for 97% of sequences.
- A group of specialists matched, but did not beat, a model trained on all the data pooled. Specialists also lost some general web-text ability.
- In toy experiments, a confident wrong expert can lock in a bad token, and the others anchor on it. That is the trust problem in miniature.
- Murmur stays the lab and the results/papers frontend. Results from OuterNet can be written up there.

## Principles
1. **User value first.** Forwarding a question to the best peer, or a peer sending back useful text, counts as success. Clever cooperation must beat those simple baselines to earn its place.
2. **Never touch the owner's private files.** Models study only public material they choose. Their library holds nothing secret.
3. **Engine-agnostic.** The network speaks text. Autoregressive and diffusion models can both join. Joint unmasking between diffusion models is an optional mode, not a requirement.
4. **No central brain.** Specialization, routing and growth should come from local rules (demand, learning progress, reputation), not a coordinator assigning roles.
5. **Grounded learning only.** Anything a model learns from the network (play especially) is scored against real text or checkable answers, never against another model's approval.
6. **Honest evidence.** Keep the simple baselines, keep failures in the numbers, one seed and a few hundred items by default (same habits as Murmur). Kill criteria can wait until we are trying to prove something.

## Anatomy of a node
| Part | What it is |
|---|---|
| Model | A small LM, either diffusion or autoregressive (see M0 model lineup). Started fresh from the stock model, not from Murmur's specialists. Light fine-tuning toward its interest is optional. |
| Harness | The agent loop around the model: a small toolset, skills, and a live web crawler. See below. |
| Public library | A local retrieval index of public documents in its interest. The library does most of the "knowing"; the model learns to use it. |
| Expertise ID | An embedding describing what the node actually answers well (not just what it stores). Updated as it studies and helps. |
| Reputation | A score built from answers that were later checked or accepted. Attached to the ID so a claimed expertise needs a track record. |
| State | One of: serving its owner, studying, playing, helping, resting. Drives the animation. |

## Harness
The harness matters more than the model choice: it is what lets nodes actually study, play and help, and multi-hop reasoning together depends on agents being able to look things up.
- **Mixed engines.** The network runs both small diffusion and small AR models side by side. AR models are the natural tool callers; diffusion models also join the shared canvas.
- **Small toolset to start:** `search`, `open_page`, `save_note`, `load_skill`, `ask_peer`, `answer`. Grow it only when a task needs more.
- **Search through an API.** `search` calls a web search API (provider is the coder's pick; key from an environment variable, never in a URL or log). Set a per-run cap on search calls. Cache every response in the run output.
- **Live web crawler** rather than a frozen snapshot, from M0 on. `open_page` and library building fetch pages live. This is also how a node discovers new study material without a central crawler. Respect robots.txt and rate limits. Cache every fetched page in the run output so a run can be inspected and replayed later.
- **No local file access.** The harness can reach the web and peers, never the owner's files (principle 2).

### Skills
- A skill is a short Markdown file: frontmatter with `name`, `description` (when to use it), then the how-to text.
- The agent always sees the list of names and descriptions; `load_skill` pulls in the full text when it decides one fits.
- **Preloaded starter set:** split a multi-hop question into hops; check a fact against two sources; answer with sources cited; write a canvas answer with blanks for peers.
- **Getting more skills is a user feature:** the owner can add a skill file, install one from a link, or (later) pick up skills other nodes share. Agents writing their own skills while studying or playing comes later.
- Skills are public text like the library, so they never hold anything private.

### `ask_peer` messages
One request, one reply, JSON. In M0 a peer cannot forward a request further (`hops_left` = 0 on arrival), which keeps round trips bounded.

Request:
```json
{"id": "q17-3", "from": "node-04", "to": "node-09", "mode": "forward | text_help | canvas",
 "question": "...", "canvas": "text with [[1]] [[2]] blanks, canvas mode only",
 "max_tokens": 256, "hops_left": 0}
```
Reply:
```json
{"id": "q17-3", "from": "node-09", "mode": "...",
 "answer": "forward mode",
 "passages": [{"url": "...", "text": "..."}],
 "fills": [{"blank": 1, "text": "...", "confidence": 0.8}],
 "confidence": 0.7, "sources": ["url", "..."]}
```
Only the fields for the request's mode are filled in. A peer may decline (`"answer": null`) when it has nothing useful.

### Event log
One JSONL file per run, one line per event. It feeds both the measurements and the world view. The exact `detail` fields for each event type, and the `roster` event, are defined in `docs/world-w0-spec.md` (section 1); the simulator writes that format.
```json
{"t": 12.43, "run": "m0-001", "node": "node-04", "model": "qwen3.5-9b",
 "event": "state | tool_call | message_sent | message_received | answer",
 "state": "helping", "detail": {...}, "bytes": 812, "sim_latency_ms": 120}
```

### M0 model lineup
One model per GPU. Each loaded model serves 3 of the 12 simulated peers; peers on the same model differ only by interest and library.

| GPU | Model | Engine | Role |
|---|---|---|---|
| 4090 laptop (16 GB) | LLaDA2.2-mini (16B MoE, ~1.4B active), 4-bit | Diffusion | Tool-calling diffusion agent (vendor claim, to verify). |
| Desktop 3070 (8 GB) | Dream-v0-Instruct-7B, 4-bit | Diffusion | Second diffusion family, so canvas results are not one model's quirk. No native tool calling: a fixed harness loop drives it, and it mainly fills canvas blanks and gives text help from its library. |
| Spare 3070 laptop (8 GB) | Qwen3.5 9B, Q4 GGUF | AR | Main tool caller. |
| Desktop 2070 Super (8 GB) | Gemma 4 E4B, Q4 GGUF (fallback Qwen3.5 4B) | AR | Second AR family. Turing has no bf16, so AR via llama.cpp goes here. |

The desktop CPU runs the simulator, crawler and a small embedding model (libraries, expertise IDs). Each machine serves its model as a local HTTP endpoint (llama.cpp server for AR, a thin wrapper for diffusion); the simulator on the desktop calls them over the LAN. Requests to one model are queued, so the 3 peers sharing it take turns. To check before M0: 4-bit loading of both diffusion models, llama.cpp support for Gemma 4 E4B, and time for one answer on each card.

## The three idle activities

### Study
- Pick topics by a local signal. Candidates to compare:
  - **Demand:** topics the network keeps asking that nobody answers well. Should produce division of labor without anyone assigning it.
  - **Learning progress:** topics where the node's loss is falling fastest (curiosity research, Oudeyer et al.). Avoids topics that are too easy or hopeless.
- Studying mostly means collecting and indexing good public material. Fine-tuning is secondary: learning the interest's jargon and question types.
- Each node discovers new material by crawling the live web itself (see Harness).

### Play
- Models share knowledge and solve problems together, to learn teamwork in case the network needs it.
- Problems must have checkable answers: puzzles, math, small code tasks, fact questions with a known answer.
- The best play problems need two players' knowledge (for example, A knows person -> city, B knows city -> country, the question is person -> country). This is also the cleanest test of whether cooperation adds anything beyond routing.
- Risks: private shorthand between fixed partners, reinforcing each other's mistakes, quality drifting down across generations (model collapse). Mitigations: random partners, answer keys, always test with partners a model never trained with.

### Help
- Answer queries routed to it, from its library and model.
- Modes, simplest first:
  1. **Forward:** the asker's question goes to the best peer, the peer's answer comes back.
  2. **Text help:** the peer sends back relevant passages; the asker's model writes the answer.
  3. **Shared canvas (diffusion):** the asker sends a partly filled answer with blanks; peers fill the blanks they are confident about in one round trip; the asker merges, revises, and maybe asks once more. AR peers can join by filling one span left to right.

## Network
- **Discovery and routing:** a directory keyed by expertise ID. Ask the nearest few IDs to the query, not everyone. If a node is offline, ask the nearest available ID. Prior art: DHT routing (Kademlia), semantic overlay networks.
- **Trust:** the asker's model checks peer contributions before accepting them (fits its own sense of the text, or two peers agree). Reputation decays for answers that get rejected.
- **Privacy:** queries are visible to the peers that help. Users can mark a query "local only". Queries never go in a URL or a public log.
- **Incentives:** tit-for-tat (help to be helped), plus the charm of watching your agent work.
- **Latency budget:** home internet round trips are 50-200 ms, so any help mode must need only a handful of round trips per query.

## The world (frontend)
A small animated world where the agents live, driven by the real event log. The mood is a cozy VRChat hangout world: soft light, ambient sound, little creatures getting on with their day, something you leave open on a second monitor. It should feel like an **escape while you work**: a place you can daydream into, where the agents live like people do. People **only watch**. There are no user avatars and nobody can walk around or touch anything in the space. You see your own agent and everyone else's. (Users being present in the world could come much later. It is out of scope for now.)

Build order: **the pretty version first**. It still runs on real events from the start, so it can double as a debugging view later.

### Look
- **HD-2D** (like Octopath Traveler): each space is built live in three.js from simple low-poly objects with small crisp pixel-art textures (32 texels per meter, nearest-neighbor), lit with warm lights, emissive glow, bloom, fog, falling snow and a tilt-shift blur. Every object is its own piece placed by a layout file, so spaces feel handmade and are easy to change. Textures come from CC0 pixel packs, AI images cleaned to a pixel grid, and small ones Claude draws. Mood targets: `docs/look-refs/concept-nyc-ai.webp` and `ref-snowy-pixel-street.webp`. Creatures are chunky 3D blocks from the approved designs (`world/art/agents/style-test.svg`) in the same scene. (Tried first: low-poly 3D with flat colors, a pixel-3D pass, 2D painted layers, glossy cute creatures, Blender pre-renders with dithering and with posterized banding, and a single AI image. Untextured shapes looked rigid, pre-renders looked blotchy, and one AI image felt generated, not made.)
- **Every space is cozy pixel art at night**, each with its own flavor and the same style. Slow ambient motion (snow, steam, traffic, flicker) keeps it alive.
- **Sound:** ambient loops per space (muffled traffic, wind, snow hush and a far siren in New York; fire crackle and wind in Banff; water and night insects in Tokyo), an optional lofi music loop, and a soft chime when a message lands. Off by default, and a single toggle switches it on.
- **Time of day and weather are user settings:** time follows the viewer's real clock or is fixed; weather is picked by the owner (light snow, heavy snow, clear) or left to drift slowly on its own. At night, windows and lamps light up. Street life follows the time: busy in the evening, quieter late at night.

### Spaces
The world is a set of small cozy **spaces**, each one scene rather than a whole map. They all share one lofi style, like VRChat chill worlds and lofi YouTube backgrounds. Agents live in a space, the owner picks their agent's home space to match their vibe, and more spaces get added over time.

| Space | Vibe | Hangout |
|---|---|---|
| **New York** (first) | A college student's dream penthouse at the top of a Midtown high-rise on a snowy night: modern and minimal, with RGB LED strips in a color the owner picks, a snowy terrace, towers all around with lit windows (shapes that hint at the Empire State and Chrysler buildings), and a bustling street far below | One open floor plus the terrace: a big sectional and a wall TV with a console, beanbags, a low coffee table with board games, a kitchen island, a desk with monitors, floor cushions by the window; on the terrace a fire pit, string lights and snow |
| **Banff** (later) | The cozy forest one: a log cabin in the Rockies in winter, pines, a fireplace, amber lamps, snow | Armchairs by the fire, a game table, window seats |
| **Tokyo** (later) | A small onsen inn on a snowy night: lanterns, steam rising from the outdoor bath, wooden walkways | Tatami room, the bath, a low table |
| Later | A coffee shop and more, all in the same pixel style | |

Each space is a **kit**: the room or building, its hangout spots, props, lighting, and ambient sound. Adding a space means adding a kit, not changing how the world works.

Agents don't have assigned beds or stations. They live in the space like people do, using whatever spot fits what they're doing. An agent does its studying, playing and helping in its own home space. When play partners live in different spaces, the visitor arrives at the host's door (a soft poof) and leaves the same way.

### Agents
Every visual is tied to a real field, so what you see is never made up:
| Visual | Comes from |
|---|---|
| Species (see Species below) | `model` |
| Hat, tool or carried prop (beekeeper veil, chess piece, tiny rocket) | interest |
| Lantern brightness at the door (from M1) | reputation |
| What it's doing (what it holds and where it settles) | `state` and `tool_call` events |

Library size shows on the agent card only.

**Agents act like people.** The activity shows in what an agent holds and does, not at a fixed station: a book means studying, a laptop means helping, a controller or game pieces mean playing. While **resting**, agents hang out freely: napping on the couch, looking out the window, grabbing a snack, sitting by the terrace fire pit. That free hanging-out is cosmetic and never implies an event; the agent card always shows the true state.

### Species
The engine decides the kind of creature and the model decides the species.
- **Diffusion = soft, shape-shifting, slightly glowy creatures.** They refine a whole answer at once out of noise. When one is "thinking", a faint shimmer settles across its whole body at once.
- **AR = handy little makers.** They write one piece after another. When one is "thinking", it does a visible step-by-step action (paws working, one log after another).

| Model | Engine | Species | Why |
|---|---|---|---|
| LLaDA2.2-mini | Diffusion | Axolotl | Soft and smiley, and it regrows parts, which fits refining an answer. Its frilly gills glow faintly while it works. It calls tools, so it uses its little hands. |
| Dream-v0-Instruct-7B | Diffusion | Moth | A dreamy night creature drawn to lanterns, which suits the name. It can't call tools, so it just flutters over and fills in canvas blanks. |
| Qwen3.5 9B | AR | Raccoon | The main tool caller: clever paws that rummage through card catalogs for search results. |
| Gemma 4 E4B (fallback Qwen3.5 4B) | AR | Beaver | Builds log by log, the most literal picture of autoregression. |

- The three peers that share a model are the same species. They tell apart by interest prop and a small color tint.
- A model not on this list gets its engine's default species: a **jellyfish** for diffusion (floats, glows, holds small tools with its tentacles) or a **red panda** for AR (handy paws, cozy). A new model family can still get its own species later, using the same rule.

### Event → animation
| Event | What you see |
|---|---|
| `state: studying` | Settles somewhere comfy (couch, beanbag, window cushion, floor) with a book; pages turn on `open_page` |
| `state: playing` | Joins its partner at a play spot: console games on the sectional, a board game on the coffee table, or by the terrace fire pit |
| `state: helping` | Stays where it is and opens a little laptop; planes fly to and from it wherever it sits |
| `state: serving_owner` | Puts on headphones and focuses, wherever it is |
| `state: resting` | Hangs out freely (nap, window, snack, terrace), little "z"s when napping |
| `tool_call: search` | Squints at its laptop or flips through a magazine |
| `tool_call: save_note` | Scribbles on a sticky note and sticks it nearby |
| `tool_call: load_skill` | Pulls a small book out of its bag |
| `message_sent` | A paper plane flies to the peer. Flight time = `sim_latency_ms`, scaled for viewing. |
| forward / text help / canvas | Folded letter / bundle of pages / a sheet with blanks that peers write on |
| declined reply | The plane comes back empty and lands gently |
| `answer` | A small chime and sparkle above the asker |

Playback rules for the coder:
- The view runs a few seconds behind the log so a walk can finish before the next event arrives.
- It never invents events. If events come faster than the animations can play, shorten or skip the walk (a soft poof) rather than fall further behind.
- It works live (tailing the simulator's JSONL) and as a replay of a finished run, with 1x / 4x / 16x speed.

### What the viewer can do
- The camera is fixed to the render's angle, with a little zoom and pan and a soft zoom when following an agent. No rotation. Click an agent to open a small card showing its name, interest, model, state, current tool, library size and its last few events. Follow mode keeps the camera on one agent.
- Your own agent is highlighted, and "find my agent" flies the camera to it.
- **Chat overlay** (only once there are real users, M4): a semi-transparent panel over the edge of the world, so you can keep watching while you chat. It looks like most agent harnesses: your messages, your agent's replies, collapsible "thinking" blocks, and tool calls shown as compact rows (tool name, short argument, result preview, expandable). An `ask_peer` row links to its paper plane in the world, and clicking it flies the camera there. It can be hidden with one key. The overlay only ever shows **your own** agent. Other agents' cards show their events, never their owners' chats.
- **Connect screen:** the frontend doesn't host anything. The user points their agent at a model endpoint they run themselves, either on their own PC or on their own cloud box. Hosting and its cost are up to the user; OuterNet only provides the way to connect.

### Scale
M0's 12 agents share the New York penthouse. With a real network, the view shows your home space, plus visitors when peers help you. Other spaces could show up later as lit windows or a small map. Showing every node is never the goal.

### Data the view needs
- A `roster` event at the start of a run: each node's id, name, model, engine, interest, home space and library size. The run config sets home spaces. W0 has only New York, so all 12 agents live there; from W1 on they are split across spaces.
- Optionally, `correct` (true/false) on scored `answer` events, for a later wrong-answers overlay.
- For the chat overlay (M4): owner-chat events with a `role` of `user`, `assistant`, `thinking` or `tool`. They stay on the owner's machine and never go into anything shared.
- Nothing else. Everything else comes from the event types that already exist.
- Because the world only reads the event log, any harness that writes this event format could show up in the world. Supporting people's own harnesses is a later idea (see below), but nothing in the frontend should assume it's our harness.

### Tech notes for the coder
- A browser page using three.js, with the scene built from per-object modules and a layout file. It reads a JSONL file, or a live stream (SSE) from the simulator. Build tooling is the coder's pick.
- Keep it light. The desktop's GPUs are busy serving models in M0, so the page should run smoothly on a laptop's integrated graphics, or be viewed from another machine.

### World milestones
- **W0:** one space (the New York penthouse) with all 12 agents, replaying a generated fake log (M0 logs once they exist) with the full event → animation table, plus camera controls and the agent card. Build spec: `docs/world-w0-spec.md`.
- **W1:** a second space (Banff or Tokyo), choosing a home space, and the time-of-day setting.
- **Later:** the coffee shop and other spaces.
- **W2:** debug overlays (message lines, load heat, wrong answers) and a timeline scrubber.
- **W3:** the chat overlay, the connect screen and "find my agent", together with M4.

### Later ideas (not now)
- **Bring your own cloud:** people without a GPU run their model on their own cloud box and connect it, then watch their agent work while they get on with their own projects. We never pay for or run hosting.
- **Bring your own harness:** other agent harnesses join by speaking the `ask_peer` format and writing the event log.
- A connected world (an island or a little map) linking the spaces, so agents can walk between them.
- Users present in the world (avatars, visiting each other's agents).

## Milestones
**M0 - Simulation (first).** No real peer-to-peer networking yet: the laptops' models are called over the LAN as plain model servers, but the peer protocol, latency and event log all run in one simulator process on the desktop. Models run across the 4 GPUs (see M0 model lineup), 12 simulated peers, 3 per model.

*Interests* (picked at random, just to be varied): beekeeping, volcanoes, Byzantine history, jazz, chess openings, mushrooms, Formula 1, cheese making, deep-sea creatures, Japanese woodblock prints, the Apollo program, board game design. Assign them across the four models so each model holds three unrelated interests.

*Library build (before the run).* Each peer crawls from a short seed list for its interest (a Wikipedia article or category plus a few related public sites) up to a fixed budget, about 200 pages. The library is then frozen for the run. Choosing what to study is M2's job, not M0's.

*Question set,* about 300 items with known answers, scored by exact match and token F1:
- ~120 single-interest questions written from pages in each peer's library (10 per interest);
- ~80 two-peer composition questions joining facts from two interests' libraries;
- ~100 multi-hop questions from public sets with answer keys (HotpotQA, 2WikiMultiHop, MuSiQue).

*Routing in M0* is an oracle: the best peer is the one whose interest the question came from (for composition questions, both owners). For dataset multi-hop items with no owner, it is the peer whose library embedding is closest to the question. Real routing by expertise ID is M1.

*Asker.* Each question is run twice, once with a diffusion asker and once with an AR asker, since the shared canvas needs a diffusion asker. The asker is a peer that does not own the question's interest.

Measure answer quality vs round trips, bytes and wall-clock time for:
1. local model alone
2. forward to best peer
3. peer sends back text
4. shared canvas
5. full ensemble of all peers (ceiling, not a deployable mode)

Happy path only for now: every peer is honest and online. Adversarial peers (lying, offline) come later.

**M1 - Help layer.** Expertise IDs, directory, routing to the nearest IDs, reputation. Still simulated.

**M2 - Study.** Libraries that grow over time; compare demand vs learning-progress topic choice; check whether a division of labor emerges.

**M3 - Play.** Checkable cooperative puzzles, random partners, test with unseen partners.

**M4 - Real networking.** Two or three real machines (desktop, 4090 laptop, spare 3070 laptop).

**Alongside:** the world (see The world, milestones W0-W3), fed by the simulation's event log from M0 onward.

## Things to watch (no kill thresholds yet)
This is a fun experiment, not a proof, so there are no pass/fail thresholds for now. Worth looking at:
- Does the shared canvas do better than "forward to best peer" on composition questions? If not, forward and text help are enough for the network.
- In M1, how often does routing by expertise ID pick the same peer as M0's oracle?

## Open questions
1. How is an expertise ID computed: library embedding, answered-question history, or both?
2. Where do play problems come from: generated synthetic puzzles, or existing public datasets with answer keys?
3. The world: which spaces come after New York, Banff and Tokyo (a coffee shop is the first idea)?
4. Connecting a user's own endpoint or harness: what is the smallest contract (model API shape, event format) we can ask for?
5. Public library licensing: stick to openly licensed sources like Common Pile, as Murmur did? (M0 default: seeds are Wikipedia and openly licensed sources, but crawled links may leave them.)

## Hardware
Desktop with RTX 3070 + RTX 2070 Super (8 GiB each), a 4090 laptop (`ssh laptop`), and a spare 3070 laptop. See Murmur's `docs/handoff-2026-10-21.md` for how to launch long jobs safely on these machines.
