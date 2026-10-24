"""Clean an image to exact texel dimensions and the shared look.js palette (no dithering)."""
import argparse,json,subprocess
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
def palette():
 output=subprocess.check_output(['node','--input-type=module','-e',"import {look} from './src/look.js';console.log(JSON.stringify(look.textures.palette))"],cwd=ROOT,text=True)
 return json.loads(output)
def clean(source,destination,size):
 colors=palette();p=Image.new('P',(1,1));rgb=[tuple(bytes.fromhex(c.lstrip('#'))) for c in colors];p.putpalette([v for c in (rgb+[rgb[-1]]*(256-len(rgb))) for v in c]);im=Image.open(source).convert('RGBA');alpha=im.getchannel('A').resize(size,Image.Resampling.NEAREST);im=im.convert('RGB').resize(size,Image.Resampling.BOX).quantize(palette=p,dither=Image.Dither.NONE).convert('RGBA');im.putalpha(alpha);im.save(destination)
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('input');a.add_argument('output');a.add_argument('--size',nargs=2,type=int,required=True);v=a.parse_args();clean(v.input,v.output,tuple(v.size))
