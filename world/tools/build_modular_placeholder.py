"""Build clearly-placeholder art in the final magenta-sheet/layer format.

The native drawings are enlarged 4x, then passed through exactly the same shared
cleanup and connected-region cutter that will process Zach's selected artwork.
Never run this over hand-edited layout/scene files without keeping those first.
"""
import json
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw
from pixel_clean import clean
from sprite_cut import cut

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / 'art/nyc'
SRC = ART / 'sources'
SRC.mkdir(exist_ok=True)
L = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import {look} from './src/look.js';console.log(JSON.stringify(look))"], cwd=ROOT, text=True))
P, C = L['placeholder'], L['art']['palette']
SCALE = L['art']['sourcePixelScale']
KEY = L['art']['chromaKey']


def source(image, name):
    path = SRC / name
    image.resize((image.width * SCALE, image.height * SCALE), Image.Resampling.NEAREST).save(path)
    return path


# A deliberately sparse skyline; the actual image will replace this later.
backdrop = Image.new('RGB', (640, 360), C[0])
d = ImageDraw.Draw(backdrop)
twinkles = []
for i in range(23):
    x = i * 29 - 8
    y = 60 + (i * 41) % 114
    d.rectangle((x, y, x + 23, 359), fill=C[1 + i % 3])
    if i == 15:
        d.rectangle((x + 7, y - 16, x + 16, y), fill=C[3])
        d.line((x + 12, y - 36, x + 12, y - 16), fill=P['lamp'])
    for wx in range(x + 4, x + 22, 7):
        for wy in range(y + 7, 350, 12):
            if (wx * 3 + wy + i) % 5 < 2:
                d.rectangle((wx, wy, wx + 1, wy + 2), fill=C[22 if i % 3 else 5])
                twinkles.append(dict(x=wx, y=wy, w=2, h=3))
    d.rectangle((x, y - 2, x + 23, y), fill=C[6])
clean(source(backdrop, 'placeholder-backdrop.png'), ART / 'backdrop.png', backdrop.size, SCALE)

# Floor, roof terrace, stepped tower, cream wall and transparent framed panes.
shell = Image.new('RGB', (480, 360), KEY)
d = ImageDraw.Draw(shell)
def poly(points, color):
    d.polygon(points, fill=color)

# Dark Art Deco setbacks continue below the apartment.
poly([(45,211),(265,321),(442,233),(442,359),(45,359)], C[2])
poly([(28,234),(263,351),(465,251),(465,359),(28,359)], C[1])
for x in range(55, 448, 24):
    d.rectangle((x, 324, x + 3, 359), fill=C[3])
    d.rectangle((x + 8, 339, x + 10, 343), fill=P['lamp'])
# L-shaped open floor: terrace occupies its inner cutaway corner.
floor = [(32,175),(210,86),(449,205),(370,245),(317,218),(231,261),(285,288),(259,302)]
poly(floor, P['floor'])
poly([(32,175),(259,302),(259,310),(32,183)], P['floorSide'])
for i in range(5):
    x = 52 + i * 35
    d.line((x, 176 + i*18, x + 175, 88 + i*18), fill=P['floorSide'])
poly([(32,99),(210,10),(210,86),(32,175)], P['wall'])
d.line((32,175,210,86), fill=P['floorSide'], width=3)
# Window frames, including a stepped approximation to a curved glass corner.
windows = [
    [[217,22],[279,53],[279,120],[217,89]],
    [[286,57],[349,88],[349,155],[286,124]],
    [[356,92],[414,121],[414,188],[356,159]],
    [[420,125],[438,137],[438,199],[420,191]],
    [[438,137],[449,148],[449,205],[438,199]],
]
for pane in windows:
    d.line([tuple(p) for p in pane] + [tuple(pane[0])], fill=P['floorSide'], width=3)
d.line((210,10,449,130), fill=P['floorSide'], width=4)
# Snowy terrace in the cutaway corner, and a glass railing frame.
terrace = [[240,270],[316,231],[372,258],[295,299]]
poly(terrace, P['snow'])
d.line((240,270,295,299,372,258), fill=C[7], width=3)
for x, y in [(248,274),(272,286),(296,298),(322,284),(348,271),(370,259)]:
    d.line((x,y-16,x,y),fill=P['floorSide'],width=2)
d.line((248,258,296,282,370,243),fill=P['floorSide'],width=2)
# Sunken living area, two low steps at the east entry.
pit = [[82,194],[160,155],[242,196],[163,237]]
poly(pit, P['floorSide'])
poly([[86,199],[160,162],[235,200],[163,237]], C[16])
steps = [[242,196],[250,200],[245,204],[237,200]]
poly(steps, C[18])
poly([[245,204],[253,208],[248,212],[240,208]], C[17])
cut(source(shell, 'placeholder-shell-magenta.png'), ART/'shell.png', SCALE, shell=True)

