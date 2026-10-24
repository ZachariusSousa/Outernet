# World integration review — 2026-10-24

Completed the five work stages in order. Screenshots/evidence are in docs/world-integration/.

1. Slab safety: inspected every city mesh and every instance against the conservative protected region x[-10,8], y[-.8,.02], z[-5,7.5]. Zero intersections, both before and after expansion. Claude's lowered tower height (27.3) retained. See 01-safety.json/png.
2. Horizon: seeded tower grid with instanced repeated windows/stone/snow, varied tops, skyline stand-in with spire, snowy city blocks separated by streets. Clear foreground street corridor retained. 02-horizon.png.
3. Resize: CSS dimensions and drawing-buffer size now have separate ownership. renderer.setSize(cssWidth,cssHeight,false), explicit canvas CSS size, matching composer pixel ratio. DPR-2 browser checks at 960×720, 1600×900 and 1440×1000 all returned full-window CSS sizes with 1.25× buffers. 03-resize.json/png.
4. Look cleanup: evaluated the entire patch stack, serialized the final values into one commented object, moved model arrays to their named object modules. Deep equality passed for all pre-cleanup look values. Claude's colors/camera/light/fog/exposure values and parquet PNG preserved. A text-encoding artifact in two UI strings was corrected during verification. Model geometry preserved numerically. Before/after screenshots and value snapshot retained. Dynamic snow/traffic makes these screenshots unsuitable for strict pixel equality.
5. Live agents: extruded exact rect shapes from style-test.svg, actual square eyes/feet/gills/masks/tails/teeth, flat matte materials under room lighting; interest props from existing block SVGs. Reused legacy parser, card DOM code, file loading, playback controls, message timing/history semantics. New 3D adapter provides reserved hangouts, navigation around furniture, book/laptop/controller/headphone activity props, notes, page motion, blink/hover/bob, resting wander, paper messages and answers. P edits spots/path points on their floor planes and copies/downloads spots.json. Click/hover/follow and Esc retained. No beds or stations. Fake roster space updated to nyc; generation algorithm unchanged.

## Done when checklist
| Item | Result / evidence |
|---|---|
| Deterministic fake log and --check | PASS. Seeded generator retained; --check passes generated fixture. |
| Full log at 1×/4×/16× without console errors | PASS for accelerated browser simulation: 529/529 consumed at each speed, 12 agents and 12 unique reserved spots, zero page errors. Not three wall-clock ten-minute recordings. |
| 12 distinguishable agents; no overlaps/furniture intersections | PARTIAL. Four exact silhouettes, tints, props, reserved spots, collision-aware route samples and movement separation. Not exhaustive continuous mesh collision proof; seat mount/dismount can clip edges. |
| Every event animation seen | PARTIAL. Dispatch paths exercised across full log. Physical actions implemented but some tool feedback still uses floating icons; every action has not been manually inspected. |
| Correct planes/declines/timing | PASS by retained formula/endpoints and full replay. Receipt never cancels flights. Visual timing not independently instrumented. |
| Busy stretch within five seconds | PASS by immediate event dispatch, shortened effects and interrupted-walk poof; no accumulating animation queue. |
| Card/state/raw events/follow | PASS for browser card click; preserved raw five-event card and follow/Esc wired. Follow stays at the current zoom. |
| Unknown event/extra fields | PASS. Injected future-event JSON into the browser replay without error; existing extra-field tolerant parser retained. |
| All look values centralized | PARTIAL. Main look object clean and old values identical. Some UI/agent primitive constants and city shape constants still live in modules. |
| Object modules/layout/placement | PASS for apartment modules and draggable spots/path export; city internals remain a combined builder. Export persistence requires saving JSON manually. |
| Crisp 32 texels/m textures + manifest | PARTIAL. Nearest/no-mipmap materials verified previously; object box/curve-side mapping uses density. Instanced city repeats and curved caps still approximate density. |
| Wishlist and cleaner | PASS. Existing prioritized wishlist/cleaner retained; skyline texture added to manifest. |
| Concept mood | REVIEW. Close/mid/far and coffee-table screenshots supplied. |
| Living street and visible agents | PASS for moving cars, people, steam and readable close-up; not a substitute for integrated-GPU FPS testing. |
| RGB configurable | PASS by material hookup retained; no re-render required. |
| Rest wander/activity props | PASS by implementation and replay checks; naturalness needs review. |
| Credits/README | PASS. Updated texture credits and controls/run instructions. |
| Integrated graphics steady 60fps | UNVERIFIED. Dense instanced horizon and depth-of-field need real hardware measurement. |
| Screenshots/progress note | PASS. Ordered stages plus final close, mid, far and agent close-up. |

Remaining quality work: improve route collision details at seats; split city builder further; exact city/curved-cap UVs; physicalize remaining tool icons; real integrated-GPU benchmark. No design-doc changes or commits.
