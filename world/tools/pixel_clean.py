"""Recover enlarged pixel grids, nearest-sample to native size, palette snap without dithering.
AI art may have no consistent grid: detection is conservative; --pixel-size overrides it.
Output preserves aspect ratio with letterboxing, never stretching the input.
"""
import argparse,json,subprocess
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
def settings():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {look} from './src/look.js';console.log(JSON.stringify(look.art))"],cwd=ROOT,text=True))
def detect_pixel_size(image):
 rgb=image.convert('RGB');pixels=rgb.load();profiles=[]
 for axis in (0,1):
  length,cross=(rgb.width,rgb.height) if axis==0 else (rgb.height,rgb.width)
  profile=[0]*length
  for v in range(0,cross,max(1,cross//160)):
   for u in range(1,length):
    a,b=(pixels[u-1,v],pixels[u,v]) if axis==0 else (pixels[v,u-1],pixels[v,u])
    delta=max(abs(a[i]-b[i]) for i in range(3))
    if delta>=24: profile[u]+=delta
  profiles.append(profile)
 candidates=[]
 for size in range(2,min(17,min(rgb.size)//24)):
  confidence=min(max(sum(p[phase::size]) for phase in range(size))/max(1,sum(p)) for p in profiles)
  if confidence>=.78: candidates.append((size,confidence))
 return max(candidates,default=(1,0),key=lambda c:c[0])
def clean(source,destination,size=None,pixel_size=None,trim=False,alpha_cutoff=None,key_color=None):
 config=settings();size=tuple(size or config['size']);im=Image.open(source).convert('RGBA')
 if alpha_cutoff is not None: im.putalpha(im.getchannel('A').point(lambda a:255 if a>=alpha_cutoff else 0))
 if trim and im.getchannel('A').getbbox(): im=im.crop(im.getchannel('A').getbbox())
 transparent=im.getchannel('A').getextrema()[0]<255
 detected,confidence=detect_pixel_size(im);grid=pixel_size or detected
 if grid<1: raise ValueError('Pixel size must be positive')
 native=im.resize((max(1,round(im.width/grid)),max(1,round(im.height/grid))),Image.Resampling.NEAREST)
 ratio=min(size[0]/native.width,size[1]/native.height)
 fitted=native.resize((max(1,round(native.width*ratio)),max(1,round(native.height*ratio))),Image.Resampling.NEAREST)
 canvas=Image.new('RGBA',size,(0,0,0,0) if transparent else (key_color or config['matte']));canvas.alpha_composite(fitted,((size[0]-fitted.width)//2,(size[1]-fitted.height)//2))
 colors=[tuple(bytes.fromhex(c.lstrip('#'))) for c in config['palette']]
 if key_color: colors.append(tuple(bytes.fromhex(key_color.lstrip('#'))))
 pal=Image.new('P',(1,1));pal.putpalette([v for c in colors+[colors[-1]]*(256-len(colors)) for v in c])
 out=canvas.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGBA');out.putalpha(canvas.getchannel('A'));destination=Path(destination);destination.parent.mkdir(parents=True,exist_ok=True);out.save(destination)
 report=dict(source=list(im.size),detected_pixel_size=detected,confidence=round(confidence,3),used_pixel_size=grid,output=list(out.size),colors=len(out.getcolors(1000000)),dithering=False);print(json.dumps(report));return report
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('input');p.add_argument('output');p.add_argument('--size',nargs=2,type=int,metavar=('WIDTH','HEIGHT'));p.add_argument('--pixel-size',type=int);p.add_argument('--trim',action='store_true',help='Trim transparent padding before sizing a sprite');p.add_argument('--alpha-cutoff',type=int,help='Snap alpha to 0/255 for clean cut-out edges');p.add_argument('--key-color',help='Preserve an exact chroma key, e.g. #FF00FF');a=p.parse_args();clean(a.input,a.output,a.size,a.pixel_size,a.trim,a.alpha_cutoff,a.key_color)
