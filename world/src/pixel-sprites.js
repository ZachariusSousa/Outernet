import {look as L} from './look.js';
const A=L.agents;
export async function loadSprites(){
 const images=new Map(),manifest=await fetch('/art/agents/sprites/sprites.json').then(r=>r.json());
 async function load(path){const im=new Image();im.src=path;await im.decode();images.set(path,im)}
 await Promise.all(Object.values(manifest).flatMap(r=>r.frames.map(f=>load('/art/agents/sprites/'+f))));
 // Recolor only body pixels from the untinted approved frame on each reload.
 // This makes look.agents.tints effective without rebuilding the sprite assets.
 for(const [kind,rig] of Object.entries(manifest)){const rgb=rig.bodyColor.slice(1).match(/../g).map(v=>parseInt(v,16));for(const file of rig.frames){const base=images.get('/art/agents/sprites/'+file.replace(kind+'-'+file.split('-')[1]+'-',kind+'-1-'));const tint=A.tints[Number(file.split('-')[1])];const frame=document.createElement('canvas');[frame.width,frame.height]=rig.size;const fc=frame.getContext('2d');fc.drawImage(base,0,0);const pixels=fc.getImageData(0,0,...rig.size);for(let i=0;i<pixels.data.length;i+=4)if(rgb.every((v,j)=>pixels.data[i+j]===v))for(let j=0;j<3;j++)pixels.data[i+j]=Math.round(rgb[j]*(1+tint));fc.putImageData(pixels,0,0);images.set('/art/agents/sprites/'+file,frame)}}
 const props=['veil','saxophone','diving-helmet','hammer','basket','scroll','knight','racing-helmet','rocket','crown','cheese','die'];
 await Promise.all([...props.map(p=>'/art/agents/props/'+p+'.svg'),...['letter','bundle','canvas'].map(p=>'/art/agents/planes/'+p+'.svg')].map(load));
 function rect(c,color,x,y,w,h){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)}
 function item(c,kind,t){
  const paper=A.paper,ink=A.ink;
  if(kind==='book'){rect(c,ink,-5,-7,10,7);rect(c,paper,-4,-6,3,5);rect(c,paper,1,-6,3,5);if(t)rect(c,A.sticky,-1,-7,2,7)}
  if(kind==='laptop'){rect(c,ink,-5,-9,10,7);rect(c,L.art.palette[4],-4,-8,8,4);rect(c,paper,-6,-2,12,2)}
  if(kind==='controller'){rect(c,ink,-5,-5,10,4);rect(c,paper,-4,-4,3,1);rect(c,paper,-3,-5,1,3);rect(c,A.sticky,3,-4,1,1)}
  if(kind==='headphones'){rect(c,ink,-10,-21,20,2);rect(c,ink,-11,-20,2,7);rect(c,ink,9,-20,2,7);rect(c,paper,-12,-17,3,5);rect(c,paper,9,-17,3,5)}
  if(kind==='snack'){rect(c,A.sticky,-3,-6,6,5);rect(c,paper,-3,-2,6,2)}
 }
 function agent(c,a,time){
  const p=a.g.position,walking=!!a.move,pose=walking?'stand':a.pose,working=time<a.until;
  const bob=Math.round(Math.sin(time*A.bobSpeed+a.index)*A.bob),hop=walking?Math.round(Math.abs(Math.sin(time*A.hopSpeed))*A.hop):0;
  c.save();c.globalAlpha=A.shadowAlpha;c.fillStyle=A.shadow;c.fillRect(Math.round(p.x-A.shadowWidth/2),Math.round(p.y),A.shadowWidth,1);c.restore();
  c.save();c.translate(Math.round(p.x),Math.round(p.y)+bob-hop-(a.species==='moth'?A.hover:0));
  if(a.facing==='left')c.scale(-1,1);
  if(pose==='lie'&&!walking){c.translate(0,-8);c.rotate(-Math.PI/2);c.translate(0,12)}
  const sitting=['sit','floor'].includes(pose),blink=time>a.blinkAt||a.restStyle==='nap',flap=a.species==='moth'?(Math.floor(time*A.flapSpeed)%2):0;
  const file=`/art/agents/sprites/${a.species}-${a.index%3}-${sitting?'sit':'stand'}-${Number(blink)}-${flap}.png`,im=images.get(file);
  if(im){c.drawImage(im,-16,-23+(sitting?A.sitLower:0));
   // A short discrete pulse, never a blurred glow or subpixel transform.
   if(working&&a.engine==='diffusion'&&Math.floor(time*A.shimmer)%2){c.globalAlpha=A.toolPulse;c.globalCompositeOperation='screen';c.drawImage(im,-16,-23+(sitting?A.sitLower:0));c.globalCompositeOperation='source-over';c.globalAlpha=1}
  }else{rect(c,L.art.palette[a.engine==='diffusion'?31:24],-10,-18,20,16);rect(c,A.ink,-6,-12,2,blink?1:2);rect(c,A.ink,4,-12,2,blink?1:2);if(a.engine==='diffusion')for(const x of [-8,-3,3,8])rect(c,L.art.palette[31],x,-2,2,4);else{rect(c,L.art.palette[24],-10,-23,4,6);rect(c,L.art.palette[24],6,-23,4,6)}}
  const prop=images.get('/art/agents/props/'+props[a.index%12]+'.svg');c.drawImage(prop,Math.round(-A.itemSize/2),-A.effectHeight,A.itemSize,A.itemSize);
  const tap=working&&a.engine==='ar'?Math.floor(time*A.shimmer)%2:0;c.translate(0,-tap);
  const held=working&&['load_skill','open_page'].includes(a.tool)?'book':working&&a.tool==='search'?'laptop':a.state==='studying'?'book':a.state==='helping'?'laptop':a.state==='playing'?'controller':a.state==='serving_owner'?'headphones':a.restStyle==='snack'?'snack':null;
  if(held)item(c,held,working&&a.tool==='open_page'&&Math.floor(time*A.shimmer)%2);
  if(working&&a.tool==='search'){rect(c,A.ink,-6,-13,3,1);rect(c,A.ink,3,-13,3,1)}
  c.restore();
 }
 function effect(c,f,time){const p=(time-f.start)/f.duration;
  if(f.kind==='plane'){
   const x=Math.round(f.from.x+(f.to.x-f.from.x)*p),y=Math.round(f.from.y+(f.to.y-f.from.y)*p-A.effectHeight-Math.sin(p*Math.PI)*A.planeArc+(f.declined?Math.sin(p*A.planeFlutterSpeed)*A.planeFlutter+p*A.effectRise:0));
   c.save();c.translate(x,y);if(f.to.x<f.from.x)c.scale(-1,1);
   if(f.declined){rect(c,A.paper,-4,0,8,1);rect(c,A.paper,-2,1,5,1)}else c.drawImage(images.get('/art/agents/planes/'+({forward:'letter',text_help:'bundle',canvas:'canvas'}[f.mode]||'letter')+'.svg'),-5,-4,10,8);c.restore();return;
  }
  const x=Math.round(f.position.x),y=Math.round(f.position.y-A.effectHeight-p*A.effectRise);c.save();c.globalAlpha=1-p*.6;
  if(f.kind==='sticky'||f.kind==='save_note'){rect(c,A.sticky,x+12,y+9,4,4);rect(c,A.ink,x+13,y+10,2,1)}
  else if(f.kind==='sleep'){c.font=L.ui.pixelFont;c.fillStyle=A.paper;c.fillText('z',x,y)}
  else if(f.kind==='sparkle'||f.kind==='answer'||f.kind==='poof'){const d=Math.round(2+p*5);for(const [dx,dy] of [[-d,0],[d,0],[0,-d],[0,d]])rect(c,A.sparkle,x+dx,y+dy,1,1)}
  else if(f.kind==='open_page'||f.kind==='load_skill'){c.save();c.translate(x,y);item(c,'book',Math.floor(time*A.shimmer)%2);c.restore()}
  else if(f.kind==='ask_peer'){rect(c,A.paper,x-3,y,6,4);rect(c,A.ink,x-2,y+1,4,1)}
  else if(f.kind==='search'){rect(c,A.paper,x-2,y-2,4,1);rect(c,A.paper,x-2,y+1,4,1);rect(c,A.paper,x-2,y-1,1,2);rect(c,A.paper,x+1,y-1,1,2);rect(c,A.paper,x+2,y+2,2,2)}
  c.restore();
 }
 return {agent,effect};
}
