# Room art replacement — 2026-10-24

Removed the Empire State-like pointed tower from every active instance and from the sprite palette. Source files remain preserved. Nine separately movable neighboring buildings now use the glass and brick/water-tank designs.

Replaced the architecture shell and all 42 placeholder furniture/decor sprite assets with built-in imagegen artwork: living furniture, kitchen/work furniture, plants/lamps/music/art, and snowy terrace pieces. Originals and exact prompts are in world/art/nyc/sources/room-v2/. Shell geometry was supplied as the edit reference; the approved isometric room image supplied style only. The result retains the cutaway, transparent windows, sunken living floor and snowy terrace. Architecture remains a single shell; every furniture/decor object remains an independent sprite with its existing manifest key. Extra pieces remain available through the palette rather than crowding the walking floor.

Added import_room_art.py for repeatable magenta removal, connected silhouette grouping, palette cleanup and individual sprite export. A component may extend over a sheet-cell boundary without being sliced in half. Imported instances preserve their previous center and base position. No events, playback or agent artwork were rewritten. Original placeholder files are retained. Scene/layout no longer carry the placeholder flag.

Odd-width replacement sprites exposed a placement bug: grabbing a half-pixel center snapped the object by one pixel. Preserving the pointer-to-handle offset fixes the jump. Actual pointer dragging and attached spot movement pass the regression again.

## Verification and W0 checklist

- Fake-log generator unchanged; prior deterministic/contract evidence retained.
- Full 529-event replay passes at 1x, 4x and 16x; zero detected agent overlaps; pending walks stay below 5.1 seconds; no console errors.
- Pixel cleanup/cutting checks pass: 44 active assets (42 furniture/decor plus two building designs), trimmed dimensions and no magenta leakage.
- Sofa depth, window transparency, RGB edits, light-line dragging, floor-step routing, attached spots, unknown events, card/follow and plane destination/latency checks pass using the new art.
- Building drag/flip/add/remove and layout export pass, including dragging a neighbor with its center offscreen. The pointed tower is explicitly checked absent.
- Integer-scaled fit and fit+2 screenshots saved as w0-room-art-v2-fit.png and w0-room-art-v2-fit-plus-2.png; placement screenshot also saved. All twelve agents load and retain the approved species/tints and held-item behavior.
- README, art credits, exact generation prompts and this dated note are present. Visual colors, lighting, weather and animation settings remain in look.js; layout remains editable JSON.
- Production build and git diff whitespace check pass. Design docs unchanged; no commit.

The existing checklist's functional items pass the retained regression suite. This is a first art/layout pass, not a claim of a finished art polish: tiny details soften when reduced to native size, and furniture/spot arrangement can still be adjusted with placement controls. The 60 fps hardware-wide target is not benchmarked.
