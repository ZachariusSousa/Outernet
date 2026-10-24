"""Prepare independent generated building sprites; never rebuild the room or furniture.

python world/tools/import_city.py --name tower-art-deco --source path/to/generated.png
Sizes and exact prompts live in art/nyc/sources/buildings/prompts.json.
"""
import argparse
import json
import shutil
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw
from pixel_clean import clean

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT/'art/nyc'

def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))

def write(path, value):
    path.write_text(json.dumps(value, indent=2)+'\n', encoding='utf-8')

def prepare(name, source):
    specs = read(ART/'sources/buildings/prompts.json')
    spec = next(p for p in specs if p['name'] == name)
    original = ART/'sources/buildings'/f'{name}-original.png'
    if Path(source).resolve() != original.resolve():
        shutil.copy2(source, original)
    destination = ART/'sprites'/f'{name}.png'
    clean(original, destination, size=spec['size'], pixel_size=1, trim=True, alpha_cutoff=128)
    image = Image.open(destination).convert('RGBA')
    image = image.crop(image.getchannel('A').getbbox())
    image.save(destination)
    # Keep the same enlarged source convention as the room/sheets for future edits.
    image.resize((image.width*4, image.height*4), Image.Resampling.NEAREST).save(ART/'sources/buildings'/f'{name}-4x.png')
    # Pick only opaque amber window pixels; twinkle never paints into the sky.
    candidates = []
    for y in range(2, image.height-2, 4):
        for x in range(2, image.width-2, 3):
            r, g, b, a = image.getpixel((x, y))
            if a == 255 and r > 170 and 110 < g < 225 and b < 170:
                candidates.append(dict(x=x, y=y, w=1, h=1))
    manifest = read(ART/'sprites/manifest.json')
    manifest['sprites'][name] = dict(file=destination.name, size=list(image.size), width=image.width,
        height=image.height, baseLine=image.height, category='building',
        source=f'sources/buildings/{name}-original.png', twinkles=candidates[::max(1, len(candidates)//24)][:24])
    write(ART/'sprites/manifest.json', manifest)
    print(f'{name}: {image.width}x{image.height}, crisp alpha, palette snapped')

def sky():
    # No buildings are baked here. The river sits far beneath the apartment.
    config = json.loads(subprocess.check_output(['node','--input-type=module','-e',
        "import {look} from './src/look.js';console.log(JSON.stringify(look.city))"], cwd=ROOT, text=True))
    image = Image.new('RGBA', (640, 360), config['sky'][0])
    d = ImageDraw.Draw(image)
    for color, top in zip(config['sky'][1:], [90, 180]):
        d.rectangle((0, top, 639, 359), fill=color)
    d.polygon([(0, 278), (640, 232), (640, 315), (0, 359)], fill=config['river'])
    for i in range(32):
        x = (i*71) % 640
        y = 284+(i*11) % 38
        d.line((x, y, x+2+i%4, y), fill=config['riverLight'])
    image.save(ART/'sky-river.png')
    scene = read(ART/'scene.json')
    scene['assets']['backdrop'] = 'sky-river.png'
    scene['backdropTwinkles'] = []
    write(ART/'scene.json', scene)

if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--name', required=True)
    p.add_argument('--source', required=True)
    a = p.parse_args()
    prepare(a.name, a.source)
    sky()
