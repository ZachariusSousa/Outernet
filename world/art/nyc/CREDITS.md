# W0 modular art

The original procedural shell and four furniture sheets, authored for OuterNet with Pillow by world/tools/build_modular_placeholder.py, are retained as source/history. The active shell and all 42 furniture/decor sprites have been replaced with generated artwork (see below). The earlier generated room is retained separately under modular-v1/. The original placeholder backdrop is retained as backdrop.png; the page uses sky-river.png with independent building sprites.

Source sheets and key shell are saved under sources/. All use the same 4 source pixels per art pixel, passed through pixel_clean.py with #FF00FF preserved, then sprite_cut.py. Replace them with Zach's selected images from docs/look-refs/ using the unchanged prompts in docs/room-prompt.md; record his actual image tool and prompts here when supplied.

Approved creature sprites and project-authored props/planes are unchanged.

## Independent city buildings — 2026-10-24

Generated using the built-in OpenAI imagegen tool, one separate generation per building: `tower-art-deco.png`, `tower-glass.png`, `tower-brick-water.png`. These are project-generated illustrations, not third-party stock or claimed CC0 assets. Exact prompts and intended art sizes: [sources/buildings/prompts.json](sources/buildings/prompts.json).

Unmodified generator outputs are preserved as `sources/buildings/*-original.png`. `world/tools/import_city.py` applies `pixel_clean.py`: nearest-neighbor sampling, the look.js palette, no dithering, binary alpha at 128, and transparent trim. Clean 4x edit references are also retained in that directory. Manifest entries record sizes, base lines, source paths and local window-twinkle pixels. Nine layout instances reuse these three assets; no neighboring buildings are baked into a panorama. Sky and river are simple project-authored flat color bands from look.city.

## Room and furniture replacement — 2026-10-24

Generated with the built-in OpenAI imagegen tool: an architecture-only shell edit plus four gridded sheets (living, kitchen/work, decor, terrace). Exact sheet prompts and object names: `sources/room-v2/prompts.json`. Exact shell prompt: `sources/room-v2/shell-prompt.txt`; references were the original shell geometry and docs/look-refs/ref-iso-pixel-room.png for style only. Unmodified originals are retained in that directory. These are project-generated illustrations, not externally licensed stock.

`world/tools/import_room_art.py` removes magenta, groups connected silhouettes by their sheet cell, preserves disconnected details belonging to the same cell, applies nearest-neighbor sizing and the look.js palette without dithering, and trims transparent pixels. All 42 manifest keys now point to individual `*-v2.png` sprites. Existing instance centers/base lines are preserved on import; placement still owns every object independently. The active shell is `shell-v2.png`, with transparent windows/surroundings. Original placeholder sprites and their manifest snapshot are retained.

At Zach's request, the pointed Empire State-style tower was removed from the active manifest and all layout instances. Its original generated files remain as history. The nine active neighboring buildings now reuse only the glass and brick/water-tank designs. Approved creature art is unchanged.
