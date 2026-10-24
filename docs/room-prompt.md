# New York living room: image prompts (W0)

Target: `docs/look-refs/ref-lofi-neon-room.png`, but as **lofi pixel art**, seen from inside at eye level. The room is one furnished image with see-through windows onto a separate city backdrop. The neon sign is drawn by code (owner picks color and word), so leave a blank wall for it.

Generate with any image tool (ChatGPT image generation works well). Attach `ref-lofi-neon-room.png` as the mood and composition reference. Save the picks in `docs/look-refs/` and record the tool and prompts in `world/art/nyc/CREDITS.md`. Magenta `#FF00FF` means "transparent".

## 1. The living room (new chat, attach ref-lofi-neon-room.png, landscape 16:9)

```text
Lofi pixel art, like a pixel art lofi stream background. Use the attached image for mood, composition and lighting, but make it detailed pixel art with clean crisp pixels.

A dark, cozy, lived-in living room high up in a New York apartment at night, seen from inside at eye level, the camera slightly raised and looking toward a wall of floor-to-ceiling windows. Not luxury: worn, warm, a bit messy.

- Back wall: floor-to-ceiling windows with dark frames.
- Left side: a fireplace with a low warm fire, a TV beside it on a low cabinet, shelves with books, records, plants and a record player.
- Front and middle: a big worn sofa and an armchair facing a low wooden coffee table on a patterned rug, with two mugs, a candle and a board game; floor cushions and a beanbag; a side table with a small warm lamp; a tea tray with a kettle.
- Right side: a small desk by the window with a laptop and a desk lamp, and a big leafy plant.
- A plain empty wall area on the upper left for a sign (leave it blank).
- Leave clear open floor between the sofa, the table, the window and the fireplace.

Lights low, late at night: the room mostly in deep blue-purple shadow, lit by the fire, the lamp, the laptop and the TV glow. Soft warm pools of light, dark corners, muted colors, calm and nostalgic.

Every window pane is solid flat magenta #FF00FF, perfectly flat with no pink tint on the frames (the city will be added behind it).

Clean crisp pixels, limited palette, no dithering, no text, no people, no animals.
```

If it comes out cluttered, drop the board game, then the beanbag. Keep the fireplace, the sofa and table, the desk by the window and the open floor.

## 2. City backdrop (new chat, wide 16:9)

```text
Pixel art night cityscape of Midtown New York in falling snow, as seen through a high apartment window at eye level: skyscrapers across the street and beyond at different distances, near ones darker with warm and some cool lit windows, far ones hazy and blue, rooftop water towers on lower buildings, red antenna lights, the Empire State Building glowing in the distance, a faint glow of street lights far below. Deep blue-purple night sky. Snow falling and on every ledge. Clean crisp pixels, limited palette, muted lofi colors, no dithering, no text, no people.
```

## 3. Small decor sheet (attach the chosen room as style reference, square image)

```text
Pixel art sprite sheet in exactly the style, palette and pixel size of the attached room, same eye-level view. Small objects only, each drawn separately and fully visible, not touching any other object, with generous solid flat magenta #FF00FF space between them; the whole background is #FF00FF. No shadows on the background, no text, no people, no animals, no dithering.

Objects: three small potted plants of different kinds, a trailing pothos in a hanging pot, two posters without text, a stack of three books, two mugs (one steaming), a small crate of vinyl records, a cushion, a folded blanket.
```

## Tips
- Regenerate if people or animals appear; agents are drawn live.
- To change one thing later, reply in the same chat: "same image, only change X".
