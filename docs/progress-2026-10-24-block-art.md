# Locked SVG art — 2026-10-24

Copied the four reference creature shape groups directly from style-test.svg into puppet SVG parts, preserving coordinates/colors (reference ground shadows omitted). Added closed eyes, pivot JSON, SVG cabin layers/furniture, twelve recognizable interest props, three plane kinds, and decor. Reference source unchanged. Scene is 1920x1080. Disabled image smoothing, removed part rotation and squash, snapped small puppet movements, reserved title/footer space, corrected chair/play/home placements. Build and fake-log checker pass; Playwright reported 12 loaded agents and no page errors. No commits or design-doc edits.

## Done when
1. PASS: preserved deterministic generator; current fixture passes --check.
2. NOT VERIFIED: full 1x/4x/16x replay after this art change. Short browser capture passes.
3. PARTIAL: exact species silhouettes and unique props; reserved destinations and cubby spots corrected. No exhaustive overlap test. Home creatures shrink to fit their cubbies.
4. NOT COMPLETE: tool symbols remain; walking currently poofs because shared routes crossed furniture. Physical tool animations remain unfinished.
5. PARTIAL: SVG message art and existing timing formula retained; not measured end to end this pass.
6. PASS by implementation: immediate dispatch and poofs prevent queued walk backlog.
7. PARTIAL: existing card/follow retained; full interaction regression not performed.
8. PASS by inspection: existing unknown-field/event handling unchanged.
9. PARTIAL: new presentation knobs live in look.js; inherited styling constants remain, and artwork geometry is in SVG. Tint currently affects the whole puppet rather than body alone. Some animation/effect positions still interpolate between grid points.
10. PASS by implementation: external SVG assets load by filename and scene.json; placement editor retained. Export roundtrip not retested.
11. PASS: credits and README updated for SVG assets.
12. UNVERIFIED: integrated GPU 60fps.
13. PASS: world-block-full.png and world-block-fireplace.png (a full-resolution crop of the fireplace) saved.

Remaining deviations: routes/walking, complete grid quantization, body-only tint, all-look-values cleanup, legacy fallback PNG artwork for unknown models, detailed animation/checklist verification. Cabin uses some diagonal block-cut polygons rather than strictly stair-stepped contours. This is not full W0 completion.
