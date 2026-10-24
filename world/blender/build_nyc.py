import bpy,sys,math,json,random
from pathlib import Path
from mathutils import Vector
import numpy as np
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE));from look_render import LOOK as L
OUT=HERE.parent/'art/nyc';OUT.mkdir(parents=True,exist_ok=True);rng=random.Random(L['seed'])
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=L['samples'];s.cycles.use_denoising=True;s.cycles.seed=L['seed'];s.render.resolution_x,s.render.resolution_y=L['resolution'];s.render.resolution_percentage=100
s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(*L['world']['color'],1);s.world.node_tree.nodes['Background'].inputs[1].default_value=L['world']['strength']
s.view_settings.view_transform=L['grade']['view'];s.view_settings.exposure=L['grade']['exposure'];s.view_settings.gamma=L['grade']['gamma']
def mat(name,color,emission=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=.85;p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emission;return m
M={n:mat(n,c) for n,c in L['colors'].items()};W=[mat('window',c,L['windows']['emission']) for c in L['windows']['colors']]
def box(n,p,d,m,bevel=True):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=n;o.dimensions=d;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(M[m] if isinstance(m,str) else m)
 if bevel:mod=o.modifiers.new('soft edges','BEVEL');mod.width=L['bevel'];mod.segments=2;o.modifiers.new('normals','WEIGHTED_NORMAL')
 return o
def cyl(n,p,r,h,m):
 bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=h,location=p);o=bpy.context.object;o.name=n;o.data.materials.append(M[m] if isinstance(m,str) else m);return o
# Sleek tower, crown and a wide open penthouse.
box('tower',(0,1,15),(12,10,30),'concrete')
for z in range(2,30,3):
 for x in [-4.5,-1.5,1.5,4.5]:
  box('front glass',(x,-4.03,z),(2.35,.06,1.9),rng.choice(W) if rng.random()<L['windows']['fraction'] else M['dark'],False)
 for y in [-2.5,.5,3.5]:box('side glass',(6.03,y,z),(.06,2.3,1.9),rng.choice(W) if rng.random()<L['windows']['fraction'] else M['dark'],False)
 box('floor trim',(0,-4.09,z+1.4),(12,.12,.12),'metal')
box('penthouse slab',(-1,1,30.8),(16,11,.35),'metal');box('wood floor',(0,1,31),(12,10,.15),'floor');box('back wall',(0,5.9,32.5),(12,.18,3),'wall');box('side window frame',(-5.9,1,32.5),(.15,10,3),'metal')
for y in [-3,0,3,6]:box('window post',(-5.9,y,32.5),(.16,.12,3),'cream')
box('window lintel',(-5.9,1,34),(.2,10,.15),'cream')
# Sectional and lounge: generous circulation around the central games table.
box('sectional seat',(-2.5,3.6,31.55),(4.5,1.5,.7),'sofa');box('sectional back',(-2.5,4.25,32.1),(4.5,.3,1.2),'sofa');box('chaise',(-4.2,2.3,31.55),(1.2,2,.7),'sofa')
for x in [-3.8,-2.4,-1]:box('cushion',(x,3.5,31.98),(1.2,1.1,.15),'sofa')
box('lounge rug',(-2.3,1.2,31.1),(5.7,4,.035),'cream');box('games table',(-2.1,1.2,31.6),(2.4,1.5,.2),'wood');box('table base',(-2.1,1.2,31.3),(1.5,.7,.6),'dark');box('board game',(-2.1,1.2,31.74),(1.3,.9,.08),'green')
for x in [-2.5,-2.1,-1.7]:box('game token',(x,1.2,31.84),(.12,.12,.12),'cream')
box('TV wall',(1,5.72,32.7),(2.6,.1,1.5),'dark');box('TV screen',(1,5.64,32.7),(2.4,.03,1.3),W[2]);box('TV console',(1,5.1,31.4),(3.6,.9,.6),'wood')
for x,y in [(-4,-1.1),(-.4,-1.1)]:
 bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=6,location=(x,y,31.45));o=bpy.context.object;o.name='beanbag';o.scale=(.7,.7,.45);o.data.materials.append(M['red'])
# Kitchen island and desk.
box('island cabinet',(3,2.6,31.55),(2,2.8,1.1),'wood');box('island counter',(3,2.6,32.15),(2.2,3,.15),'cream')
for y in [1.7,3.3]:cyl('stool',(1.5,y,31.65),.38,.14,'metal');cyl('stool stem',(1.5,y,31.3),.06,.6,'metal')
cyl('mug',(3,2,32.35),.13,.26,'cream');box('snack box',(3.3,3,32.3),(.5,.5,.2),'red')
box('desk',(3,-2.5,31.85),(3.6,1.3,.14),'wood')
for x in [1.6,4.4]:box('desk leg',(x,-2.5,31.4),(.1,1,.8),'metal')
for x in [2.3,3.7]:box('monitor',(x,-2.2,32.45),(1.15,.15,.75),'dark');box('display',(x,-2.3,32.45),(1,.03,.6),W[2]);box('stand',(x,-2.2,32.1),(.15,.15,.4),'metal')
box('keyboard',(3,-2.8,31.96),(1,.35,.06),'dark')
for x,y in [(5,4.5),(-5,5)]:
 cyl('planter',(x,y,31.4),.35,.7,'cream');box('plant foliage',(x,y,32.1),(.7,.6,1),'green')