# Connected region placeholders. Every object touches itself, but none touches
# another object. Top-aligned cells make component ordering/name assignment clear.
sheets = {
 'a-living': [('sectional',76,38),('coffee-table',42,24),('large-rug',84,44),('round-rug',38,22),('beanbag-plum',28,25),('beanbag-cream',28,25),('floor-cushion',22,14),('wall-tv',52,34),('fireplace',66,28),('window-seat',58,28),('egg-chair',34,58)],
 'b-kitchen': [('island',54,30),('stool-a',16,25),('stool-b',16,25),('coffee-corner',52,40),('cabinets-fridge',48,58),('dual-monitor-desk',60,36),('gaming-chair',24,35),('bookshelf',30,57)],
 'c-decor': [('monstera',28,40),('hanging-pothos',28,34),('small-plant-a',14,21),('small-plant-b',14,21),('small-plant-c',14,21),('floor-lamp-a',16,44),('floor-lamp-b',16,44),('table-lamp',14,18),('record-player',42,28),('record-crate',24,22),('guitar',16,36),('poster-a',20,26),('poster-b',20,26),('poster-c',20,26),('moon-sign',20,24)],
 'd-terrace': [('lounger-a',44,24),('lounger-b',44,24),('fire-pit',30,22),('patio-heater',18,45),('pine-a',22,36),('pine-b',22,36),('pine-c',22,36),('snowman',22,30)],
}
for sheet, pieces in sheets.items():
    image = Image.new('RGB', (448, ((len(pieces)+3)//4)*80), KEY)
    for i, (name,w,h) in enumerate(pieces):
        sprite = Image.new('RGB',(w,h),KEY)
        sd = ImageDraw.Draw(sprite)
        color = P['sofa'] if name.startswith(('sectional','beanbag','window-seat','gaming','floor-cushion','egg')) else P['plant'] if 'plant' in name or 'pine' in name or 'pothos' in name or name=='monstera' else P['table']
        if 'rug' in name:
            sd.polygon([(0,h//2),(w//2,0),(w-1,h//2),(w//2,h-1)],fill=P['rug'])
            sd.line((3,h//2,w//2,3,w-4,h//2,w//2,h-4,3,h//2),fill=C[20],width=1)
        else:
            sd.rectangle((2,3,w-3,h-1),fill=color)
            sd.polygon([(2,3),(w//2,0),(w-3,3),(w//2,7)],fill=C[18])
            if 'sofa' in name or name=='sectional':
                sd.rectangle((5,10,w-7,h-6),fill=C[20]);sd.rectangle((5,8,12,h-6),fill=P['sofa'])
            elif name=='wall-tv' or 'monitor' in name:
                sd.rectangle((5,9,w-6,h-8),fill=C[2]);sd.rectangle((9,12,w//2,h-11),fill=C[4])
            elif 'lamp' in name or 'heater' in name:
                sd.rectangle((1,3,w-2,h//3),fill=P['lamp'])
            elif 'fire' in name:
                sd.rectangle((5,h//2,w-6,h-4),fill=C[23])
            elif 'pine' in name or name=='snowman':
                sd.rectangle((4,3,w-5,8),fill=P['snow'])
            elif name=='bookshelf':
                for j in range(4):sd.rectangle((5,10+j*10,w-6,14+j*10),fill=C[18+j])
        image.paste(sprite,(8+(i%4)*112,8+(i//4)*80))
    names = [p[0] for p in pieces]
    (SRC/(sheet+'-names.json')).write_text(json.dumps(names))
    cut(source(image,'placeholder-'+sheet+'.png'),ART/'sprites',SCALE,names)

layout = {'version':1,'placeholder':True,'sprites':[], 'lightLines':[]}
def place(id,sprite,x,y,level=0,layer='object',flip=False):
    layout['sprites'].append(dict(id=id,sprite=sprite,x=x,y=y,scale=1,flip=flip,layer=layer,level=level))
place('sofa','sectional',98,175,-1)
place('living-rug','large-rug',118,194,-1,'floor')
place('table','coffee-table',174,213,-1)
place('tv','wall-tv',60,116)
place('fireplace','fireplace',50,154)
place('kitchen','cabinets-fridge',172,68)
place('island','island',254,151)
place('stool-1','stool-a',294,185)
place('stool-2','stool-b',319,197)
place('desk','dual-monitor-desk',348,169)
place('desk-chair','gaming-chair',335,202)
place('books','bookshelf',135,94)
place('beanbag-1','beanbag-plum',296,218)
place('beanbag-2','beanbag-cream',341,224)
place('plant-left','monstera',36,153)
place('plant-window','monstera',406,193)
place('lamp-left','floor-lamp-a',75,147)
place('lamp-window','floor-lamp-b',317,136)
place('terrace-pine','pine-a',341,241)
place('terrace-fire','fire-pit',287,267)
place('terrace-lounger','lounger-a',255,254)
layout['lightLines']=[dict(id='wall-rgb',style='rgb',enabled=True,points=[dict(x=35,y=101),dict(x=210,y=14),dict(x=446,y=132)]),dict(id='terrace-string',style='string',enabled=True,points=[dict(x=248,y=257),dict(x=296,y=281),dict(x=370,y=242)]),dict(id='shelf-fairy',style='fairy',enabled=True,points=[dict(x=137,y=101),dict(x=146,y=97),dict(x=163,y=106)])]
(ART/'layout.json').write_text(json.dumps(layout,indent=2))

spots=[]
def spot(id,x,y,level=0,tags=None,pose='stand',anchor=None,group=None):
    spots.append(dict(id=id,x=x,y=y,level=level,tags=tags or ['comfy'],pose=pose,facing='right',**({'anchor':anchor} if anchor else {}),**({'group':group} if group else {})))
# Initial twelve are separated, visibly on their floor, and off furniture.
for i,(x,y,level) in enumerate([(79,196,0),(118,218,-1),(158,238,-1),(201,261,0),(247,229,0),(289,247,0),(333,270,0),(377,233,0),(350,182,0),(303,159,0),(257,137,0),(215,117,0)]):
    spot('hangout-%02d'%i,x,y,level,['comfy','window'] if i>=8 else ['comfy','terrace'] if i in [4,5,6] else ['comfy'], 'floor' if i in [1,2] else 'stand')
spot('sofa-seat',0,0,-1,['comfy'],'sit',dict(spriteId='sofa',x=42,y=28))
for id,x,y in [('game-left',153,205),('game-back',194,181),('game-right',229,213),('game-front',191,247)]:
    spot(id,x,y,-1,['game','comfy'],'sit',group='coffee-table')
for i,(x,y) in enumerate([(235,179),(282,201),(383,212),(159,153),(116,174),(263,264),(316,284),(369,209)]):
    spot('free-%02d'%i,x,y,0,['comfy','snack','window'])
# Main aisle and pit aisle connect ONLY through the explicitly marked steps.
main=[(79,196),(85,212),(201,272),(247,244),(289,247),(333,270),(377,233),(415,215),(350,182),(303,159),(257,137),(215,117),(159,153),(116,174),(79,196)]
paths=[dict(id='main-floor',level=0,type='walk',points=[dict(x=x,y=y,level=0) for x,y in main]),dict(id='step-approach',level=0,type='walk',points=[dict(x=257,y=137,level=0),dict(x=269,y=184,level=0),dict(x=254,y=200,level=0)]),dict(id='living-steps',type='steps',level=0,points=[dict(x=254,y=200,level=0),dict(x=248,y=204,level=0),dict(x=242,y=208,level=-1),dict(x=235,y=211,level=-1)]),dict(id='pit-aisle',level=-1,type='walk',points=[dict(x=x,y=y,level=-1) for x,y in [(235,211),(194,181),(153,205),(118,218),(158,238),(191,247),(229,213),(235,211)]])]
glows=[dict(id='left-lamp',style='lamp',anchor=dict(spriteId='lamp-left'),polygon=[[-12,20],[24,20],[36,52],[-20,52]]),dict(id='window-lamp',style='lamp',anchor=dict(spriteId='lamp-window'),polygon=[[-12,20],[24,20],[36,52],[-20,52]]),dict(id='tv-glow',style='tv',anchor=dict(spriteId='tv'),polygon=[[3,8],[49,8],[55,40],[-4,40]]),dict(id='hearth',style='fire',anchor=dict(spriteId='fireplace'),polygon=[[3,15],[64,15],[64,36],[3,36]]),dict(id='fire-pit-glow',style='fire',anchor=dict(spriteId='terrace-fire'),polygon=[[-6,5],[35,5],[35,25],[-6,25]])]
scene=dict(version=2,placeholder=True,width=480,height=360,assets=dict(backdrop='backdrop.png',shell='shell.png',manifest='sprites/manifest.json',pixelScale=SCALE),spots=spots,paths=paths,windows=[dict(id='pane-'+str(i),polygon=p,reflections=[[[p[0][0]+8,p[0][1]+7],[p[0][0]+24,p[0][1]+31]]]) for i,p in enumerate(windows)],glows=glows,steam=[dict(anchor=dict(spriteId='table'),x=29,y=8)],backdropTwinkles=twinkles[::9],levels=[dict(id=0,name='main'),dict(id=-1,name='sunken living')])
(ART/'scene.json').write_text(json.dumps(scene,indent=2))
(ART/'CREDITS.md').write_text('# W0 modular placeholders\n\nBackdrop, shell and four sprite sheets are deliberately plain procedural placeholders authored for OuterNet with Pillow by world/tools/build_modular_placeholder.py. No external or AI-generated art is used in the active scene. The earlier generated room is retained separately under modular-v1/.\n\nSource sheets and key shell are saved under sources/. All use the same 4 source pixels per art pixel, passed through pixel_clean.py with #FF00FF preserved, then sprite_cut.py. Replace them with Zach\'s selected images from docs/look-refs/ using the unchanged prompts in docs/room-prompt.md; record his actual image tool and prompts here when supplied.\n\nApproved creature sprites and project-authored props/planes are unchanged.\n')
print('Placeholder modular scene ready:',sum(len(s) for s in sheets.values()),'sprites')
