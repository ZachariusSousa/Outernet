// Canvas renderer recovered from f5d6064: native-pixel compositing and foot-y sorting.
// The illustrated room is ONE image; occluders are clipped redraws of that image.
import {look as L} from './look.js';
import {startPlayback} from './canvas-playback.js';
import {loadSprites} from './pixel-sprites.js';
const $=s=>document.querySelector(s),canvas=$('canvas'),ctx=canvas.getContext('2d',{alpha:false}),stage=$('#stage');
const style=document.createElement('style');style.textContent=`
*{box-sizing:border-box}body{margin:0;overflow:hidden;background:${L.view.background};color:${L.ui.text};font:${L.ui.font}}
header{height:${L.view.header}px;display:flex;align-items:center;justify-content:space-between;padding:0 28px}small{font-size:9px;letter-spacing:.2em;color:${L.ui.muted}}h1{font:italic 23px Georgia;margin:5px 0}#zoom-label{color:${L.ui.muted};font-size:11px}
#stage{position:absolute;inset:${L.view.header}px 0 ${L.view.footer}px;overflow:hidden}canvas{width:100%;height:100%;display:block;image-rendering:pixelated;touch-action:none}
#playback{position:absolute;bottom:25px;left:0;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}button,select,label,input{background:${L.ui.panel};color:inherit;border:1px solid ${L.ui.border};padding:6px;font:inherit;border-radius:4px}button,label{cursor:pointer}input[type=file]{display:none}footer{position:absolute;bottom:5px;left:0;width:100%;text-align:center;color:${L.ui.muted};font-size:10px;pointer-events:none}#run{color:${L.ui.muted};font-size:10px}
#card{position:absolute;right:16px;top:${L.view.header+8}px;width:${L.ui.cardWidth}px;max-height:70vh;overflow:auto;padding:18px;background:${L.ui.panel};border:1px solid ${L.ui.border};z-index:3}#card p{font-size:12px}#card h2{margin:0 0 12px}#card pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:10px}#hover{display:none;position:absolute;pointer-events:none;padding:5px;background:${L.ui.panel};font-family:monospace;z-index:4}
#editor{position:absolute;left:12px;top:${L.view.header+8}px;background:${L.ui.panel};border:1px solid ${L.ui.border};padding:10px;width:230px;z-index:2}#editor select,#editor input{width:100%;margin-top:5px;font-size:11px}#edit-status{display:block;font-size:10px;line-height:1.5;margin-top:8px;color:${L.ui.muted}}[hidden]{display:none!important}@media(max-width:700px){header{padding:0 12px}h1{font-size:18px}footer{display:none}#playback{bottom:5px;gap:3px;font-size:10px}button,select,label{padding:4px}}
`;document.head.append(style);
const modular=new URLSearchParams(location.search).get('scene')==='modular',artOnly=new URLSearchParams(location.search).get('art')==='1',artRoot=modular?'/art/nyc/modular-v1':'/art/nyc';
const data=await fetch(artRoot+'/scene.json').then(r=>r.json()),room=new Image();room.src=artRoot+'/'+(data.room||'room.png');await room.decode();
const furniture=new Map();await Promise.all((data.objects||[]).map(async o=>{if(furniture.has(o.file))return;const im=new Image();im.src=artRoot+'/'+o.file;await im.decode();furniture.set(o.file,im)}));
const sprites=await loadSprites(),world=startPlayback(data),native=document.createElement('canvas');[native.width,native.height]=L.art.size;const c=native.getContext('2d');
let zoom=L.view.defaultZoom,pan={x:0,y:0},view={scale:1,x:0,y:0},drag=null,draft=null,editorSelection=null,last=performance.now();
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function polygon(points){c.beginPath();points.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath()}
function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;ctx.imageSmoothingEnabled=false}}
function camera(){resize();const fit=Math.max(1,Math.floor(Math.min(canvas.width/native.width,canvas.height/native.height))),scale=fit+zoom;
 if(world.follow&&zoom>0){pan.x=native.width/2-world.follow.g.position.x;pan.y=native.height/2-world.follow.g.position.y}
 const limitX=Math.max(0,(native.width-canvas.width/scale)/2),limitY=Math.max(0,(native.height-canvas.height/scale)/2);if(!world.follow){pan.x=clamp(pan.x,-limitX,limitX);pan.y=clamp(pan.y,-limitY,limitY);}
 view={scale,x:Math.round((canvas.width-native.width*scale)/2+Math.round(pan.x)*scale),y:Math.round((canvas.height-native.height*scale)/2+Math.round(pan.y)*scale)};
 $('#zoom-label').textContent=`${zoom?'Fit + '+zoom:'Fit'} Â· ${scale}Ã— Â· ${native.width} Ã— ${native.height}`;
}
function point(e){const r=canvas.getBoundingClientRect();return {x:Math.round((e.clientX-r.left-view.x)/view.scale),y:Math.round((e.clientY-r.top-view.y)/view.scale)}}
function changeZoom(z){zoom=clamp(z,0,L.view.maxExtraZoom);if(!zoom){pan={x:0,y:0};world.stopFollow()}camera()}
canvas.addEventListener('wheel',e=>{e.preventDefault();changeZoom(zoom+(e.deltaY<0?1:-1))},{passive:false});$('#zoom-in').onclick=()=>changeZoom(zoom+1);$('#zoom-out').onclick=()=>changeZoom(zoom-1);
function pickAgent(p){return world.agents.slice().sort((a,b)=>b.g.position.y-a.g.position.y).find(a=>Math.abs(p.x-a.g.position.x)<18&&p.y>a.g.position.y-28&&p.y<a.g.position.y+2)}
function lightLayers(t){
 c.save();c.globalCompositeOperation='lighter';
 for(const [i,r] of data.lights.entries()){polygon(r.polygon);c.fillStyle=r.color;c.globalAlpha=L.light.strength*(1+Math.sin(t*L.light.flickerSpeed+i)*Math.sin(t*L.light.flickerSpeed*1.7)*L.light.flickerAmount*(r.flicker??1));c.fill()}
 if(data.rgb){polygon(data.rgb.polygon);c.fillStyle=L.light.rgbColor;c.globalAlpha=L.light.rgbGlow*(1+Math.sin(t*L.light.flickerSpeed)*L.light.flickerAmount);c.fill()}
 c.restore();
}
function weather(t){
 for(const [j,w] of data.windows.entries()){
  c.save();polygon(w.polygon);c.clip();const xs=w.polygon.map(p=>p[0]),ys=w.polygon.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys),width=Math.max(...xs)-x,height=Math.max(...ys)-y;
  c.fillStyle=L.weather.snowColor;c.globalAlpha=L.weather.shimmer*(1+Math.sin(t*L.weather.shimmerSpeed));c.fillRect(x,y,width,height);
  for(const [depth,d] of L.weather.depths.entries()){c.globalAlpha=d.alpha;for(let i=0;i<d.count;i++){const px=x+((i*73+Math.sin(i)*17+t*d.drift+depth*23+j*11)%width),py=y+(i*37+t*d.speed)%height;c.fillRect(Math.round(px),Math.round(py),d.size,d.size)}}
  for(const [i,r] of w.twinkles.entries()){c.globalAlpha=L.weather.twinkleAlpha*Math.max(0,Math.sin(t*L.weather.twinkleRate+i*2));c.fillStyle=L.agents.paper;c.fillRect(r.x,r.y,r.w,r.h)}c.restore();
 }
}
function atmosphere(t){
 c.save();c.fillStyle=L.weather.steam.color;c.globalAlpha=L.weather.steam.alpha;for(const p of data.steam)for(let i=0;i<L.weather.steam.count;i++){const phase=(t*L.weather.steam.speed+i*3)%L.weather.steam.height;c.fillRect(Math.round(p.x+Math.sin(phase)*1),Math.round(p.y-phase),1,2)}
 c.fillStyle=L.weather.dust.color;c.globalAlpha=L.weather.dust.alpha;
 for(let i=0;i<L.weather.dust.count;i++){const r=data.lights[i%data.lights.length];if(!r)continue;c.save();polygon(r.polygon);c.clip();const xs=r.polygon.map(p=>p[0]),ys=r.polygon.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);c.fillRect(Math.round(x+(i*17+t*L.weather.dust.speed)%Math.max(1,Math.max(...xs)-x)),Math.round(y+(i*23+t*L.weather.dust.speed)%Math.max(1,Math.max(...ys)-y)),1,1);c.restore()}c.restore();
}
function drawFurniture(o){c.save();c.translate(o.x+(o.flipX?o.width:0),o.y);if(o.flipX)c.scale(-1,1);c.drawImage(furniture.get(o.file),0,0,o.width,o.height);c.restore()}
function render(){
 camera();c.imageSmoothingEnabled=false;c.globalAlpha=1;c.globalCompositeOperation='source-over';c.clearRect(0,0,native.width,native.height);c.drawImage(room,0,0,native.width,native.height);
 weather(world.elapsed);for(const o of data.objects||[])if(o.layer==='floor')drawFurniture(o);
 const sorted=[...(data.objects||[]).filter(o=>o.layer!=='floor').map(o=>({y:o.foot.y,draw(){drawFurniture(o)}})),...data.occluders.map(o=>({y:o.foot.y,draw(){c.save();polygon(o.polygon);c.clip();c.drawImage(room,0,0,native.width,native.height);c.restore()}})),...(artOnly?[]:world.agents).map(a=>({y:a.g.position.y,draw(){sprites.agent(c,a,world.elapsed)}}))].sort((a,b)=>a.y-b.y);sorted.forEach(o=>o.draw());atmosphere(world.elapsed);
 for(const f of artOnly?[]:world.effects)sprites.effect(c,f,world.elapsed);lightLayers(world.elapsed);
 c.save();c.globalCompositeOperation='soft-light';c.fillStyle=L.grade.warmthColor;c.globalAlpha=L.grade.warmth;c.fillRect(0,0,native.width,native.height);c.restore();
 // Stepped native-pixel vignette: no smoothing or blur in the final upscale.
 c.save();c.fillStyle=L.grade.vignetteColor;for(let i=0;i<L.grade.vignetteBands;i++){c.globalAlpha=L.grade.vignette/L.grade.vignetteBands;const b=L.grade.vignetteStep*(i+1);c.fillRect(0,0,native.width,b);c.fillRect(0,native.height-b,native.width,b);c.fillRect(0,b,b,native.height-b*2);c.fillRect(native.width-b,b,b,native.height-b*2)}c.restore();
 if(L.grade.contrast!==1){const im=c.getImageData(0,0,native.width,native.height);for(let i=0;i<im.data.length;i+=4)for(let j=0;j<3;j++)im.data[i+j]=128+(im.data[i+j]-128)*L.grade.contrast;c.putImageData(im,0,0)}
 if(world.placement)drawPlacement();ctx.fillStyle=L.view.background;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;ctx.drawImage(native,view.x,view.y,native.width*view.scale,native.height*view.scale);
}
// Editing uses the same scene coordinates as the renderer; every handle exports.
function objects(){return [...(data.objects||[]).map(o=>({kind:'furniture',o})),...data.spots.map(o=>({kind:'spots',o})),...data.paths.map(o=>({kind:'paths',o})),...data.occluders.map(o=>({kind:'occluders',o})),...data.lights.map(o=>({kind:'lights',o})),...data.windows.map(o=>({kind:'windows',o})),...(data.rgb?[{kind:'rgb',o:data.rgb}]:[]),...data.steam.map((o,i)=>({kind:'steam',o,id:'steam-'+i}))]}
function handles(){const all=[];for(const entry of objects()){
 const {kind,o}=entry,filter=$('#edit-kind').value;if(filter!=='all'&&filter!==kind)continue;
 const add=(x,y,type,set)=>all.push({x,y,type,set,entry});
 if(kind==='furniture'){add(o.x+o.width/2,o.y+o.height/2,'center',p=>{const dx=p.x-(o.x+o.width/2),dy=p.y-(o.y+o.height/2);o.x+=dx;o.y+=dy;o.foot.x+=dx;o.foot.y+=dy;for(const r of data.lights.filter(r=>(o.lightIds||[]).includes(r.id)))for(const p of r.polygon){p[0]+=dx;p[1]+=dy}});add(o.x+o.width,o.y+o.height,'size',p=>{const bottom=o.foot.y-o.y;o.width=Math.max(4,p.x-o.x);o.height=Math.max(4,p.y-o.y);o.foot.y=o.y+Math.min(bottom,o.height)})}
 if(kind==='spots'||kind==='steam')add(o.x,o.y,'center',p=>Object.assign(o,p));
 if(kind==='paths')for(const p of o.points)add(p.x,p.y,'vertex',q=>Object.assign(p,q));
 if(o.polygon){for(const p of o.polygon)add(p[0],p[1],'vertex',q=>{p[0]=q.x;p[1]=q.y});const center={x:o.polygon.reduce((v,p)=>v+p[0],0)/o.polygon.length,y:o.polygon.reduce((v,p)=>v+p[1],0)/o.polygon.length};add(center.x,center.y,'center',q=>{const dx=q.x-center.x,dy=q.y-center.y;for(const p of o.polygon){p[0]+=dx;p[1]+=dy}if(o.foot){o.foot.x+=dx;o.foot.y+=dy}if(o.twinkles)for(const t of o.twinkles){t.x+=dx;t.y+=dy}center.x=q.x;center.y=q.y})}
 if(o.foot)add(o.foot.x,o.foot.y,'foot',q=>Object.assign(o.foot,q));
 if(o.twinkles)for(const r of o.twinkles){add(r.x,r.y,'twinkle',q=>{r.x=q.x;r.y=q.y});add(r.x+r.w,r.y+r.h,'size',q=>{r.w=Math.max(1,q.x-r.x);r.h=Math.max(1,q.y-r.y)})}
 }return all}
