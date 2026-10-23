# Cabin look pass — 2026-10-23

Implemented low-resolution render target, nearest upscale, toon ramp, depth/normal edges, light patterned dithering, vignette, warmer palette, tight fireside framing, warm lamp pools, fire-only shadows, rounded furniture, log walls, chunky bunk partitions, woodpile, fairy lights, larger chibi heads, blush, squash motion and idle control fading. Playback and card logic retained.

Screenshots are in docs/look-pass, numbered by stage. Browser captures used local Playwright with Edge; production build checked. No commit or design-doc edits.

## Added settings
- pixel.height: offscreen resolution; bands: toon steps; edge/depthThreshold/normalThreshold: outlines; dither: pattern strength; vignette: edge falloff; levels: channel quantization.
- palette.allowed: requested color reference; palette aliases/tints updated. The final shader currently quantizes channels, not nearest-palette colors.
- camera.focus and revised zoom/min: fireside framing.
- composition: intended room scale and night gradient colors (not yet wired).
- lamps.floor/pendant/desk: position, intensity, range, color; bunk is configured but not yet wired.
- craft: bevel and segments, log radius/spacing, shade and pole dimensions; lean is reserved and not yet applied.
- character: scale, blush, mouth width, bob amount/speed; blink settings reserved, not implemented yet.
- ui.fadeDelay/idleOpacity/fadeSeconds: control fade timing.

## Still incomplete against requested pass
Emissive-only glow, palette mapping/Bayer matrix, SSAO, ACES grade, background gradient, physical room compression, bunk point lights, prop imperfections, layered window/moon/parallax, species-specific finishing and blink/plane-facing behavior remain. Some new geometry values are still inline. Integrated-GPU 60fps is unverified. This is a partial visual pass, not full completion of A–H.
