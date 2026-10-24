import bpy,sys,math,json,random
from pathlib import Path
from mathutils import Vector
import numpy as np
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE));from look_render import LOOK as L
OUT=HERE.parent/'art/flat';OUT.mkdir(parents=True,exist_ok=True);rng=random.Random(L['seed'])
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
 bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=h,location=p);o=bpy.context.object;o.name=n;o.data.materials.append(M[m]);return o
box('four floors below',(0,1,5.8),(12,8,11.6),'concrete')
for z in [1.5,4.5,7.5,10.5]:
 for x in [-4.5,-1.5,1.5,4.5]:
  box('panel seam',(x-1.48,-3.02,z),(.035,.04,3),'dark',False);box('neighbour window',(x,-3.05,z),(1.35,.06,1.5),rng.choice(W) if rng.random()<L['windows']['fraction'] else M['dark']);box('snow sill',(x,-3.2,z-.8),(1.6,.35,.12),'snow')
 box('floor seam',(0,-3.02,z+1.5),(12,.04,.04),'dark',False)
box('slab',(0,1,11.8),(12,8,.3),'concrete');box('parquet',(0,1,12),(12,8,.12),'floor');box('back wall',(0,4.9,13.5),(12,.2,3),'wall');box('left wall',(-5.9,1,13.5),(.2,8,3),'wall')
for x in [-3,1.5,4.2]:
 box('window',(x,4.76,13.6),(1.8,.08,1.7),'dark');box('window glass',(x,4.7,13.6),(1.6,.04,1.5),W[2]);box('mullion',(x,4.6,13.6),(.08,.08,1.6),'cream');box('sill',(x,4.5,12.7),(2,.5,.12),'cream')
 for k in range(7):box('radiator',(x-.7+k*.22,4.5,12.4),(.14,.22,.6),'cream')
box('wall rug',(-3,4.55,13.7),(3.5,.08,1.7),'red')
for x in [-4.2,-3.6,-3,-2.4,-1.8]:
 q=box('woven diamond',(x,4.49,13.7),(.3,.04,.6),'cream');q.rotation_euler.y=math.pi/4
box('sofa',(-3,3.1,12.5),(3.8,1.2,.65),'sofa');box('sofa back',(-3,3.7,13),(3.8,.3,1),'sofa')
for x in [-5,-1]:box('arm',(x,3.1,12.8),(.3,1.35,.9),'sofa')
box('rug',(-3,.8,12.09),(4,2.8,.035),'red');box('coffee table',(-3,.6,12.6),(1.8,1,.15),'wood')
for x in [-3.7,-2.3]:box('table leg',(x,.6,12.3),(.15,.6,.6),'wood')
box('TV cabinet',(-4,-1.5,12.45),(1.6,.85,.8),'wood');box('CRT TV',(-4,-1.5,13.1),(1.3,.8,.95),'dark');box('screen',(-4,-1.93,13.1),(1.05,.04,.65),W[2])
cyl('lamp stand',(-1,3,13.1),.06,2.1,'metal');cyl('fabric shade',(-1,3,14.1),.4,.45,'cream')
box('linoleum',(2.8,2,12.08),(5.6,5.6,.035),'green');box('kitchen table',(2,1,12.9),(2.1,1.6,.14),'cream')
for x in [1.2,2.8]:
 for y in [.4,1.6]:box('table leg',(x,y,12.45),(.12,.12,.9),'wood')
for x,y in [(.5,1),(3.5,1),(2,-.3),(2,2.3)]:box('stool',(x,y,12.45),(.65,.65,.14),'wood');box('stool base',(x,y,12.2),(.4,.4,.5),'wood')
for x in [1.5,2.5]:cyl('tea glass',(x,1,13.1),.11,.25,'cream');cyl('tea',(x,1,13.23),.09,.02,'wood')
cyl('kettle',(2,1.4,13.15),.22,.35,'metal');box('fridge',(5,3.7,13),(1,1,2),'cream');box('stove',(3.8,4,12.6),(1,1,1.1),'cream');box('tube',(3.8,4.65,14.2),(1.3,.15,.12),W[2])
box('computer desk',(4,-1.8,12.8),(2.4,1,.12),'wood');box('beige CRT',(4,-1.8,13.3),(.7,.6,.65),'cream');box('PC screen',(4,-2.12,13.3),(.5,.04,.4),W[2]);box('tower',(4.9,-1.8,13.15),(.4,.7,.7),'cream')
for i in range(12):
 x=-5.1+i%6*1.05;y=-2.3+i//6*1.05;box('cot',(x,y,12.2),(.85,.85,.25),'sofa');box('pillow',(x,y+.25,12.38),(.5,.22,.12),'cream')
box('ground',(0,10,-.3),(70,70,.3),'snow')
for bx,by,w,h in [(-15,14,10,24),(0,23,14,30),(16,17,10,21)]:
 box('distant panelki',(bx,by,h/2),(w,5,h),'concrete');box('roof snow',(bx,by,h+.1),(w+.2,5.2,.2),'snow')
 for z in range(2,int(h),3):
  for x in np.arange(bx-w/2+1,bx+w/2,2):box('distant window',(float(x),by-2.53,z),(1,.05,1.4),rng.choice(W) if rng.random()<L['windows']['fraction'] else M['dark'],False)
