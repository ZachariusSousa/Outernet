# Soft HD-2D model pass — 2026-10-24

Read updated spec and retained existing design-doc edits untouched. No commit.

## Work in requested order
1. Connected to the already-open Blender 4.2 through the installed blender-mcp server's execute_blender_code tool. Downloaded official Kenney Furniture Kit 2.0, Car Kit 3.1 and City Kit Suburban 2.0; verified each archive's License.txt is CC0. Preserved source archives, imported selected artist models, applied palette remaps/bevel/weighted normals/soft shading, and exported 38 GLBs. Repeatable scripts and export log are under world/blender/. Every selected model has source URL, author, license and output path in art/models/models.json. Step screenshot: 01-models.png.
2. Large architecture material maps removed. Floor uses linear-filtered parquet; detail maps keep nearest filtering. GLB materials stay smooth/matte, with named palette remaps. Screenshot: 02-materials.png.
3. Seeded per-object offsets/yaw/tilt/scale unless aligned; architecture marked aligned. Real-model books, laptop, office chair and soft snow drifts added. Screenshot: 03-placement.png.
4. SAO, soft contact shadow textures, PCF shadow radius/bias and stronger depth-of-field configured in look.js. First SAO image exposed negative/out-of-range occlusion; intensity reduced and shader clamped to mild darkening. Screenshot: 04-lighting.png.
5. Creature and shared-prop cuboids now use RoundedBoxGeometry at 20% smallest-side radius, three segments. Claude's unit=.01, bodyDepth=56 and partDepth=20 unchanged; SVG shape coordinates retained. Screenshot: 05-creatures.png.
6. Existing explicit CSS canvas sizing retained. DPR-2 resize/wheel checks passed at 1000×700, 1600×900 and 1440×1000: canvas bounds equal viewport in every case. Screenshot: 06-resize.png; results in verification.json.

Final views: final-close.png, final-mid.png, final-far.png and final-sofa.png. Browser page errors: none. Production build and fake-log --check pass. 38 manifest GLB paths/license fields verified.

## Missing/substitute assets
Poly Pizza's CC0-filtered search was attempted through Blender MCP; the add-on reports Poly Pizza switched off / search command unavailable. No unverified or CC-BY assets used. See docs/model-wishlist.md. Beanbags currently use recliners, gaming chair an office chair, fire pit a planter. Hoodie, shoes, mugs, a proper fire bowl and several street furnishings remain unsourced. Those are NOT completed requirements.

## Done when review
| Spec item | Status |
|---|---|
| Deterministic generator + --check | PASS: algorithm unchanged, current --check passes; prior seed equality retained. |
| Full 1×/4×/16× run | NOT RERUN this visual pass; previous integration dispatch checks passed, short current browser playback passes. |
| Twelve distinct creatures, no collisions | PARTIAL: 12 load; chunky silhouettes/tints preserved. New asset seat heights and navigation bounds need further collision fitting. |
| All event animations seen | PARTIAL: behavior preserved; all physical actions not manually reviewed again. |
| Planes/timing/declines | RETAINED, not independently remeasured. |
| Busy-stretch catch-up | RETAINED immediate dispatch/poofs; not retested this pass. |
| Card/raw events/follow | RETAINED; earlier click test passed. |
| Unknown events/fields | RETAINED parser; earlier injection test passed. |
| Every look value centralized | PARTIAL: new softness/imperfection/remap controls are in look.js; inherited geometry/UI constants remain in modules. |
| Modules/layout/placement | PASS for named furniture modules and layout placement; placement functionality retained. |
| All furniture/props/cars from CC0 packs | PARTIAL: 38 verified GLBs replace most furniture, plants, lamps and cabs. Wishlist records missing/substituted assets; simple street fixtures and agent props remain procedural. |
| Detail-only pixel textures; smooth broad surfaces | PASS for material routing; visual result requires review. Cars retain their authored color atlas. |
| Imperfection/clutter/lumpy snow | PARTIAL: seeded variation, book stacks, laptop, chair and drifts added; hoodie/mugs/shoes absent. |
| AO/shadows/rounded creatures | PASS in browser captures; AO clamped, soft contacts added, original chunky depths unchanged. |
| Texture wishlist/cleaner | RETAINED. |
| Concept mood | REVIEW: screenshots supplied, not an objective pass claim. |
| Live far street/close creatures | PASS in current scene; screenshots supplied. |
| RGB recoloring | RETAINED architecture strip material hookup. TV model's authored screen needs the detailed emissive image/decal refit. |
| Rest wandering/activity props | RETAINED; placement/collision fitting around new models needs review. |
| Credits/README | PASS: model manifest/licenses and workflow instructions present. |
| Integrated graphics 60fps | UNVERIFIED; GLB draw calls + SAO require hardware profiling. |
| Screenshots/note | PASS: ordered stage captures plus four final views. |
