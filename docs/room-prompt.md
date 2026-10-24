# New York rooftop studio: image prompts (W0)

The room is **one furnished image on its building** (so composition and lighting stay coherent), in front of a **city backdrop**, plus a small sheet of **swappable decor**. String lights, fairy lights and the LED strip are drawn by code, so don't ask for them as separate things.

Generate with any image tool (ChatGPT image generation works well). Save the picks in `docs/look-refs/` and record the tool and prompts in `world/art/nyc/CREDITS.md`. Magenta `#FF00FF` means "transparent": the page cuts it out.

Style reference to attach: `docs/look-refs/penthouse-night-attempt.webp` (right pixel style and night lighting, wrong place).

Why not a penthouse: it read as luxury and showroom. Lofi is small, lived-in and a bit messy, with the city huge outside.

## 1. City backdrop (new chat, wide 16:9)

```text
Pixel art night cityscape of Midtown New York in falling snow, seen from the roof of a low old brick building: tall glowing skyscrapers rise all around and above the viewer, near ones dark and towering, far ones hazy and blue. Warm and some cool lit windows, rooftop water towers on the lower buildings nearby, red antenna lights, the Empire State Building glowing above the others, snow on every ledge. Deep blue-purple night sky with a soft city glow. Leave the lower middle of the image calm and a bit dark (a small rooftop studio will sit in front of it there). Clean crisp pixels, limited palette, muted lofi colors, no dithering, no text, no people.
```

## 2. The rooftop studio (new chat, attach the style reference, landscape 4:3)

```text
Use the attached image as the style reference for the pixel art style, pixel size, palette and the low night lighting, but draw a completely different, much smaller place:

A small, cozy, lived-in studio built on the roof of an old 7-storey New York brick building, at night in winter. Isometric cutaway, classic 2:1 angle, near walls removed so the whole studio is visible. The view is close: the studio and its roof deck fill about 75% of the image width, with only the top floor of the brick building below them.

Inside the studio (small, a little messy, warm):
- a big arched old factory window on the back wall, with a radiator under it;
- a desk by the window with a laptop, a small monitor, a desk lamp, a mug and scattered papers;
- a daybed in a nook, piled with blankets and pillows;
- a worn sofa and floor cushions around a low table with a board game and two mugs;
- a bookshelf crammed with books, a record player on a low cabinet with a crate of vinyl;
- a tea corner: a kettle and mugs on a small cabinet (no kitchen);
- plants on every ledge, a hanging pothos, posters without text, two overlapping rugs, a guitar.

Outside the door: a small snowy roof deck on the tar roof, with an old wooden water tower on legs, two worn chairs around a small fire pit, vent pipes and a chimney with snow on them.

Lights low, late at night: the room mostly in deep blue-purple shadow, lit by a warm desk lamp, the laptop screen, a small table lamp and the fire pit outside. Soft warm pools of light, dark corners, muted colors. Lofi, calm, nostalgic.

The window panes and the whole background around the building are solid flat magenta #FF00FF, perfectly flat, with no pink tint on edges.

Clean crisp pixels, limited palette, no dithering, no text, no people, no animals.
```

If it comes out cluttered, drop in this order: guitar, then the second rug, then the board game. Keep the arched window, the desk by it, the daybed, the tea corner and the roof deck with the water tower.

## 3. Small decor sheet (attach the chosen studio as style reference, square image)

```text
Isometric pixel art sprite sheet in exactly the style, palette, isometric angle and pixel size of the attached room. Small objects only, each drawn separately and fully visible, not touching any other object, with generous solid flat magenta #FF00FF space between them; the whole background is #FF00FF. Soft even light from the upper left, no shadows on the background, no text, no people, no animals, no dithering.

Objects: three small potted plants of different kinds, a trailing pothos in a hanging pot, two posters without text, a stack of three books, two mugs (one steaming), a small crate of vinyl records, a cushion, a folded blanket, a small snowman.
```

## Tips
- Regenerate if people or animals appear; agents are drawn live.
- To change one thing later, reply in the same chat: "same image, only change X".
