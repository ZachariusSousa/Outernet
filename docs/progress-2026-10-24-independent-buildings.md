# Independent city sprites — 2026-10-24

Zach asked for individually generated, movable buildings rather than a painted city backdrop. Generated three separate transparent illustrations with the built-in imagegen tool: Art Deco setbacks/spire, dark glass/slanted crown, and brick/fire escape/water tank. Exact prompts and original outputs are saved in world/art/nyc/sources/buildings/; cleaned sprites and metadata are in sprites/manifest.json. Nine independently positioned, mirrored and integer-scaled instances surround the room closely. No neighboring towers remain baked into the active backdrop: sky-river.png contains only flat sky and river shapes. The old backdrop is retained.

The City layer sorts buildings against each other by base line before drawing the shell. Window holes show the actual sprites; indoor agents/furniture retain their own depth sorting. Local amber window pixels twinkle without adding rectangles outside buildings. Placement has a City buildings filter, City layer selector and palette auto-layering. Visible opaque parts can be dragged even when a large tower's center lies outside the image. Flip, duplicate, add/remove and layout JSON export reuse existing controls. The room and furniture remain clearly labeled placeholders; replacing their art is separate work.

Verification: check_city_sprites.mjs passes real browser dragging of a clipped neighbor, flipping, adding/removing a building and exporting its modified position. Nine instances, three designs, twelve agents, zero console errors. check_layers_v2.mjs replays all 529 events at 1x/4x/16x with zero overlapping agents and no console errors; depth, steps, attached spots, lights, card/follow and plane checks pass. Sprite pipeline validates all 45 assets. Production build passes. No commits or design-doc edits.

Screenshots: w0-city-sprites-fit.png, w0-city-sprites-fit-plus-2.png, w0-city-sprites-placement.png. Structured browser results: w0-city-sprites-check.json and w0-modular-v2-check.json.

## W0 checklist status

| Spec item | Status / evidence |
|---|---|
| Deterministic fake log / contract check | Previously passed; generator unchanged; earlier generator-check JSON retained. |
| Playback complete at 1x / 4x / 16x | Pass, 529/529 each in browser regression. |
| Integer scale, letterbox, crisp rendering | Pass, fit 2x and fit+2 4x screenshots. |
| Cleanup and sprite cutting | Pass pipeline; 45 trimmed assets, no magenta leakage. Buildings use transparent single-image import, not sheet cutting. |
| Twelve creatures, species/tints, no overlaps | Pass existing sprite implementation and replay spacing check; natural object occlusion remains. |
| Base-line depth with furniture | Pass sampled sofa depth test; city sorts separately behind shell. |
| Independent furniture/decor placement | Pass regression; extended to independent buildings with actual UI checks. |
| Transparent panes/surroundings reveal city | Pass alpha checks and screenshots. |
| Editable code-drawn light lines | Pass regression, unchanged. |
| Event animation table and resting behavior | Existing implementation retained; full replay exercises effects; no new behavior added. |
| Plane destinations, decline, latency | Pass regression (200 ms produces 3.5 s flight). |
| Flicker, snow, RGB customization | Pass regression; city window twinkle now follows each sprite. |
| Busy stretch within about five seconds | Pass, maximum pending walk below 5.1 s. |
| Agent card and follow | Pass regression. |
| Unknown fields/events ignored | Pass regression. |
| Look configuration and placement export | Pass; city visual colors/twinkle in look.js, coordinates in layout.json; export checked. |
| README | Updated with building placement, sources and reimport command. |
| Screenshots and progress note | Pass, files listed above. |

Visual completion is still partial: the outdoor building art is real; shell/furniture are placeholders. The performance target is not a measured guarantee across hardware.
