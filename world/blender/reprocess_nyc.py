import bpy,sys,math,json
from pathlib import Path
import numpy as np
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE));from look_render import LOOK as L
OUT=HERE.parent/'art/nyc'
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

