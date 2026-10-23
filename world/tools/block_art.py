import json,xml.etree.ElementTree as E
from pathlib import Path
root=Path('world/art'); ns='{http://www.w3.org/2000/svg}'
def svg(path,content,w=1920,h=1080):
 p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" shape-rendering="crispEdges">{content}</svg>')
def r(x,y,w,h,c,opacity=1):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}" opacity="{opacity}"/>'
def poly(points,c):return f'<polygon points="{points}" fill="{c}"/>'
ref=E.parse(root/'agents/style-test.svg').getroot(); groups=[g for g in ref if g.tag==ns+'g' and 'transform' in g.attrib]
labels=[['tail','gills','body','feet','eyes-open'],['wings','wing-spots','antennae','body','eyes-open'],['tail','ears','body','mask','eyes-open','feet'],['tail','ears','body','eyes-open','tooth','feet']]
for species,g,names in zip(['axolotl','moth','raccoon','beaver'],groups,labels):
 parts=[]
 for name,element in zip(names,list(g)[1:]):
  text=E.tostring(element,encoding='unicode').replace('ns0:','').replace(':ns0','')
  svg(f'agents/{species}/{name}.svg',text,144,112);parts.append(dict(name=name,file=f'{species}/{name}.svg',pivot=[56,56],position=[56,56]))
 svg(f'agents/{species}/eyes-closed.svg',r(36 if species!='moth' else 40,48,8,4,'#2a2230')+r(68 if species!='moth' else 64,48,8,4,'#2a2230'),144,112)
 parts.append(dict(name='eyes-closed',file=f'{species}/eyes-closed.svg',pivot=[56,56],position=[56,56]))
 (root/f'agents/{species}.json').write_text(json.dumps(dict(size=[144,112],foot=[56,96],anchors=dict(head=[56,12],hand=[104,72]),parts=parts),indent=2))
