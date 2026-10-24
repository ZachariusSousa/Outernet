"""Clean a magenta sheet at the shell's pixel scale, then cut connected sprites.

Names correspond to regions ordered by top edge, then left edge. Use a names JSON
array, or omit it for deterministic sheet-001 names. Floating disconnected pieces
are separate regions: this tool never guesses which pieces belong together.
"""
import argparse
from collections import deque
import json
from pathlib import Path
import re
from PIL import Image
from pixel_clean import clean

KEY = (255, 0, 255)


def key_to_alpha(image):
    image = image.convert('RGBA')
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            if pixels[x, y][:3] == KEY:
                pixels[x, y] = (0, 0, 0, 0)
    return image


def components(image, min_area=1):
    image = key_to_alpha(image)
    pixels = image.load()
    visited = set()
    regions = []
    for y in range(image.height):
        for x in range(image.width):
            if (x, y) in visited or pixels[x, y][3] == 0:
                continue
            queue = deque([(x, y)])
            visited.add((x, y))
            points = []
            while queue:
                px, py = queue.popleft()
                points.append((px, py))
                for dx, dy in [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]:
                    nx, ny = px + dx, py + dy
                    if 0 <= nx < image.width and 0 <= ny < image.height and (nx, ny) not in visited and pixels[nx, ny][3]:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
            if len(points) >= min_area:
                xs, ys = zip(*points)
                regions.append((min(xs), min(ys), max(xs) + 1, max(ys) + 1, points))
    return image, sorted(regions, key=lambda r: (r[1], r[0]))


def cut(source, output, pixel_scale, names=None, min_area=1, shell=False, baselines=None):
    """pixel_scale is source pixels per art pixel, shared with shell/backdrop.

    Never fit individual objects to arbitrary sizes; only whole-sheet scale is
    reduced. --shell performs the same cleanup/key removal without cutting.
    """
    source, output = Path(source), Path(output)
    if pixel_scale < 1:
        raise ValueError('Source pixel scale must be >= 1')
    with Image.open(source) as raw:
        if raw.width % pixel_scale or raw.height % pixel_scale:
            raise ValueError('Sheet dimensions must be divisible by the shared pixel scale')
        size = (raw.width // pixel_scale, raw.height // pixel_scale)
    output.parent.mkdir(parents=True, exist_ok=True)
    if shell:
        clean(source, output, size, pixel_scale, key_color='#FF00FF')
        image = key_to_alpha(Image.open(output))
        image.save(output)
        return {'shell': str(output), 'size': list(image.size)}
    output.mkdir(exist_ok=True)
    cleaned = output / '_sheets' / (source.stem + '.png')
    clean(source, cleaned, size, pixel_scale, key_color='#FF00FF')
    image, regions = components(Image.open(cleaned), min_area)
    if names is not None and len(names) != len(regions):
        raise ValueError(f'{len(names)} names but {len(regions)} regions; inspect {cleaned}. No sprites written.')
    prefix = re.sub(r'[^a-zA-Z0-9_-]+', '-', source.stem).strip('-') or 'sheet'
    names = names or [f'{prefix}-{i+1:03}' for i in range(len(regions))]
    if len(set(names)) != len(names) or any(not re.fullmatch(r'[a-zA-Z0-9_-]+', n) for n in names):
        raise ValueError('Names must be unique filenames using letters, numbers, _ or -')
    manifest_file = output / 'manifest.json'
    manifest = json.loads(manifest_file.read_text()) if manifest_file.exists() else {'version': 1, 'pixelScale': pixel_scale, 'sheets': {}, 'sprites': {}}
    if manifest['pixelScale'] != pixel_scale:
        raise ValueError('Use the same source pixel scale as the existing shell and sprite manifest')
    # Retain other sheets; replace only this sheet's manifest entries on rerun.
    manifest['sprites'] = {n: s for n, s in manifest['sprites'].items() if s.get('sheet') != source.name}
    collisions = set(names) & set(manifest['sprites'])
    if collisions:
        raise ValueError(f'Names already used by another sheet: {sorted(collisions)}')
    for name, (x0, y0, x1, y1, points) in zip(names, regions):
        sprite = Image.new('RGBA', (x1 - x0, y1 - y0))
        target = sprite.load()
        for x, y in points:
            target[x - x0, y - y0] = image.getpixel((x, y))
        sprite.save(output / (name + '.png'))
        baseline = (baselines or {}).get(name, sprite.height)
        if not isinstance(baseline, int) or not 0 <= baseline <= sprite.height:
            raise ValueError(f'Invalid base line for {name}')
        manifest['sprites'][name] = {'file': name + '.png', 'size': list(sprite.size), 'width': sprite.width, 'height': sprite.height, 'baseLine': baseline, 'sheet': source.name, 'bounds': [x0, y0, x1, y1]}
    manifest['sheets'][source.name] = {'sourceSize': [size[0] * pixel_scale, size[1] * pixel_scale], 'artSize': list(size), 'cleaned': str(cleaned.relative_to(output)).replace('\\', '/'), 'names': names}
    manifest_file.write_text(json.dumps(manifest, indent=2))
    return {'sprites': names, 'manifest': str(manifest_file), 'pixelScale': pixel_scale}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input')
    parser.add_argument('--out', default=str(Path(__file__).resolve().parents[1] / 'art/nyc/sprites'))
    parser.add_argument('--pixel-scale', type=int, required=True, help='Same source pixels per art pixel as the shell')
    parser.add_argument('--names', help='JSON array of region names in top/left order')
    parser.add_argument('--baselines', help='Optional JSON object overriding base lines in trimmed art pixels')
    parser.add_argument('--min-area', type=int, default=1)
    parser.add_argument('--shell', action='store_true', help='Output a keyed shell PNG instead of sprites')
    args = parser.parse_args()
    print(json.dumps(cut(args.input, args.out, args.pixel_scale, json.loads(Path(args.names).read_text(encoding='utf-8-sig')) if args.names else None, args.min_area, args.shell, json.loads(Path(args.baselines).read_text(encoding='utf-8-sig')) if args.baselines else None)))