function color(kind){return kind==='spots'?L.placement.spot:kind==='paths'?L.placement.path:kind==='occluders'?L.placement.foot:kind==='windows'?L.placement.window:L.placement.light}
function drawPlacement(){
 c.save();c.font=L.placement.font;c.lineWidth=L.placement.lineWidth;
 for(const {kind,o} of objects()){
  if($('#edit-kind').value!=='all'&&$('#edit-kind').value!==kind)continue;c.strokeStyle=color(kind);c.fillStyle=color(kind);
  if(kind==='furniture')c.strokeRect(o.x,o.y,o.width,o.height);if(o.polygon){polygon(o.polygon);c.globalAlpha=L.placement.fillAlpha;c.fill();c.globalAlpha=1;c.stroke()}
  if(o.points){c.beginPath();o.points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke()}
  if(o.foot){c.beginPath();c.moveTo(o.polygon?Math.min(...o.polygon.map(p=>p[0])):o.x,o.foot.y);c.lineTo(o.polygon?Math.max(...o.polygon.map(p=>p[0])):o.x+o.width,o.foot.y);c.stroke()}
  if(o.twinkles)for(const r of o.twinkles)c.strokeRect(r.x,r.y,r.w,r.h);
 }
 for(const h of handles()){c.fillStyle=color(h.entry.kind);c.fillRect(Math.round(h.x)-1,Math.round(h.y)-1,L.placement.radius,L.placement.radius);if(editorSelection?.o===h.entry.o&&h.type==='center')c.fillText(h.entry.o.id||h.entry.id,h.x+4,h.y-3)}
 if(draft){c.strokeStyle=L.placement.light;c.beginPath();draft.points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();for(const p of draft.points)c.fillRect(p[0],p[1],2,2)}c.restore();
}
function selectEditor(entry){editorSelection=entry;$('#spot-fields').hidden=entry?.kind!=='spots';$('#mirror').hidden=entry?.kind!=='furniture';$('#duplicate').hidden=entry?.kind!=='furniture';if(entry?.kind==='spots'){for(const key of ['pose','facing','group'])$('#'+key).value=entry.o[key]||'';$('#tags').value=entry.o.tags.join(',')}
 $('#region-fields').hidden=entry?.kind!=='lights';if(entry?.kind==='lights'){$('#light-color').value=entry.o.color;$('#light-flicker').value=entry.o.flicker??1}$('#add-twinkle').hidden=entry?.kind!=='windows';$('#edit-status').textContent=entry?`${entry.o.id||entry.id}: drag vertices / center${entry.o.foot?' / orange foot line':''}. Shift-click: add vertex. Alt-click vertex: remove.`:'Drag a handle. Enter finishes a new polygon.';
}
function rebuildList(){const select=$('#edit-object');select.replaceChildren();const empty=document.createElement('option');empty.value='';empty.textContent='Select objectâ€¦';select.append(empty);for(const [i,entry] of objects().entries()){if($('#edit-kind').value!=='all'&&$('#edit-kind').value!==entry.kind)continue;const option=document.createElement('option');option.value=i;option.textContent=entry.o.id||entry.id;select.append(option)}}
$('#edit-kind').onchange=()=>{selectEditor(null);rebuildList()};$('#edit-object').onchange=e=>selectEditor(e.target.value===''?null:objects()[+e.target.value]);
for(const key of ['pose','facing','group','tags'])$('#'+key).onchange=e=>{if(editorSelection?.kind==='spots')editorSelection.o[key]=key==='tags'?e.target.value.split(',').map(t=>t.trim()).filter(Boolean):e.target.value};
function placement(v){world.setPlacement(v);$('#editor').hidden=!v;draft=null;rebuildList()}
$('#place').onclick=()=>placement(!world.placement);
$('#new-polygon').onclick=()=>{const kind=$('#edit-kind').value;if(kind==='spots'||kind==='steam'){draft={kind,points:[]};$('#edit-status').textContent='Click to place a new '+kind;return}if(kind==='paths'){draft={kind,points:[]};$('#edit-status').textContent='Click path waypoints; Enter to finish.';return}if(!['occluders','lights','windows','rgb'].includes(kind)){$('#edit-status').textContent='Choose occluders, lights, window or RGB first.';return}draft={kind,points:[]};$('#edit-status').textContent='Click polygon corners; Enter to finish, Esc to cancel.'};
function finishPolygon(){if(draft?.kind==='paths'&&draft.points.length>=2){const o={id:'path-'+Date.now(),points:draft.points.map(([x,y])=>({x,y}))};data.paths.push(o);draft=null;rebuildList();selectEditor({kind:'paths',o});return}if(!draft||draft.points.length<3)return;const o={id:draft.kind+'-'+Date.now(),polygon:draft.points};if(draft.kind==='occluders')o.foot={x:o.polygon[0][0],y:Math.max(...o.polygon.map(p=>p[1]))};if(draft.kind==='lights'){o.color=L.agents.paper;o.flicker=1}if(draft.kind==='windows')o.twinkles=[];if(draft.kind==='rgb')data.rgb=o;else data[draft.kind].push(o);const kind=draft.kind;draft=null;rebuildList();selectEditor({kind,o})}
$('#light-color').oninput=e=>{if(editorSelection?.kind==='lights')editorSelection.o.color=e.target.value};$('#light-flicker').oninput=e=>{if(editorSelection?.kind==='lights')editorSelection.o.flicker=+e.target.value};$('#add-twinkle').onclick=()=>{draft={kind:'twinkle',points:[]};$('#edit-status').textContent='Click a new twinkle rectangle; then drag its corner to resize.'};$('#duplicate').onclick=()=>{if(editorSelection?.kind!=='furniture')return;const o=structuredClone(editorSelection.o);o.id+='-copy-'+Date.now();o.x+=8;o.y+=8;o.foot.x+=8;o.foot.y+=8;o.lightIds=[];data.objects.push(o);selectEditor({kind:'furniture',o});rebuildList()};$('#mirror').onclick=()=>{if(editorSelection?.kind==='furniture')editorSelection.o.flipX=!editorSelection.o.flipX};$('#delete-object').onclick=()=>{if(!editorSelection)return;const {kind,o}=editorSelection;if(kind==='rgb')data.rgb=null;else {const list=kind==='furniture'?data.objects:data[kind];list.splice(list.indexOf(o),1)};selectEditor(null);rebuildList()};
$('#export').onclick=async()=>{const text=JSON.stringify(data,null,2);window.exportedScene=text;try{await navigator.clipboard.writeText(text);$('#export').textContent='Copied scene JSON'}catch{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.download='scene.json';a.click();URL.revokeObjectURL(a.href)}};
canvas.onpointerdown=e=>{const p=point(e);if(draft){if(['spots','steam','twinkle'].includes(draft.kind)){const kind=draft.kind,o={...p};if(kind==='spots')Object.assign(o,{id:'spot-'+Date.now(),pose:'stand',facing:'right',tags:['comfy'],group:null});if(kind==='twinkle'){Object.assign(o,{w:2,h:2});editorSelection.o.twinkles.push(o)}else data[kind].push(o);draft=null;rebuildList();return}draft.points.push([p.x,p.y]);return}
 if(world.placement){if(e.shiftKey&&editorSelection?.o.polygon){editorSelection.o.polygon.push([p.x,p.y]);return}const h=handles().sort((a,b)=>(a.x-p.x)**2+(a.y-p.y)**2-((b.x-p.x)**2+(b.y-p.y)**2)).find(h=>Math.hypot(h.x-p.x,h.y-p.y)<L.placement.hitRadius);if(h){selectEditor(h.entry);if(e.altKey&&h.type==='vertex'&&h.entry.o.polygon?.length>3){const i=h.entry.o.polygon.findIndex(v=>v[0]===h.x&&v[1]===h.y);h.entry.o.polygon.splice(i,1);return}drag={handle:h};canvas.setPointerCapture(e.pointerId);return}}
 drag={start:{x:e.clientX,y:e.clientY},pan:{...pan},moved:false};canvas.setPointerCapture(e.pointerId);
};
canvas.onpointermove=e=>{const p=point(e);if(drag?.handle){drag.handle.set(p);return}if(drag?.start){const dx=e.clientX-drag.start.x,dy=e.clientY-drag.start.y;drag.moved ||= Math.hypot(dx,dy)>L.view.panThreshold;if(drag.moved){world.stopFollow();pan={x:drag.pan.x+dx/view.scale,y:drag.pan.y+dy/view.scale}}return}const a=pickAgent(p),hover=$('#hover');hover.textContent=a?.name||'';hover.style.display=a&&!world.placement&&!artOnly?'block':'none';hover.style.left=e.clientX+10+'px';hover.style.top=e.clientY-20+'px'};
canvas.onpointerup=e=>{if(drag?.start&&!drag.moved&&!world.placement&&!artOnly)world.select(pickAgent(point(e))||null);drag=null};canvas.onpointercancel=()=>drag=null;
window.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;if(e.key==='Escape'){world.stopFollow();draft=null}if(e.key==='Enter')finishPolygon();if(e.key.toLowerCase()==='p')placement(!world.placement)});
if(artOnly){for(const id of ['play','speed','run'])$('#'+id).hidden=true;$('#file').closest('label').hidden=true;$('footer').textContent='Scroll: integer zoom · Drag: pan · P: furniture placement · Export: save your layout'}
window.addEventListener('resize',resize);window.worldView={look:L,get view(){return view},get zoom(){return zoom},setZoom:changeZoom,render,native,room,selectEditor,get handles(){return handles()},get selection(){return editorSelection}};
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;world.update(dt);render();requestAnimationFrame(frame)}requestAnimationFrame(frame);