# Cabin artwork, all scene coordinates on the eight-pixel grid.
night='#121826';wood='#6b4630';edge='#4a2f22';cream='#f3e3c3'
sky=r(0,0,1920,1080,night)+r(1264,112,48,48,'#e9f0f6')+poly('720,400 864,208 936,280 1040,160 1160,296 1280,224 1440,408','#2b3a52')+poly('720,416 880,320 960,384 1112,256 1240,384 1440,304 1440,448','#1c2638')
for x in range(760,1440,112):sky+=r(x,336,16,96,edge)+poly(f'{x-32},400 {x-16},400 {x-16},368 {x},368 {x},336 {x+16},336 {x+16},368 {x+32},368 {x+32},400 {x+48},400 {x+48},416 {x-32},416','#3f4f3e')
svg('cabin/sky.svg',sky)
room=''
for y in range(0,448,32):room+=r(0,y,1920,32,wood if y%64 else '#8a5a3b')
# window punched out via drawing walls around it
room='<defs><mask id="window">'+r(0,0,1920,1080,'white')+r(736,80,704,336,'black')+'</mask></defs><g mask="url(#window)">'+room+'</g>'
for y in range(448,1080,64):
 room+=r(0,y,1920,64,'#8a5a3b')+r(0,y+56,1920,8,wood)
 for x in range((y//64%2)*160,1920,320):room+=r(x,y,8,56,wood)
room+=r(720,64,736,16,edge)+r(720,416,736,24,edge)+r(720,64,16,368,edge)+r(1440,64,16,368,edge)+r(1072,80,16,336,edge)
room+=r(432,128,256,320,'#cfdbe8')+r(416,432,288,32,edge)+r(464,288,192,144,night)
for y in range(144,288,48):
 for x in range(448,680,64):room+=r(x,y,48,32,'#6b4630')
room+=poly('496,424 496,376 520,376 520,336 544,360 552,304 584,352 608,328 616,376 632,376 632,424','#ff8a3d')+r(536,376,64,48,'#ffcf8a')
room+=r(960,640,528,256,'#8f3b30')+r(976,656,496,224,'#b5574a')
homes=[];decor=[]
for i in range(12):
 x=16+(i%6)*64;y=592+(i//6)*176
 room+=r(x,y,64,152,edge)+r(x+8,y+8,48,128,night)+r(x+8,y+112,48,24,['#5e7059','#8f3b30','#b5574a','#cfdbe8','#b07a4f','#f3e3c3'][i%6])+r(x+8,y+104,16,8,cream)
 homes.append(dict(x=x+32,y=y+120,facing=1,pose='sleep',scale=.42));decor.append(dict(home=i,stickers=[dict(file=f'../agents/decor/{name}.svg',x=x+8+j*16,y=y+16,width=16,height=16) for j,name in enumerate(['shelf','jars','poster'])]))
svg('cabin/room.svg',room)
svg('cabin/front.svg',r(0,0,1920,24,edge)+r(0,24,16,1056,edge)+r(1904,24,16,1056,edge))
svg('cabin/light.svg',r(400,448,432,320,'#ff8a3d',.08)+r(448,448,336,224,'#ffb35c',.1)+r(496,448,240,128,'#ffcf8a',.12)+r(832,464,144,192,'#ffcf8a',.1))
svg('cabin/night.svg',r(0,0,1920,1080,'white')+r(0,0,192,1080,night,.18)+r(1728,0,192,1080,night,.18)+r(0,0,1920,64,night,.12))
furniture=[]
def furnish(name,shapes,foot,x,w):
 svg(f'cabin/furniture/{name}.svg',shapes);furniture.append(dict(id=name,file=f'furniture/{name}.svg',footY=foot,x=0,y=0,lineX=x,lineWidth=w))
for x in [480,704]:furnish('chair-'+str(x),r(x,496,128,112,'#8f3b30')+r(x-16,544,32,112,'#b5574a')+r(x+112,544,32,112,'#b5574a')+r(x+16,608,96,48,'#8f3b30')+r(x,656,24,24,edge)+r(x+104,656,24,24,edge),680,x-16,160)
furnish('lamp',r(888,400,8,208,edge)+r(856,608,72,16,edge)+poly('864,352 928,352 944,416 848,416','#ffcf8a'),624,848,96)
furnish('game-table',r(1120,688,240,24,'#b07a4f')+r(1120,712,240,32,wood)+r(1136,744,24,96,edge)+r(1320,744,24,96,edge)+r(1176,672,128,16,'#3f4f3e')+r(1200,664,16,8,cream)+r(1264,664,16,8,cream),840,1120,240)
for x,y in [(1152,592),(1328,592),(1152,896),(1328,896)]:furnish(f'seat-{x}-{y}',r(x-40,y-16,80,24,wood)+r(x-32,y+8,16,32,edge)+r(x+16,y+8,16,32,edge),y+40,x-40,80)
furnish('mail-desk',r(1648,496,248,24,'#b07a4f')+r(1664,520,24,144,edge)+r(1856,520,24,144,edge)+''.join(r(1656+j*56,384,48,104,edge)+r(1664+j*56,400,32,64,cream) for j in range(4)),664,1648,248)
scene=dict(width=1920,height=1080,layers={n:n+'.svg' for n in ['sky','room','front','light','night']},window=dict(x=736,y=80,w=704,h=336),furniture=furniture,spots=dict(home=homes,study=[dict(x=x,y=y,facing=1,pose='sit' if y==624 else 'stand') for x,y in [(544,624),(768,624),(480,824),(656,824),(832,824),(480,1000),(656,1000),(832,1000)]],play=[dict(x=x,y=y,facing=1,pose='sit') for x,y in [(1152,592),(1328,592),(1152,896),(1328,896)]],help=[dict(x=x,y=y,facing=-1,pose='stand') for x,y in [(1680,816),(1840,816),(1680,992),(1840,992)]]),paths=[],decor=decor,lights=[dict(x=400,y=440,w=432,h=336,key='fire'),dict(x=832,y=440,w=144,h=224,key='lamp')])
(root/'cabin/scene.json').write_text(json.dumps(scene,indent=2))
props={
'veil':r(8,16,48,8,cream)+r(16,24,32,32,'#b07a4f')+r(24,24,16,24,cream),
'saxophone':r(32,8,8,32,'#ffcf8a')+r(16,40,24,16,'#ffb35c')+r(8,32,16,16,'#ffcf8a'),
'diving-helmet':r(8,16,48,32,'#ffb35c')+r(16,8,32,48,'#ffb35c')+r(24,24,16,16,night),
'hammer':r(24,24,8,40,wood)+r(8,8,48,24,'#cfdbe8'),
'basket':r(8,32,48,24,'#b07a4f')+r(16,16,8,16,cream)+r(40,16,8,16,cream)+r(8,8,24,8,'#8f3b30')+r(32,8,24,8,'#b5574a'),
'scroll':r(8,8,40,48,cream)+r(48,24,8,32,edge)+r(16,24,24,8,'#8f3b30'),
'knight':r(8,48,48,8,cream)+r(24,24,24,24,cream)+r(16,8,32,24,cream)+r(8,16,16,16,cream)+r(24,16,8,8,night),
'racing-helmet':r(8,16,48,32,'#b5574a')+r(16,8,32,48,'#b5574a')+r(8,24,40,8,night),
'rocket':poly('24,0 40,0 40,8 48,8 48,48 16,48 16,8 24,8',cream)+r(24,16,16,16,'#2b3a52')+r(8,40,8,16,'#8f3b30')+r(48,40,8,16,'#8f3b30')+r(24,48,16,16,'#ff8a3d'),
'crown':r(8,24,48,24,'#ffb35c')+r(8,8,8,16,'#ffcf8a')+r(24,8,16,16,'#ffcf8a')+r(48,8,8,16,'#ffcf8a'),
'cheese':r(8,16,48,32,'#ffb35c')+r(16,8,32,48,'#ffb35c')+r(24,16,8,8,'#b07a4f')+r(40,32,8,8,'#b07a4f'),
'die':r(8,8,48,48,cream)+''.join(r(x,y,8,8,night) for x,y in [(16,16),(40,16),(24,32),(40,40),(16,40)])}
for n,s in props.items():svg('agents/props/'+n+'.svg',s,64,64)
for n in ['letter','bundle','canvas']:
 s=r(8,16,64,40,cream)
 if n=='letter':s+=poly('8,16 40,40 72,16','#cfdbe8')
 if n=='bundle':s=r(0,0,64,40,'#cfdbe8')+r(8,8,64,40,cream)+r(24,8,8,40,wood)
 if n=='canvas':s+=r(16,32,16,8,wood)+r(48,32,16,8,wood)
 svg('agents/planes/'+n+'.svg',s,80,64)
for n in ['shelf','jars','poster']:svg('agents/decor/'+n+'.svg',r(0,8,32,24,wood)+r(8,0,16,24,cream),32,32)