# Snowy terrace with firepit and hanging bulbs.
box('terrace snow',(-8,1,31),(3.7,10,.15),'snow')
for y in [-3.5,-1,1.5,4,6]:box('railing post',(-9.8,y,31.65),(.1,.1,1.2),'metal')
box('snowy railing',(-9.8,1.2,32.3),(.22,10,.14),'snow');cyl('fire bowl',(-8,1,31.4),.65,.5,'metal');cyl('fire',(-8,1,31.7),.4,.15,W[0])
for y in [-2,0,2,4]:box('string light',(-9.6,y,33),(.14,.14,.18),W[0])
# LED strips stay unlit in beauty. A separate mask is prepared in the next phase.
for p,d in [((1,5.57,31.8),(3.5,.04,.06)),((3,-1.82,32.8),(3.4,.04,.06)),((0,5.65,34),(11.5,.04,.06))]:box('RGB strip',p,d,'cream',False)
# Street and neighboring towers.
box('snowy city base',(0,0,-.4),(90,85,.5),'snow');box('avenue',(0,-10,0),(70,7,.1),'dark');box('cross street',(10,0,.01),(6,65,.1),'dark')
for y in [-14.5,-5.5]:box('snow sidewalk',(0,y,.12),(70,2,.22),'snow')
for x in range(5,16,2):box('crosswalk',(x,-10,.07),(.9,5,.03),'snow')
for bx,by,w,d,h in L['city']['towers']:
 box('Midtown tower',(bx,by,h/2),(w,d,h),'concrete');box('roof snow',(bx,by,h+.1),(w+.3,d+.3,.2),'snow')
 for z in np.arange(2,h-1,L['city']['floor_step']):
  for x in np.arange(bx-w/2+1,bx+w/2-1,L['city']['window_step']):box('city window',(float(x),by-d/2-.04,float(z)),(1.15,.04,1.6),rng.choice(W) if rng.random()<L['windows']['fraction'] else M['dark'],False)
 cyl('water tower',(bx,by,h+1.5),1,2,'wood');box('water tower legs',(bx,by,h+.4),(1.1,1.1,.8),'metal')
# Distant stepped crowns suggest Midtown landmarks without reproducing them.
for bx,by,h in [(-10,31,44),(13,29,40)]:
 for j in range(5):box('stepped crown',(bx,by,h+j*.8),(5-j*.7,5-j*.7,.9),'metal')
 cyl('antenna',(bx,by,h+6),.08,5,'metal')
for x in [-12,-3,6,15]:
 cyl('street pole',(x,-6,2.6),.08,5.2,'metal');box('street lamp',(x,-6,5.3),(.5,.5,.15),W[0]);box('shopfront',(x,7,.9),(2.2,.1,1.5),W[0])
for x in [-9,1,17]:box('parked yellow cab',(x,-10,.7),(2.3,1.1,1),'cream');box('cab roof',(x,-10,1.3),(1.2,1,.5),'metal')
for l in L['lights']:
 d=bpy.data.lights.new(l['name'],'AREA');d.energy=l['power'];d.color=l['color'];d.size=l['size'];o=bpy.data.objects.new(l['name'],d);s.collection.objects.link(o);o.location=l['position'];o.rotation_euler=(Vector(l['target'])-o.location).to_track_quat('-Z','Y').to_euler()
