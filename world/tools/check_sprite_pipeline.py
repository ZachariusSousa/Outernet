"""Focused checks for scale, key preservation, region cutting and manifests."""
import json
from pathlib import Path
import tempfile
from PIL import Image, ImageDraw
from sprite_cut import cut

with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    image = Image.new('RGB', (32, 16), '#FF00FF')
    d = ImageDraw.Draw(image)
    d.rectangle((2, 2, 8, 8), fill='#f3e3c3')
    d.rectangle((20, 3, 26, 12), fill='#40516c')
    source = root/'sheet.png'
    image.resize((128, 64), Image.Resampling.NEAREST).save(source)
    cut(source, root/'sprites', 4, ['chair', 'lamp'])
    manifest = json.loads((root/'sprites/manifest.json').read_text())
    assert manifest['sprites']['chair']['size'] == [7, 7]
    assert manifest['sprites']['lamp']['baseLine'] == 10
    assert Image.open(root/'sprites/_sheets/sheet.png').getpixel((0, 0))[:3] == (255, 0, 255)
    cut(source, root/'shell.png', 4, shell=True)
    assert Image.open(root/'shell.png').getpixel((0, 0))[3] == 0
    assert Image.open(root/'shell.png').getpixel((2, 2))[3] == 255
    original = (root/'sprites/manifest.json').read_text()
    try:
        cut(source, root/'sprites', 4, ['wrong-count'])
        raise AssertionError('Name mismatch should fail')
    except ValueError:
        assert (root/'sprites/manifest.json').read_text() == original

art = Path(__file__).resolve().parents[1]/'art/nyc'
manifest = json.loads((art/'sprites/manifest.json').read_text())
assert len([s for s in manifest['sprites'].values() if s.get('category') != 'building']) == 42
for sprite in manifest['sprites'].values():
    image = Image.open(art/'sprites'/sprite['file']).convert('RGBA')
    assert list(image.size) == sprite['size']
    assert image.getchannel('A').getbbox() == (0, 0, image.width, image.height)
    assert all(pixel[:3] != (255, 0, 255) for pixel in image.get_flattened_data() if pixel[3])
print(f"PASS: shared 4x scale, exact magenta, trimmed components, base lines, naming guard, {len(manifest['sprites'])} assets")
