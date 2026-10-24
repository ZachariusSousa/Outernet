// Canonical files stay separate: layout owns art instances; scene owns behavior.
export async function loadRoom(){
 const root='/art/nyc/';
 async function json(file){const r=await fetch(root+file);if(!r.ok)throw Error(`Cannot load ${file}`);return r.json()}
 const [data,layout]=await Promise.all([json('scene.json'),json('layout.json')]);
 const manifest=await json(data.assets.manifest),images=new Map();
 if(manifest.pixelScale!==data.assets.pixelScale)throw Error('Shell and sheets must use one shared source pixel scale');
 const files=[data.assets.backdrop,data.assets.shell,...Object.values(manifest.sprites).map(s=>'sprites/'+s.file)];
 await Promise.all([...new Set(files)].map(async file=>{const im=new Image();im.src=root+file;await im.decode();images.set(file,im)}));
 const byId=id=>layout.sprites.find(o=>o.id===id);
 function decorate(o){
  if(!manifest.sprites[o.sprite])throw Error(`Unknown sprite: ${o.sprite}`);
  o.scale=Math.max(1,Math.round(o.scale||1));o.level??=0;o.layer||='object';o.flip=!!o.flip;
  Object.defineProperties(o,{
   width:{configurable:true,get(){return manifest.sprites[this.sprite].width*this.scale}},
   height:{configurable:true,get(){return manifest.sprites[this.sprite].height*this.scale}},
   foot:{configurable:true,get(){return {x:this.x+this.width/2,y:this.y+(this.baseLine??manifest.sprites[this.sprite].baseLine)*this.scale}}},
  });return o;
 }
 layout.sprites.forEach(decorate);
 function transform(anchor,p){const o=byId(anchor?.spriteId);if(!o)return {x:p.x,y:p.y};return {x:o.x+(o.flip?o.width-p.x*o.scale:p.x*o.scale),y:o.y+p.y*o.scale}}
 function inverse(anchor,p){const o=byId(anchor?.spriteId);if(!o)return p;return {x:(o.flip?o.width-(p.x-o.x):p.x-o.x)/o.scale,y:(p.y-o.y)/o.scale}}
 function sync(){for(const s of data.spots){const o=byId(s.anchor?.spriteId);if(o){Object.assign(s,transform(s.anchor,s.anchor));s.level=s.anchor.level??o.level}}}
 function attach(s,id){if(!id){delete s.anchor;return}const p=inverse({spriteId:id},s);s.anchor={spriteId:id,x:Math.round(p.x),y:Math.round(p.y)};sync()}
 function setSpot(s,p){if(s.anchor){const local=inverse(s.anchor,p);s.anchor.x=Math.round(local.x);s.anchor.y=Math.round(local.y)}Object.assign(s,p)}
 function region(r){return r.polygon.map(([x,y])=>{const p=transform(r.anchor,{x,y});return [Math.round(p.x),Math.round(p.y)]})}
 function setRegionPoint(r,i,p){const q=inverse(r.anchor,p);r.polygon[i]=[Math.round(q.x),Math.round(q.y)]}
 function point(p){return p.anchor?transform(p.anchor,p):p}
 function setPoint(p,q){Object.assign(p,p.anchor?inverse(p.anchor,q):q)}
 let serial=0;
 function addSprite(sprite,x,y){const o=decorate({id:sprite+'-'+Date.now()+'-'+serial++,sprite,x,y,level:0,scale:1,flip:false,layer:manifest.sprites[sprite].category==='building'?'city':sprite.includes('rug')?'floor':'object'});layout.sprites.push(o);return o}
 function removeSprite(o){for(const s of data.spots)if(s.anchor?.spriteId===o.id)delete s.anchor;data.glows=data.glows.filter(r=>r.anchor?.spriteId!==o.id);data.steam=data.steam.filter(r=>r.anchor?.spriteId!==o.id);layout.sprites.splice(layout.sprites.indexOf(o),1)}
 function duplicate(o){const copy=addSprite(o.sprite,o.x+8,o.y+8);Object.assign(copy,{scale:o.scale,level:o.level,flip:o.flip,layer:o.layer,...(o.baseLine!==undefined?{baseLine:o.baseLine}:{})});for(const key of ['spots','glows','steam']){for(const child of data[key].slice())if(child.anchor?.spriteId===o.id){const next=structuredClone(child);if(next.id)next.id+='-'+serial++;next.anchor.spriteId=copy.id;data[key].push(next)}}sync();return copy}
 // The playback adapter expects spots and paths; it never owns layout state.
 data.objects=layout.sprites;
 sync();
 const exportScene=()=>{const {objects,...canonical}=data;return JSON.stringify(canonical,null,2)};
 return {data,layout,manifest,images,byId,decorate,transform,inverse,sync,attach,setSpot,region,setRegionPoint,point,setPoint,addSprite,removeSprite,duplicate,exportScene,exportLayout:()=>JSON.stringify(layout,null,2)};
}