fog=box('distance fog',(0,30,24),(70,15,55),'dark',False);fm=bpy.data.materials.new('fog');fm.use_nodes=True;n=fm.node_tree.nodes;n.clear();v=n.new('ShaderNodeVolumePrincipled');v.inputs['Density'].default_value=L['fog']['density'];v.inputs['Color'].default_value=(*L['fog']['color'],1);out=n.new('ShaderNodeOutputMaterial');fm.node_tree.links.new(v.outputs['Volume'],out.inputs['Volume']);fog.data.materials.clear();fog.data.materials.append(fm)
bpy.ops.object.camera_add(location=L['camera']['position']);cam=bpy.context.object;cam.rotation_euler=(Vector(L['camera']['target'])-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=L['camera']['scale'];cam.data.clip_start=L['camera']['near'];cam.data.clip_end=L['camera']['far'];s.camera=cam;bpy.context.view_layer.update()
(OUT/'camera.json').write_text(json.dumps(dict(convention='Blender Z up; Three conversion (x,z,-y)',position=list(cam.location),matrix_world=[list(row) for row in cam.matrix_world],ortho_scale=cam.data.ortho_scale,resolution=L['resolution'],near=cam.data.clip_start,far=cam.data.clip_end),indent=2));(OUT/'lights.json').write_text(json.dumps(L['lights'],indent=2))
s.use_nodes=True;s.view_layers[0].use_pass_z=True;s.view_layers[0].use_pass_normal=True;nt=s.node_tree;nt.nodes.clear();rl=nt.nodes.new('CompositorNodeRLayers');comp=nt.nodes.new('CompositorNodeComposite');nt.links.new(rl.outputs['Image'],comp.inputs[0])
for output,key in [('Depth','depth'),('Normal','normal')]:
 dep=nt.nodes.new('CompositorNodeOutputFile');dep.base_path=str(OUT);dep.format.file_format='OPEN_EXR';dep.format.color_depth='32';dep.file_slots[0].path=key;nt.links.new(rl.outputs[output],dep.inputs[0])
s.render.image_settings.file_format='PNG';s.render.filepath=str(OUT/'raw.png');bpy.ops.wm.save_as_mainfile(filepath=str(HERE/'nyc.blend'));bpy.ops.render.render(write_still=True)
def pixels(path):
 im=bpy.data.images.load(str(path),check_existing=False);return np.array(im.pixels[:],dtype=np.float32).reshape(im.size[1],im.size[0],4)
# Blender reads display PNG pixels directly; quantize the displayed RGB values, without dithering.
rgb=pixels(OUT/'raw.png')[:,:,:3];h,w=rgb.shape[:2]
radius=L['cleanup']['median_radius'];rgb=np.median(np.stack([np.roll(np.roll(rgb,y,axis=0),x,axis=1) for y in range(-radius,radius+1) for x in range(-radius,radius+1)]),axis=0)
# Four broad luminance bands preserve hue while flattening smooth light gradients.
lum=np.maximum(np.max(rgb,axis=2),.001);band=np.round(lum*(L['bands']-1))/(L['bands']-1);rgb=rgb*(.4+.6*band/np.maximum(lum,.08))[:,:,None]
depth=pixels(next(OUT.glob('depth*.exr')))[:,:,0];normal=pixels(next(OUT.glob('normal*.exr')))[:,:,:3];normal=np.median(np.stack([np.roll(np.roll(normal,y,axis=0),x,axis=1) for y in range(-radius,radius+1) for x in range(-radius,radius+1)]),axis=0);edge=np.zeros((h,w),dtype=bool)
for axis in [0,1]:
 edge|=(abs(depth-np.roll(depth,1,axis=axis))>L['edge']['depth'])|(np.linalg.norm(normal-np.roll(normal,1,axis=axis),axis=2)>L['edge']['normal'])
rgb*=np.where(edge,1-L['edge']['strength'],1)[:,:,None]
pal=np.array([[int(c[i:i+2],16)/255 for i in (0,2,4)] for c in L['palette']],dtype=np.float32);q=np.empty_like(rgb)
for row in range(0,h,32):
 block=rgb[row:row+32];idx=np.argmin(np.sum((block[:,:,None,:]-pal[None,None,:,:])**2,axis=3),axis=2);q[row:row+32]=pal[idx]
q=np.median(np.stack([np.roll(np.roll(q,y,axis=0),x,axis=1) for y in range(-radius,radius+1) for x in range(-radius,radius+1)]),axis=0)
for row in range(0,h,32):
 block=q[row:row+32];q[row:row+32]=pal[np.argmin(np.sum((block[:,:,None,:]-pal[None,None,:,:])**2,axis=3),axis=2)]
# Generated image pixels are saved as display values. No random or ordered perturbation.
rgba=np.concatenate([q,np.ones((h,w,1))],axis=2)
def save(data,name):
 ih,iw=data.shape[:2];im=bpy.data.images.new(name,width=iw,height=ih);im.pixels.foreach_set(data.astype(np.float32).ravel());im.filepath_raw=str(OUT/name);im.file_format='PNG';im.save()
save(rgba,'beauty.png');save(np.repeat(np.repeat(rgba,4,axis=0),4,axis=1),'beauty-x4.png')
# Render-origin uses bottom-left, so crop conversion uses image height.
x,y,cw,ch=L['preview']['crop'];crop=rgba[h-y-ch:h-y,x:x+cw];save(np.repeat(np.repeat(crop,4,axis=0),4,axis=1),'penthouse-x4.png')
for key in ['depth','normal']:
 for f in OUT.glob(key+'*.exr'):
  if f.name!=key+'.exr':f.replace(OUT/(key+'.exr'));break
(OUT/'render-check.json').write_text(json.dumps({'resolution':[w,h],'palette_entries':len(pal),'used_colors':len(np.unique(q.reshape(-1,3),axis=0)),'dithering':False,'bands':L['bands']},indent=2))

