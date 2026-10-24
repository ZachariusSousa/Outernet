# New York penthouse: image prompts (W0)

The room is **one furnished image on its tower** (so composition and lighting stay coherent), in front of a **city backdrop**, plus a small sheet of **swappable decor**. String lights, fairy lights and the LED strip are drawn by code, so don't ask for them.

Generate with any image tool (ChatGPT image generation works well). Save the picks in `docs/look-refs/` and record the tool and prompts in `world/art/nyc/CREDITS.md`. Magenta `#FF00FF` means "transparent": the page cuts it out.

Style reference to attach: `docs/look-refs/room-v1-good.png` (the first room, the one that looked right).

## 1. City backdrop (new chat, wide 16:9)

```text
Pixel art night cityscape of Midtown New York in falling snow, wide panorama, seen from high up at a slight downward angle (as if from a penthouse roof). Many skyscrapers at different distances: near ones darker and sharper, far ones hazy and blue. Warm and some cool lit windows, rooftop water towers, red antenna lights, the Empire State Building glowing in the distance, a lit bridge and river far away, snow on every rooftop. Dark blue sky with a soft city glow at the horizon. Leave the lower middle of the image a little less busy (a building will sit in front of it there). Clean crisp pixels, limited palette, no dithering, no text, no people. Cozy lofi mood.
```

## 2. The furnished room on its tower (new chat, attach room-v1-good.png, landscape 4:3)

```text
Use the attached image as the style reference: same isometric pixel art style, pixel size, palette, furniture style and warm lighting. Draw a new, cozier version of this penthouse.

Shape:
- The apartment is L-shaped, wrapping around a snowy roof terrace in the inside corner of the L.
- One outer corner of the window wall is a curved floor-to-ceiling glass corner.
- The living area is sunken two steps down, with visible low steps on every side.
- Furniture is grouped into cozy zones that fill the room, with clear walking paths between zones (not one big empty floor).

Zones:
- Sunken living area: a cream L-shaped sectional with cushions and throws, two overlapping rugs, floor cushions, a low coffee table with a board game and two mugs, facing a wall TV over a long, low glowing fireplace.
- Window corner: a cushioned window seat in the curved glass with a blanket, and a rattan egg chair hanging beside it.
- Kitchen (one arm of the L): an island with two stools, tall dark cabinets with a fridge, and a little coffee corner with a kettle and open shelves of mugs.
- Desk nook by the glass: a desk with two monitors and a gaming chair.
- Along the solid walls: a tall bookshelf, a record player on a low cabinet, a guitar leaning on the wall, framed posters without text, a big monstera, two beanbags and warm floor lamps casting soft pools of light.
- Terrace: a glass railing, snowy planters with little pines, two loungers, a small round fire pit and a tall glowing patio heater.

Building and background:
- The penthouse sits on the roof of a tall skyscraper whose top floors step back in tiers (Art Deco setbacks), dark stone with a few warm lit windows, continuing to the bottom edge of the image.
- Every window pane and the whole background around the building are solid flat magenta #FF00FF (nothing visible through the glass).

Classic 2:1 isometric angle, near walls removed so the whole interior is visible. Warm amber lamp light inside, with soft light pools and darker corners. Clean crisp pixels, limited palette, smooth walls and floor (no blotchy texture), no dithering, no text, no people, no animals, no string lights or LED strips.
```

If it comes out cluttered, drop in this order: guitar, egg chair, patio heater. Keep the sunken living area, fireplace, window seat and the L-shape with the terrace.

## 3. Small decor sheet (attach the chosen room as style reference, square image)

```text
Isometric pixel art sprite sheet in exactly the style, palette, isometric angle and pixel size of the attached room. Small objects only, each drawn separately and fully visible, not touching any other object, with generous solid flat magenta #FF00FF space between them; the whole background is #FF00FF. Soft even light from the upper left, no shadows on the background, no text, no people, no animals, no dithering.

Objects: three small potted plants of different kinds, a trailing pothos in a hanging pot, two framed posters without text, a stack of three books, two mugs (one steaming), a small crate of vinyl records, a cushion, a folded blanket, a small snowman.
```

## Tips
- Regenerate if people or animals appear; agents are drawn live.
- To change a big piece later, reply in the same chat: "same image, but replace the X with Y".
