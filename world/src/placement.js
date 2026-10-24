import {look as L} from './look.js';

export function createPlacement(c,state,world){
 const $=s=>document.querySelector(s),{data,layout,manifest}=state;
 let selection=null,draft=null;
 const status=text=>$('#edit-status').textContent=text;
 const round=p=>({x:Math.round(p.x),y:Math.round(p.y)});
 const matches=(entry,filter)=>filter==='all'||filter===entry.kind||(filter==='city'&&entry.kind==='furniture'&&entry.o.layer==='city');
 const masks=new Map();
 function hitSprite(o,p){
  const x=Math.floor((p.x-o.x)/o.scale),y=Math.floor((p.y-o.y)/o.scale),asset=manifest.sprites[o.sprite];
  if(x<0||y<0||x>=asset.width||y>=asset.height)return false;
  if(!masks.has(o.sprite)){const canvas=document.createElement('canvas');canvas.width=asset.width;canvas.height=asset.height;const ctx=canvas.getContext('2d');ctx.drawImage(state.images.get('sprites/'+asset.file),0,0);masks.set(o.sprite,ctx.getImageData(0,0,asset.width,asset.height).data)}
  return masks.get(o.sprite)[(y*asset.width+(o.flip?asset.width-1-x:x))*4+3]>0;
 }
 function entries(){return [...layout.sprites.map(o=>({kind:'furniture',o})),...layout.lightLines.map(o=>({kind:'lightLines',o})),...['spots','paths','windows','glows','steam'].flatMap(kind=>data[kind].map((o,i)=>({kind,o,id:o.id||kind+'-'+i})))]}
 function list(){const select=$('#edit-object');select.replaceChildren(new Option('Select object…',''));entries().forEach((e,i)=>{if(matches(e,$('#edit-kind').value))select.add(new Option(e.o.id||e.id,String(i)))});if(selection){const i=entries().findIndex(e=>e.o===selection.o);select.value=i<0?'':String(i)}}
 function ownerOptions(){const select=$('#attach-sprite');select.replaceChildren(new Option('Free-standing',''));for(const o of layout.sprites)select.add(new Option(o.id,o.id))}
 function select(entry){
  selection=entry;list();ownerOptions();const kind=entry?.kind,o=entry?.o;
  for(const [id,show] of [['sprite-fields',kind==='furniture'],['spot-fields',kind==='spots'],['floor-fields',['furniture','spots','paths'].includes(kind)],['attach-fields',['spots','glows','steam'].includes(kind)],['line-fields',kind==='lightLines'],['path-fields',kind==='paths'],['glow-fields',kind==='glows']])$('#'+id).hidden=!show;
  $('#mirror').hidden=kind!=='furniture';$('#duplicate').hidden=kind!=='furniture';
  if(!o){status('Choose a sprite, spot, path or light line.');return}
  if(['furniture','spots','paths'].includes(kind))$('#floor-level').value=String(o.level??0);
  if(kind==='furniture'){$('#sprite-layer').value=o.layer;$('#sprite-scale').value=o.scale;$('#base-line').value=o.baseLine??manifest.sprites[o.sprite].baseLine}
  if(kind==='spots'){for(const id of ['pose','facing','group'])$('#'+id).value=o[id]||'';$('#tags').value=o.tags.join(',')}
  $('#attach-sprite').value=o.anchor?.spriteId||'';
  if(kind==='lightLines'){$('#line-style').value=o.style;$('#line-enabled').checked=o.enabled!==false}
  if(kind==='paths'){$('#path-type').value=o.type||'walk';$('#path-vertex').replaceChildren(...o.points.map((p,i)=>new Option('Vertex '+i,String(i))));showVertex()}
  if(kind==='glows')$('#glow-style').value=o.style;
  status(`${o.id||entry.id}: drag handles. Shift-click adds a vertex; Alt-click removes one.`);
 }
 function showVertex(){const o=selection?.o,p=o?.points?.[+$('#path-vertex').value];if(p)$('#vertex-level').value=String(p.level??o.level??0)}
 function level(){return +$('#floor-level').value||0}
 function handles(){const result=[],filter=$('#edit-kind').value;
  for(const entry of entries()){
   const {o,kind}=entry;if(!matches(entry,filter))continue;
   const add=(p,type,set,index)=>result.push({...p,type,set,entry,index});
   if(kind==='furniture'){
    add({x:o.x+o.width/2,y:o.y+o.height/2},'center',q=>{o.x=Math.round(q.x-o.width/2);o.y=Math.round(q.y-o.height/2);state.sync()});
    add(o.foot,'base',q=>{o.baseLine=Math.max(0,Math.min(manifest.sprites[o.sprite].height,Math.round((q.y-o.y)/o.scale)))});
   }
   if(kind==='spots')add(o,'center',q=>state.setSpot(o,round(q)));
   if(kind==='steam')add(state.point(o),'center',q=>state.setPoint(o,round(q)));
   if(o.points){o.points.forEach((p,i)=>add(p,'vertex',q=>Object.assign(p,round(q)),i));const center=o.points.reduce((p,q)=>({x:p.x+q.x/o.points.length,y:p.y+q.y/o.points.length}),{x:0,y:0});add(center,'center',q=>{const dx=Math.round(q.x-center.x),dy=Math.round(q.y-center.y);o.points.forEach(p=>{p.x+=dx;p.y+=dy});center.x+=dx;center.y+=dy})}
   if(o.polygon){
    const points=kind==='glows'?state.region(o):o.polygon;
    points.forEach(([x,y],i)=>add({x,y},'vertex',q=>{if(kind==='glows')state.setRegionPoint(o,i,round(q));else o.polygon[i]=[Math.round(q.x),Math.round(q.y)]},i));
    let center={x:points.reduce((s,p)=>s+p[0],0)/points.length,y:points.reduce((s,p)=>s+p[1],0)/points.length};
    add(center,'center',q=>{const dx=Math.round(q.x-center.x),dy=Math.round(q.y-center.y);const source=kind==='glows'?state.region(o):o.polygon.map(p=>p.slice());source.forEach(([x,y],i)=>{if(kind==='glows')state.setRegionPoint(o,i,{x:x+dx,y:y+dy});else o.polygon[i]=[x+dx,y+dy]});for(const r of o.reflections||[])for(const p of r){p[0]+=dx;p[1]+=dy}center.x+=dx;center.y+=dy});
    for(const line of o.reflections||[])line.forEach(p=>add({x:p[0],y:p[1]},'reflection',q=>{p[0]=Math.round(q.x);p[1]=Math.round(q.y)}));
   }
  }return result;
 }
 function color(kind){return kind==='furniture'?L.placement.foot:kind==='spots'?L.placement.spot:kind==='paths'?L.placement.path:kind==='windows'?L.placement.window:L.placement.light}
 function draw(){c.save();c.font=L.placement.font;c.lineWidth=L.placement.lineWidth;const filter=$('#edit-kind').value;
  for(const {kind,o} of entries()){
   if(!matches({kind,o},filter))continue;c.strokeStyle=color(kind);c.fillStyle=color(kind);
   if(kind==='furniture'){c.strokeRect(o.x,o.y,o.width,o.height);c.beginPath();c.moveTo(o.x,o.foot.y);c.lineTo(o.x+o.width,o.foot.y);c.stroke()}
   const points=o.points?.map(p=>[p.x,p.y])||(o.polygon?(kind==='glows'?state.region(o):o.polygon):null);
   if(points){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));if(o.polygon)c.closePath();c.stroke()}
  }
  for(const h of handles()){c.fillStyle=color(h.entry.kind);c.fillRect(Math.round(h.x)-1,Math.round(h.y)-1,L.placement.radius,L.placement.radius);if(h.entry.o===selection?.o&&h.type==='center')c.fillText(h.entry.o.id||h.entry.id,Math.round(h.x)+4,Math.round(h.y)-3)}
  if(draft?.points?.length){c.strokeStyle=L.placement.light;c.beginPath();draft.points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke()}c.restore();
 }
 function begin(kind){
  if(kind==='furniture'){draft={kind:'sprite',sprite:$('#sprite-choice').value};status('Click the room to place '+draft.sprite);return}
  if(['spots','steam','paths','lightLines','windows','glows'].includes(kind)){draft={kind,points:[]};status('Click points; Enter finishes paths/polygons. Esc cancels.');return}
  status('Choose a layer before adding an object.');
 }
 function down(p,e){
  if(draft){
   if(draft.kind==='sprite'){const o=state.addSprite(draft.sprite,p.x,p.y);o.level=level();draft=null;select({kind:'furniture',o});return {consumed:true}}
   if(draft.kind==='spots'||draft.kind==='steam'){const kind=draft.kind,o={...p};if(kind==='spots')Object.assign(o,{id:'spot-'+Date.now(),level:level(),tags:['comfy'],pose:'stand',facing:'right'});data[kind].push(o);draft=null;select({kind,o});return {consumed:true}}
   draft.points.push({...p,level:level()});return {consumed:true};
  }
  if(e.shiftKey&&selection){const o=selection.o;if(o.points)o.points.push({...p,level:level()});else if(o.polygon){const q=selection.kind==='glows'?state.inverse(o.anchor,p):p;o.polygon.push([Math.round(q.x),Math.round(q.y)])}return {consumed:true}}
  const h=handles().sort((a,b)=>(a.x-p.x)**2+(a.y-p.y)**2-((b.x-p.x)**2+(b.y-p.y)**2)).find(h=>Math.hypot(h.x-p.x,h.y-p.y)<L.placement.hitRadius);
  if(h){select(h.entry);if(h.entry.kind==='paths'&&h.type==='vertex'){$('#path-vertex').value=String(h.index);showVertex()}if(e.altKey&&h.type==='vertex'){const points=h.entry.o.points||h.entry.o.polygon;if(points.length>(h.entry.o.polygon?3:2))points.splice(h.index,1);return {consumed:true}}const dx=h.x-p.x,dy=h.y-p.y;return {handle:{...h,set(q){h.set({x:q.x+dx,y:q.y+dy})}},consumed:true}}
  // Large neighbors can have their center offscreen. Drag any opaque visible pixel.
  const filter=$('#edit-kind').value,candidates=entries().filter(e=>e.kind==='furniture'&&matches(e,filter)).sort((a,b)=>((b.o.layer==='city'?-1e6:0)+b.o.foot.y)-((a.o.layer==='city'?-1e6:0)+a.o.foot.y));
  const entry=candidates.find(e=>hitSprite(e.o,p));
  if(entry){select(entry);const {o}=entry,dx=p.x-o.x,dy=p.y-o.y;return {consumed:true,handle:{set(q){o.x=Math.round(q.x-dx);o.y=Math.round(q.y-dy);state.sync()}}}}
  return {};
 }
 function finish(){if(!draft)return;const {kind,points}=draft;if(!points)return;
  if(['paths','lightLines'].includes(kind)&&points.length>=2){const o={id:kind+'-'+Date.now(),points};if(kind==='paths'){o.type=$('#path-type').value||'walk';o.level=level();data.paths.push(o)}else{o.style=$('#line-style').value||'string';o.enabled=true;layout.lightLines.push(o)}draft=null;select({kind,o})}
  else if(['windows','glows'].includes(kind)&&points.length>=3){const o={id:kind+'-'+Date.now(),polygon:points.map(p=>[p.x,p.y])};if(kind==='windows')o.reflections=[];else o.style=$('#glow-style').value||'lamp';data[kind].push(o);draft=null;select({kind,o})}
 }
 function remove(){if(!selection)return;const {kind,o}=selection;if(kind==='furniture')state.removeSprite(o);else{const list=kind==='lightLines'?layout.lightLines:data[kind];if(kind==='spots'&&list.length===1)return;list.splice(list.indexOf(o),1)}select(null)}
 async function copy(text,name){if(name==='layout.json')window.exportedLayout=text;else window.exportedScene=text;try{await navigator.clipboard.writeText(text);status('Copied '+name)}catch{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}}
 for(const [name,asset] of Object.entries(manifest.sprites))$('#sprite-choice').add(new Option(`${name} · ${asset.width}×${asset.height}`,name));
 const preview=()=>$('#sprite-preview').src='/art/nyc/sprites/'+manifest.sprites[$('#sprite-choice').value].file;$('#sprite-choice').onchange=preview;preview();
 $('#add-sprite').onclick=()=>begin('furniture');$('#edit-kind').onchange=()=>{select(null);list()};$('#edit-object').onchange=e=>select(e.target.value===''?null:entries()[+e.target.value]);
 $('#new-polygon').onclick=()=>begin($('#edit-kind').value);$('#delete-object').onclick=remove;
 $('#mirror').onclick=()=>{if(selection?.kind==='furniture'){selection.o.flip=!selection.o.flip;state.sync()}};
 $('#duplicate').onclick=()=>{if(selection?.kind==='furniture')select({kind:'furniture',o:state.duplicate(selection.o)})};
 $('#sprite-layer').onchange=e=>{if(selection?.kind==='furniture')selection.o.layer=e.target.value};
 $('#sprite-scale').onchange=e=>{if(selection?.kind==='furniture'){selection.o.scale=Math.max(1,Math.round(+e.target.value||1));state.sync();select(selection)}};
 $('#base-line').onchange=e=>{if(selection?.kind==='furniture')selection.o.baseLine=Math.max(0,Math.min(manifest.sprites[selection.o.sprite].height,Math.round(+e.target.value)))};
 for(const key of ['pose','facing','group','tags'])$('#'+key).onchange=e=>{if(selection?.kind==='spots')selection.o[key]=key==='tags'?e.target.value.split(',').map(t=>t.trim()).filter(Boolean):e.target.value};
 $('#floor-level').onchange=e=>{if(!selection)return;selection.o.level=+e.target.value;if(selection.kind==='spots'&&selection.o.anchor)selection.o.anchor.level=selection.o.level;if(selection.kind==='paths'&&selection.o.type!=='steps')selection.o.points.forEach(p=>p.level=selection.o.level);state.sync()};
 $('#attach-sprite').onchange=e=>{if(!selection)return;const {kind,o}=selection,id=e.target.value;if(kind==='spots')state.attach(o,id);else if(kind==='glows'){const points=state.region(o);if(id)o.anchor={spriteId:id};else delete o.anchor;o.polygon=points.map(([x,y])=>{const p=state.inverse(o.anchor,{x,y});return [Math.round(p.x),Math.round(p.y)]})}else if(kind==='steam'){const p=state.point(o);if(id)o.anchor={spriteId:id};else delete o.anchor;Object.assign(o,state.inverse(o.anchor,p))}select(selection)};
 $('#line-style').onchange=e=>{if(selection?.kind==='lightLines')selection.o.style=e.target.value};$('#line-enabled').onchange=e=>{if(selection?.kind==='lightLines')selection.o.enabled=e.target.checked};
 $('#path-type').onchange=e=>{if(selection?.kind==='paths')selection.o.type=e.target.value};$('#path-vertex').onchange=showVertex;$('#vertex-level').onchange=e=>{if(selection?.kind==='paths')selection.o.points[+$('#path-vertex').value].level=+e.target.value};$('#glow-style').onchange=e=>{if(selection?.kind==='glows')selection.o.style=e.target.value};
 $('#export').onclick=()=>copy(state.exportScene(),'scene.json');$('#export-layout').onclick=()=>copy(state.exportLayout(),'layout.json');
 function toggle(value){world.setPlacement(value);$('#editor').hidden=!value;$('#export-layout').hidden=!value;draft=null;list()}
 $('#place').onclick=()=>toggle(!world.placement);
 return {draw,down,finish,toggle,select,entries,handles,get selection(){return selection},cancel(){draft=null}};
}