box('street',(0,-8,0),(45,5,.08),'dark');box('tram',(-4,-8,1.3),(6,1.7,2),'red');box('tram roof',(-4,-8,2.4),(6,1.8,.2),'snow')
for x in [-6,-5,-4,-3,-2]:box('tram window',(x,-8.88,1.65),(.7,.04,.8),W[0])
for y in [-8.5,-7.5]:box('rail',(0,y,.08),(40,.05,.06),'metal')
box('bus stop',(6,-6,1.5),(3,.15,2.7),'metal');box('shelter roof',(6,-6,3),(3.4,1.5,.15),'snow');box('kiosk',(10,-5,1.2),(2.5,2,2.4),'green');box('kiosk window',(10,-6.02,1.5),(1.8,.04,1.1),W[0])
for x,y in [(-8,-5),(7,-5)]:cyl('streetlight',(x,y,3),.08,6,'metal');box('sodium lantern',(x,y,6),(.5,.5,.15),W[0])
for l in L['lights']:
 d=bpy.data.lights.new(l['name'],'AREA');d.energy=l['power'];d.color=l['color'];d.size=l['size'];o=bpy.data.objects.new(l['name'],d);s.collection.objects.link(o);o.location=l['position'];o.rotation_euler=(Vector(l['target'])-o.location).to_track_quat('-Z','Y').to_euler()
fog=box('distant fog',(0,22,14),(52,20,32),'dark',False);fm=bpy.data.materials.new('fog');fm.use_nodes=True;n=fm.node_tree.nodes;n.clear();v=n.new('ShaderNodeVolumePrincipled');v.inputs['Density'].default_value=L['fog']['density'];v.inputs['Color'].default_value=(*L['fog']['color'],1);out=n.new('ShaderNodeOutputMaterial');fm.node_tree.links.new(v.outputs['Volume'],out.inputs['Volume']);fog.data.materials.clear();fog.data.materials.append(fm)
for i in range(L['snow']['count']):box('snowflake',tuple(rng.uniform(*b) for b in L['snow']['bounds']),(L['snow']['size'],)*3,'snow',False)
bpy.ops.object.camera_add(location=L['camera']['position']);cam=bpy.context.object;cam.rotation_euler=(Vector(L['camera']['target'])-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=L['camera']['scale'];cam.data.clip_start=L['camera']['near'];cam.data.clip_end=L['camera']['far'];s.camera=cam;bpy.context.view_layer.update()
(OUT/'camera.json').write_text(json.dumps(dict(convention='Blender Z up; Three conversion (x,z,-y)',position=list(cam.location),rotation_euler=list(cam.rotation_euler),matrix_world=[list(row) for row in cam.matrix_world],ortho_scale=cam.data.ortho_scale,resolution=L['resolution'],near=cam.data.clip_start,far=cam.data.clip_end),indent=2));(OUT/'lights.json').write_text(json.dumps(L['lights'],indent=2))
s.use_nodes=True;s.view_layers[0].use_pass_z=True;nt=s.node_tree;nt.nodes.clear();rl=nt.nodes.new('CompositorNodeRLayers');comp=nt.nodes.new('CompositorNodeComposite');nt.links.new(rl.outputs['Image'],comp.inputs[0]);dep=nt.nodes.new('CompositorNodeOutputFile');dep.base_path=str(OUT);dep.format.file_format='OPEN_EXR';dep.format.color_depth='32';dep.file_slots[0].path='depth';nt.links.new(rl.outputs['Depth'],dep.inputs[0]);s.render.image_settings.file_format='PNG';s.render.filepath=str(OUT/'raw.png');bpy.ops.wm.save_as_mainfile(filepath=str(HERE/'flat.blend'));bpy.ops.render.render(write_still=True)
im=bpy.data.images.load(str(OUT/'raw.png'),check_existing=False);w,h=im.size;rgb=np.array(im.pixels[:],dtype=np.float32).reshape(h,w,4)[:,:,:3];rgb=np.where(rgb<=.0031308,12.92*rgb,1.055*np.maximum(rgb,0)**(1/2.4)-.055);pal=np.array([[int(c[i:i+2],16)/255 for i in (0,2,4)] for c in L['palette']]);delta=np.max(np.abs(rgb-np.roll(rgb,1,axis=1)),axis=2);bayer=np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]])/16-.5;noise=np.tile(bayer,(math.ceil(h/4),math.ceil(w/4)))[:h,:w];rgb+=((delta<L['gradient_threshold'])*noise*L['dither']/32)[:,:,None];idx=np.argmin(np.sum((rgb[:,:,None,:]-pal[None,None,:,:])**2,axis=3),axis=2);q=pal[idx];linear=np.where(q<=.04045,q/12.92,((q+.055)/1.055)**2.4);rgba=np.concatenate([linear,np.ones((h,w,1))],axis=2)
for factor,name in [(1,'beauty.png'),(4,'beauty-x4.png')]:
 data=np.repeat(np.repeat(rgba,factor,axis=0),factor,axis=1);img=bpy.data.images.new(name,width=w*factor,height=h*factor);img.pixels.foreach_set(data.astype(np.float32).ravel());img.filepath_raw=str(OUT/name);img.file_format='PNG';img.save()
for f in OUT.glob('depth*.exr'):
 if f.name!='depth.exr':f.replace(OUT/'depth.exr');break
