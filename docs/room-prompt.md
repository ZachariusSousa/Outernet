# New York living room: image prompts (W0)

Target: the **mood** of `docs/look-refs/ref-lofi-neon-room.png`, drawn as an **isometric pixel cutaway** like `ref-iso-pixel-room.png`. The room is one furnished image with see-through windows and surroundings, in front of a separate city backdrop. The neon sign is drawn by code (owner picks color and word), so leave a blank wall for it.

Generate with any image tool (ChatGPT image generation works well). Attach both references. Save the picks in `docs/look-refs/` and record the tool and prompts in `world/art/nyc/CREDITS.md`. Magenta `#FF00FF` means "transparent".

## 1. The living room (new chat, attach ref-lofi-neon-room.png and ref-iso-pixel-room.png, landscape 4:3)

```text
Isometric pixel art cutaway room, in the view and pixel style of the second attached image (classic 2:1 isometric, two back walls and the floor, the near walls removed), with the mood, colors and lighting of the first attached image (a dark cozy lofi living room at night with neon and a fireplace).

A dark, cozy, lived-in living room high up in a New York apartment tower, at night in winter. Not luxury: worn, warm, a bit messy.
- The two back walls are mostly floor-to-ceiling windows with dark frames, except one solid wall section with a fireplace (low warm fire) and a plain empty patch of wall above it for a sign (leave it blank).
- A TV on a low cabinet beside the fireplace; shelves with books, records, plants and a record player.
- A big worn sofa and an armchair facing a low wooden coffee table on a patterned rug, with two mugs, a candle and a board game; floor cushions and a beanbag; a side table with a small warm lamp; a tea tray with a kettle.
- A small desk by the windows with a laptop and a desk lamp; a big leafy plant; a hanging pothos.
- Clear open floor between the sofa, the table, the windows and the fireplace.
- Below the floor, a thin slice of the tower's dark stone facade with a few warm lit windows, fading down into darkness.

Lights low, late at night: the room mostly in deep blue-purple shadow, lit by the fire, the lamp, the laptop and the TV glow. Soft warm pools of light, dark corners, muted colors, calm and nostalgic.

Every window pane and the whole background around the room and tower are solid flat magenta #FF00FF, perfectly flat with no pink tint on the frames (the city will be added behind).

Clean crisp pixels, limited palette, no dithering, no text, no people, no animals.
```

If it comes out cluttered, drop the board game, then the beanbag. Keep the fireplace with the blank wall above it, the sofa and table, the desk by the windows and the open floor.

## 2. City backdrop (new chat, wide 16:9)

```text
Pixel art night cityscape of Midtown New York in falling snow, seen from high up at a slight downward angle, as if floating beside a tall apartment tower: skyscrapers all around at different distances, near ones darker with warm and some cool lit windows, far ones hazy and blue, rooftop water towers on lower buildings, red antenna lights, the Empire State Building glowing in the distance, faint street glow far below. Deep blue-purple night sky. Snow on every ledge. Leave the middle of the image calm and darker (a building will sit in front of it there). Clean crisp pixels, limited palette, muted lofi colors, no dithering, no text, no people.
```

## 3. Small decor sheet (attach the chosen room as style reference, square image)

```text
Isometric pixel art sprite sheet in exactly the style, palette, isometric angle and pixel size of the attached room. Small objects only, each drawn separately and fully visible, not touching any other object, with generous solid flat magenta #FF00FF space between them; the whole background is #FF00FF. No shadows on the background, no text, no people, no animals, no dithering.

Objects: three small potted plants of different kinds, a trailing pothos in a hanging pot, two posters without text, a stack of three books, two mugs (one steaming), a small crate of vinyl records, a cushion, a folded blanket.
```

## Tips
- Regenerate if people or animals appear; agents are drawn live.
- To change one thing later, reply in the same chat: "same image, only change X".
- Send the chosen room to Claude first: Claude will paste room-lit creatures onto it to check the feel before Codex builds.
