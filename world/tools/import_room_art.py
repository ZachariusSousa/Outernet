"""Import generated, gridded furniture sheets without changing placement IDs.

Each equal cell contains one named object. Magenta is removed before cleanup;
unconnected details within that object's cell stay together. Originals and exact
prompts remain in sources/room-v2. No room geometry or paths are regenerated.
"""
import argparse
import json
import shutil
from pathlib import Path
from PIL import Image
from pixel_clean import clean
from sprite_cut import components

ROOT=Path(__file__).resolve().parents[1]
ART=ROOT/'art/nyc'
SOURCE=ART/'sources/room-v2'

def read(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def write(p,d): p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf-8')

def key(image):
    image=image.convert('RGBA')
    pixels=image.load()
    for y in range(image.height):
        for x in range(image.width):
            r,g,b,a=pixels[x,y]
            # Remove exact and antialiased magenta before palette snapping.
            pixels[x,y]=(r,g,b,0 if r>175 and b>175 and g<110 else a)
    return image

def sheet(name,path):
    spec=next(s for s in read(SOURCE/'prompts.json') if s['name']==name)
    raw=SOURCE/f'{name}-original.png'
    if Path(path).resolve()!=raw.resolve():shutil.copy2(path,raw)
    image=key(Image.open(raw)); cols,rows=spec['grid']
    # Detect complete silhouettes before assigning them to cells: a chair or sofa
    # may extend a little beyond its nominal gutter, and must not be sliced off.
    image=image.resize((round(image.width/4),round(image.height/4)),Image.Resampling.NEAREST)
    _,regions=components(image,min_area=2)
    groups=[[] for _ in range(cols*rows)]
    for x0,y0,x1,y1,points in regions:
        col=min(cols-1,int((x0+x1)/2/image.width*cols))
        row=min(rows-1,int((y0+y1)/2/image.height*rows))
        groups[row*cols+col].extend(points)
    manifest=read(ART/'sprites/manifest.json')
    original=SOURCE/'placeholder-manifest.json'
    if not original.exists():shutil.copy2(ART/'sprites/manifest.json',original)
    baseline=read(original)
    layout=read(ART/'layout.json')
    report=[]
    for i,sprite in enumerate(spec['names']):
        points=groups[i]
        if not points:raise ValueError(f'No connected regions for {sprite}')
        x0=min(x for x,y in points);y0=min(y for x,y in points)
        cell=Image.new('RGBA',(max(x for x,y in points)-x0+1,max(y for x,y in points)-y0+1))
        for x,y in points:cell.putpixel((x-x0,y-y0),image.getpixel((x,y)))
        if not cell.getchannel('A').getbbox():raise ValueError(f'Empty cell for {sprite}')
        cellfile=SOURCE/f'{sprite}-cell.png';cell.save(cellfile)
        old=baseline['sprites'][sprite]
        target=ART/'sprites'/f'{sprite}-v2.png'
        clean(cellfile,target,size=old['size'],pixel_size=1,trim=True,alpha_cutoff=128)
        result=Image.open(target).convert('RGBA')
        box=result.getchannel('A').getbbox()
        result=result.crop(box);result.save(target)
        previous=manifest['sprites'][sprite]
        # Preserve each existing instance's base and center as sprite art changes.
        for o in layout['sprites']:
            if o['sprite']!=sprite:continue
            scale=o.get('scale',1)
            o['x']+=round((previous['width']-result.width)*scale/2)
            o['y']+=(o.get('baseLine',previous['baseLine'])-result.height)*scale
            o.pop('baseLine',None)
        manifest['sprites'][sprite]=dict(file=target.name,size=list(result.size),width=result.width,height=result.height,baseLine=result.height,source=f'sources/room-v2/{name}-original.png',generated=True)
        report.append(dict(sprite=sprite,size=list(result.size)))
    write(ART/'sprites/manifest.json',manifest);write(ART/'layout.json',layout)
    write(SOURCE/f'{name}-import.json',report)
    print(json.dumps(report))

def shell(path):
    raw=SOURCE/'shell-original.png'
    if Path(path).resolve()!=raw.resolve():shutil.copy2(path,raw)
    target=ART/'shell-v2.png'
    image=key(Image.open(raw)); keyed=SOURCE/'shell-keyed.png';image.save(keyed)
    clean(keyed,target,size=(480,360),pixel_size=1,alpha_cutoff=128)
    scene=read(ART/'scene.json');scene['assets']['shell']=target.name
    write(ART/'scene.json',scene)

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('name',choices=['living','kitchen','decor','terrace','shell']);p.add_argument('source');a=p.parse_args()
    if a.name=='shell':shell(a.source)
    else:sheet(a.name,a.source)
