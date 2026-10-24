"""Plain stand-in room and exact rect-based sprites from the approved SVG. No external art."""
import json,subprocess,xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
L=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {look} from './src/look.js';console.log(JSON.stringify(look))"],cwd=ROOT,text=True))
P=L['placeholder'];out=ROOT/'art/nyc';out.mkdir(exist_ok=True)
im=Image.new('RGB',tuple(L['art']['size']),L['art']['matte']);d=ImageDraw.Draw(im)
def poly(points,color): d.polygon(points,fill=color)
# Intentionally plain, schematic stand-in, not final illustrated art.
poly([(32,180),(220,86),(448,200),(260,320)],P['floor'])
poly([(32,180),(260,320),(260,330),(32,190)],P['floorSide']);poly([(260,320),(448,200),(448,210),(260,330)],P['floorSide'])
poly([(32,110),(220,16),(220,86),(32,180)],P['wallShade']);poly([(220,16),(448,130),(448,200),(220,86)],P['wall'])
window=[[251,52],[427,140],[427,184],[251,96]];poly(window,L['art']['palette'][1])
# The skyline stays deliberately abstract; live snow clips to this exact polygon.
for x,y,h in [(265,75,25),(288,92,24),(315,98,32),(342,119,25),(373,130,30),(403,149,24)]:
 d.rectangle((x,y,x+12,y+h),fill=L['art']['palette'][2]);d.rectangle((x+3,y+5,x+4,y+7),fill=P['lamp'])
d.line(window+[window[0]],fill=P['floorSide'],width=3)
d.line((338,96,338,139),fill=P['floorSide'],width=3)
poly([(164,227),(228,195),(300,232),(236,268)],P['rug'])
occluders=[]
def furniture(name,points,color,foot):
 poly(points,color);occluders.append(dict(id=name,polygon=points,foot={'x':points[0][0],'y':foot}))
furniture('sofa',[[72,176],[116,153],[170,180],[170,195],[126,217],[72,190]],P['sofa'],207)
furniture('island',[[302,185],[334,169],[390,197],[390,215],[359,232],[302,203]],P['table'],225)
furniture('coffee-table',[[200,224],[227,210],[261,227],[261,237],[234,251],[200,234]],P['table'],245)
furniture('desk',[[150,136],[177,122],[213,140],[213,151],[186,165],[150,147]],P['table'],156)
d.rectangle((174,123,190,133),fill=P['screen'])
furniture('tv-unit',[[52,144],[79,130],[106,143],[106,156],[80,170],[52,156]],P['table'],166)
poly([(55,121),(81,108),(100,118),(100,140),(76,152),(55,141)],P['screen'])
furniture('plant',[[398,238],[408,233],[418,239],[415,251],[402,251]],P['floorSide'],252)
poly([(403,238),(396,225),(406,229),(409,214),(413,230),(423,225),(415,239)],P['plant'])
# Terrace at the near right edge.
poly([(337,280),(448,208),(464,216),(349,291)],P['snow'])
for x,y in [(126,137),(315,160)]:
 d.rectangle((x,y,x+7,y+5),fill=P['lamp']);d.line((x+3,y+5,x+3,y+17),fill=P['table'],width=2)
d.rectangle((234,225,238,230),fill=L['art']['palette'][20])
d.text((14,343),'PLACEHOLDER ROOM / replace art/nyc/room.png',fill=L['art']['palette'][5])
im.save(out/'room.png')
spots=[]
coords=[(101,220),(144,241),(187,263),(230,285),(275,302),(320,278),(365,255),(401,225),(354,186),(300,161),(250,137),(206,161),(146,204),(191,221),(277,260),(322,239),(365,212),(317,203),(269,184),(224,201),(180,181),(134,160),(88,181),(234,245)]
for i,(x,y) in enumerate(coords):
 tags=['comfy']
 if i in [12,13,19,23]:x,y={12:(180,220),13:(225,190),19:(280,220),23:(230,278)}[i]
 if i in [12,13,19,23]: tags=['game','comfy']
 if i in [8,9,10,11]:tags=['window','comfy']
 if i in [5,6,7]: tags=['terrace','snack']
 if i in [15,16,17]:tags=['snack','comfy']
 spots.append(dict(id='spot-%02d'%i,x=x,y=y,pose='sit' if i in [0,1,12,13,19,23] else 'lie' if i==3 else 'floor' if i in [2,4] else 'stand',facing='left' if i%2 else 'right',tags=tags,group='table' if 'game' in tags else None))
