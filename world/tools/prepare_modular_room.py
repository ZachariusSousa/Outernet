"""Prepare the generated room and independent transparent furniture sprites.
Keeps raw outputs and exact prompts; never overwrites the existing W0 room.
"""
import json
from pathlib import Path
from pixel_clean import clean
ROOT=Path(__file__).resolve().parents[1]
PACK=ROOT/'art/nyc/modular-v1'
SIZES={'sectional':(126,84),'coffee-table':(66,46),'rug':(106,66),'beanbag':(34,34),'media-unit':(82,64),'kitchen-cabinets':(78,57),'island':(60,46),'stool':(20,28),'desk':(74,50),'gaming-chair':(28,38),'bookshelf':(32,62),'plant':(24,36),'floor-lamp':(18,48),'table-lamp':(16,18),'balcony-pine':(24,40)}
reports={}
shell='room-shell-simple' if (PACK/'raw/room-shell-simple.png').exists() else 'room-shell'
clean(PACK/'raw'/(shell+'.png'),PACK/(shell+'.png'))
for name,size in SIZES.items():
 source=PACK/'raw'/(name+'.png')
 if source.exists():reports[name]=clean(source,PACK/(name+'.png'),size,trim=True,alpha_cutoff=128)
objects=[]
def add(name,x,y,foot=None,flip=False,layer=None):
 w,h=SIZES[name];obj=dict(id=name+'-'+str(len(objects)),file=name+'.png',x=x,y=y,width=w,height=h,foot=dict(x=x+w//2,y=foot if foot is not None else y+h-3),flipX=flip)
 if layer:obj['layer']=layer
 objects.append(obj);return obj
add('rug',163,218,layer='floor')
add('media-unit',44,118,flip=True)
add('bookshelf',173,77,flip=True)
add('kitchen-cabinets',132,98,flip=True)
add('sectional',96,162)
add('coffee-table',187,225)
add('beanbag',282,265)
add('beanbag',322,243,flip=True)
add('island',231,154)
add('stool',273,192)
add('stool',294,203)
add('desk',320,151)
add('gaming-chair',309,193)
add('plant',238,103)
add('plant',399,214)
add('plant',36,168)
add('floor-lamp',73,174)
add('floor-lamp',290,150)
add('table-lamp',130,116,foot=157)
add('balcony-pine',430,241)
objects=[o for o in objects if (PACK/o['file']).exists()]
scene=json.loads((ROOT/'art/nyc/scene.json').read_text());scene.update(room=shell+'.png',placeholder=False,objects=objects,occluders=[],steam=[dict(x=221,y=237)])
scene['windows']=[dict(id='skyline',polygon=[[215,36],[431,132],[431,207],[215,112]],twinkles=[dict(x=x,y=y,w=1,h=2) for x,y in [(242,117),(267,130),(294,144),(320,153),(350,170),(378,182),(409,194)]])]
scene['rgb']=dict(id='wall-rgb',polygon=[[11,94],[190,14],[195,17],[12,97]])
scene['lights']=[]
for o in objects:
 if o['file'] in ['floor-lamp.png','table-lamp.png']:
  x,y=o['x']+o['width']//2,o['y']+o['height'];id=o['id']+'-light';scene['lights'].append(dict(id=id,color='#ffcf8a',flicker=.5,polygon=[[x-15,y-10],[x+16,y-10],[x+28,y+10],[x-26,y+10]]));o['lightIds']=[id]
(PACK/'scene.json').write_text(json.dumps(scene,indent=2))
(PACK/'cleanup-report.json').write_text(json.dumps(reports,indent=2))
(PACK/'CREDITS.md').write_text('# Modular room v1\n\nGenerated for OuterNet with the built-in image_gen tool, 2026-10-24. Exact per-image prompts and original output paths are recorded in generation.json; raw outputs are retained in raw/. No downloaded or third-party furniture art is used.\n\nThe shell and available furniture types are separate images. The table lamp and balcony pine are not yet included in this first layout. Duplicate instances reuse the same image. Preparation uses world/tools/pixel_clean.py: nearest-neighbor, shared look.js palette, no dithering, trimmed transparent padding and binary-alpha furniture edges.\n\nPreview: /?scene=modular&art=1. Press P, select Furniture, then drag centers or resize corners. Mirror and Duplicate work per object. Copy scene JSON exports placement. The original W0 room and scene are preserved.\n')
print('Prepared',len(reports),'furniture assets;',len(objects),'placed instances')
