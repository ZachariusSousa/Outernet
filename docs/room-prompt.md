# New York penthouse: image prompts (W0)

The room is built from parts so it's easy to change: a **city backdrop**, an **empty room shell**, and **sprite sheets** of furniture and decor. String lights, fairy lights and the LED strip are drawn by code, so don't ask for them.

Generate with any image tool (ChatGPT image generation works well). For the sprite sheets, attach the shell image as the style reference so everything matches. Save the picks in `docs/look-refs/` and record the tool and prompts in `world/art/nyc/CREDITS.md`.

Magenta `#FF00FF` means "transparent": the page cuts it out.

## 1. City backdrop (new chat, wide 16:9)

```text
Pixel art night cityscape of Midtown New York in falling snow, wide panorama, seen from high up at a slight downward angle (as if from a penthouse roof). Many skyscrapers at different distances: near ones darker and sharper, far ones hazy and blue. Warm and some cool lit windows, rooftop water towers, red antenna lights, the Empire State Building glowing in the distance, a lit bridge and river far away, snow on every rooftop. Dark blue sky with a soft city glow at the horizon. Leave the lower middle of the image a little less busy (a building will sit in front of it there). Clean crisp pixels, limited palette, no dithering, no text, no people. Cozy lofi mood.
```

## 2. Empty room shell (new chat, attach the current room as style reference, landscape 4:3)

```text
Use the attached image as the style reference: same isometric pixel art style, palette and warm wood and cream materials. Draw an EMPTY penthouse shell: architecture only, with no furniture, no rugs, no decor, no plants, no lamps and no lights.

- The apartment is L-shaped, wrapping around a roof terrace in the inside corner of the L. The terrace is an empty snowy deck with a glass railing (no furniture).
- One outer corner of the window wall is a curved floor-to-ceiling glass corner.
- The living area is sunken two steps down, with visible low steps on every side.
- Warm wood floor, smooth cream solid walls with a dark baseboard, dark window frames and mullions.
- The penthouse sits on the roof of a tall skyscraper whose top floors step back in tiers (Art Deco setbacks), dark stone with a few warm lit windows, continuing to the bottom edge of the image.
- Every window pane and the whole background around the building are solid flat magenta #FF00FF (nothing visible through the glass).

Classic 2:1 isometric angle, near walls removed so the whole interior is visible. Soft even light from the upper left. Clean crisp pixels, limited palette, smooth flat walls and floor (no blotchy texture), no dithering, no text, no people, no animals.
```

## 3. Sprite sheets (attach the shell as style reference, one chat per sheet, square image)

Use this header for every sheet, then add the list for that sheet:

```text
Isometric pixel art sprite sheet in exactly the style, palette, isometric angle and pixel size of the attached room. Each object drawn separately, fully visible, not touching any other object, with generous solid flat magenta #FF00FF space between and around them; the whole background is #FF00FF. Objects are sized to fit that room. Soft even light from the upper left, no cast shadows on the background, no text, no people, no animals, no dithering.

Objects:
```

**Sheet A: living area**
```text
a cream L-shaped sectional sofa with cushions and a throw; a low wooden coffee table with a board game and two mugs; a large soft rug (seen flat from above, isometric); a smaller round rug; two beanbags; floor cushions; a wall-mounted TV; a long low glowing fireplace unit; a cushioned window seat with a blanket; a rattan egg chair hanging from a ceiling hook.
```

**Sheet B: kitchen and work**
```text
a kitchen island with a stone top; two bar stools; a coffee corner counter with a kettle and open shelves of mugs; tall dark kitchen cabinets with a fridge; a desk with two monitors and a keyboard; a gaming chair; a tall bookshelf full of books.
```

**Sheet C: decor**
```text
a big monstera in a pot; a trailing pothos in a hanging pot; three small potted plants; two warm floor lamps; a table lamp; a record player on a low cabinet; a small crate of vinyl records; a guitar leaning; three framed posters without text; a small pink neon crescent-moon sign.
```

**Sheet D: terrace**
```text
two terrace loungers with snow on them; a small round fire pit; a tall patio heater; three snowy planters with little pine trees; a small snowman.
```

## Tips
- Check that every object is fully separate on magenta; touching objects get cut as one sprite.
- If an object comes out at the wrong size, that's fine: sprites can be rescaled by whole steps.
- Regenerate any sheet whose style drifts from the shell (different outline weight, palette or angle).