# A connected walkway graph. Spot connectors select nearest visible route vertex.
paths=[dict(id='aisle',points=[dict(x=x,y=y) for x,y in [(95,224),(148,242),(192,260),(235,283),(279,294),(320,270),(365,246),(402,222),(375,188),(329,165),(282,142),(235,123),(203,157),(163,183),(125,205),(95,224)]]),dict(id='middle',points=[dict(x=x,y=y) for x,y in [(163,183),(200,202),(250,194),(278,222),(320,243),(365,246)]])]
data=dict(width=480,height=360,placeholder=True,occluders=occluders,spots=spots,paths=paths,lights=[dict(id='lamp-left',color=P['lamp'],flicker=1,polygon=[[93,140],[148,140],[160,196],[100,210]]),dict(id='lamp-kitchen',color=P['lamp'],flicker=.5,polygon=[[286,159],[341,172],[362,209],[297,191]]),dict(id='tv',color=L['art']['palette'][4],flicker=.4,polygon=[[56,135],[103,130],[135,189],[78,191]])],rgb=dict(id='rgb',polygon=[[224,26],[438,133],[438,136],[224,29]]),windows=[dict(id='city-window',polygon=window,twinkles=[dict(x=x,y=y,w=2,h=2) for x,y in [(269,81),(293,99),(319,106),(347,126),(378,137),(408,154)]])],steam=[dict(x=236,y=224)])
(out/'scene.json').write_text(json.dumps(data,indent=2))
# Rasterize rects directly: no SVG renderer, resampling or redesigned shapes.
root=ET.parse(ROOT/'art/agents/style-test.svg').getroot();NS='{http://www.w3.org/2000/svg}'
colors={'axolotl':'#f2a7bb','moth':'#efe2c4','raccoon':'#9aa3ad','beaver':'#b0703f'}
manifest={}
spriteout=ROOT/'art/agents/sprites';spriteout.mkdir(exist_ok=True)
def rectangles(el,fill=None):
 fill=el.get('fill',fill)
 if el.tag==NS+'rect' and el.get('opacity') is None:yield el,fill
 for child in el:yield from rectangles(child,fill)
for kind,group in zip(colors,[g for g in root if g.tag==NS+'g'][:4]):
 frames=[]
 for tint_index,tint in enumerate(L['agents']['tints']):
  for pose in ['stand','sit']:
   for blink in [False,True]:
    for flap in [0,1] if kind=='moth' else [0]:
     sprite=Image.new('RGBA',(36,30));sd=ImageDraw.Draw(sprite)
     for el,color in rectangles(group):
      if not color:continue
      x=float(el.get('x','0'));y=float(el.get('y','0'));w=float(el.get('width'));h=float(el.get('height'))
      if pose=='sit' and y>=80 and h<=8:continue
      if kind=='moth' and flap and ((color in ['#d8c08e','#b89660'] and x<32) or x>=80):y-=4
      if blink and color in ['#2a2230','#eef0f3'] and w==8 and h==8:h=4
      rgb=tuple(bytes.fromhex(color[1:]))
      if color==colors[kind]:rgb=tuple(max(0,min(255,round(c*(1+tint)))) for c in rgb)
      x0=round((x+8)*.25);y0=round(y*.25);x1=round((x+8+w)*.25)-1;y1=round((y+h)*.25)-1
      sd.rectangle((x0,y0,x1,y1),fill=rgb)
     name=f'{kind}-{tint_index}-{pose}-{int(blink)}-{flap}.png';sprite.save(spriteout/name);frames.append(name)
 manifest[kind]=dict(size=[36,30],foot=[16,23],bodyColor=colors[kind],frames=frames)
(spriteout/'sprites.json').write_text(json.dumps(manifest,indent=2))
(out/'CREDITS.md').write_text('# W0 room art\n\nCurrent room.png is a deliberately plain procedural placeholder, authored for OuterNet with Pillow by world/tools/build_pixel_assets.py. No third-party room art or AI generation was used. Replace it with the cleaned room image; record his tool and prompt here at that time. The target prompt remains docs/room-prompt.md (unchanged).\n\nCreature sprites copy the approved style-test.svg rectangles at 1/4 scale. Props and planes reuse the project SVGs. No external assets were added.\n')
print('Wrote plain room, editable scene, exact approved-shape sprite frames')

