# NYC HD-2D — step 1, 2026-10-24

Built the live Three.js penthouse/terrace review, replacing the active pre-render/Canvas view. Existing log/parser/card/dispatch source is preserved as src/legacy-playback.js and its settings as legacy-look.js for phase 3; fake_log.py unchanged. Blender files/outputs retained as evidence but no longer used by the page.

One module per object type under src/scene/nyc; common mesh/texture helper and per-type geometry data in look.js. 41 layout instances, 170 meshes. Six point lights, one shadow caster, emissive screen/LED/bulb textures, bloom, depth-of-field focus blur, distance fog and live snow. Near/far scroll and spring-back limited orbit. Snow cover on terrace/railings/loungers/pines, transparent glazing, cream sectional, kitchen/island/stools, desk/monitors, game table, beanbags, bookshelf, plants and lamps. All textures are original clean procedural CC0 stand-ins, listed in art/textures/textures.json. No external pack or concept-image pixels used in scene assets.

Verification: production build passed. Playwright audit confirmed mapped materials all nearest-neighbor with no mipmaps and exactly one shadow light. pixel_clean.py exercised at 32×32, output docs/pixel-clean-check.png. Browser screenshot reviewed; comparison docs/hd2d-concept-comparison.png. Full look still awaits real textures; geometry is deliberately simple. No integrated-GPU 60fps claim; headless screenshot is not a performance measurement.

Scope gate: stop at step 1 for review. Towers/street/city life (step 2), creatures/playback/spot placement/card integration (step 3) are not active. The final W0 checklist is therefore deferred. Remaining visual details: more shaped snow piles, terrace string-wire sag, less generic foliage and physically arranged chairs, detailed TV console/controller textures. Post uses Bokeh depth-of-field rather than a literal screen-space tilt-shift band. Look.js controls renderer/camera/material palette/light/post settings and object parts; some inherited UI spacing and texture-generation pattern coordinates remain literal.

No design-doc edits or commits.
