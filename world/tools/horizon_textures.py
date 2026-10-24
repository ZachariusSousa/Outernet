from PIL import Image,ImageDraw
from pathlib import Path
import json,random
root=Path('world/art/textures');rng=random.Random(23)
im=Image.new('RGB',(64,64),'#2c405c');d=ImageDraw.Draw(im)
for y in range(4,64,16):
 for x in range(6,64,16):d.rectangle((x,y,x+6,y+9),fill=rng.choice(['#ffcf8a','#e3b476','#7696b0','#1b2b43','#1b2b43']))
im.save(root/'facade-distant.png')
im=Image.new('RGBA',(512,128),(0,0,0,0));d=ImageDraw.Draw(im)
for x in range(0,512,8):
 h=rng.randrange(18,90);d.rectangle((x,128-h,x+7,127),fill='#2c405c')
 for y in range(132-h,124,8):
  if rng.random()<.45:d.rectangle((x+2,y,x+3,y+2),fill='#e3b476')
for x,y,w in [(300,40,22),(304,28,14),(308,18,6),(310,4,2)]:d.rectangle((x,y,x+w,127),fill='#7696b0')
im.save(root/'skyline-card.png');p=root/'textures.json';a=json.loads(p.read_text());a.extend([dict(file=n,size=size,source='procedural',license='CC0-1.0',author='OuterNet') for n,size in [('facade-distant.png',[64,64]),('skyline-card.png',[512,128])]]);p.write_text(json.dumps(a,indent=2))
