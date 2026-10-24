# Room image prompt (New York penthouse, W0)

Generate with any image tool (ChatGPT image generation works well). Ask for a **landscape 4:3** image. Generate a few, pick the best, then clean it:

```
python world/tools/pixel_clean.py input.png world/art/nyc/room.png
```

Record the tool and the final prompt in `world/art/nyc/CREDITS.md`.

## Prompt

```text
Isometric pixel art, cozy cutaway room, in the style of hand-drawn isometric pixel art rooms: two walls and the floor visible, the two near walls removed, the room floating on a plain dark navy background. Clean crisp pixels, a limited warm palette, soft pixel shading, no dithering, no blur, no text, no people, no characters, no animals.

The room: a college student's dream penthouse apartment in Midtown New York at night, one open floor, modern and minimal but lived in and cozy. Warm wood floor. On the back wall, a big floor-to-ceiling window showing a snowy night city: dark blue sky, glowing skyscrapers with warm lit windows, a hint of the Empire State Building, snow falling. A thin purple RGB LED strip along the top of the walls and behind the TV.

Furniture, arranged with walking space between pieces: a big cream L-shaped sectional with cushions and a knitted throw, a low wooden coffee table with a board game and two mugs, two beanbags, a wall TV on a low media unit with a game console, a small kitchen corner with an island and two stools, a desk with two monitors and a gaming chair by the window, a tall bookshelf, several leafy plants, two warm floor lamps and a table lamp. Small lived-in clutter: a controller on the sofa, books stacked unevenly, a hoodie on the chair, a rug.

On one side, a small snowy balcony through a glass door, with string lights and a little potted pine.

Mood: warm amber lamp light inside against cool blue night outside, lofi, calm, nostalgic.
```

## Tips
- If people or creatures appear, regenerate; the room must be empty (agents are drawn live).
- Keep the floor area open; agents need room to walk between the sofa, table, kitchen and desk.
- If the pixels come out soft or uneven, that's fine: `pixel_clean.py` fixes the grid. If they come out very large (chunky), ask for "more detailed, smaller pixels".
