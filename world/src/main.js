// Modular W0: artwork and placement come from the two canonical JSON files.
import {look as L} from './look.js';
import {startPlayback} from './canvas-playback.js';
import {loadSprites} from './pixel-sprites.js';
import {loadRoom} from './room-scene.js';
import {createLayers} from './modular-layers.js';
import {createPlacement} from './placement.js';
import {installUI} from './world-ui.js';
const $=s=>document.querySelector(s),canvas=$('canvas'),ctx=canvas.getContext('2d',{alpha:false}),stage=$('#stage');
installUI();
const state=await loadRoom(),data=state.data,sprites=await loadSprites(),world=startPlayback(data),native=document.createElement('canvas');
[native.width,native.height]=L.art.size;const c=native.getContext('2d'),layers=createLayers(c,state,sprites),editor=createPlacement(c,state,world);
$('#art-status').textContent=data.placeholder?L.placeholder.label:'';
let zoom=L.view.defaultZoom,pan={x:0,y:0},view={scale:1,x:0,y:0},drag=null,last=performance.now(),backdropOffset={x:0,y:0};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;ctx.imageSmoothingEnabled=false}}
function camera(){resize();const fit=Math.max(1,Math.floor(Math.min(canvas.width/native.width,canvas.height/native.height))),scale=fit+zoom;
 if(world.follow&&zoom>0){pan.x=native.width/2-world.follow.g.position.x;pan.y=native.height/2-world.follow.g.position.y}
 const limitX=Math.max(0,(native.width-canvas.width/scale)/2),limitY=Math.max(0,(native.height-canvas.height/scale)/2);if(!world.follow){pan.x=clamp(pan.x,-limitX,limitX);pan.y=clamp(pan.y,-limitY,limitY);}
 view={scale,x:Math.round((canvas.width-native.width*scale)/2+Math.round(pan.x)*scale),y:Math.round((canvas.height-native.height*scale)/2+Math.round(pan.y)*scale)};
 $('#zoom-label').textContent=`${zoom?'Fit + '+zoom:'Fit'} · ${scale}× · ${native.width} × ${native.height}`;
}
function point(e){const r=canvas.getBoundingClientRect();return {x:Math.round((e.clientX-r.left-view.x)/view.scale),y:Math.round((e.clientY-r.top-view.y)/view.scale)}}
function changeZoom(z){zoom=clamp(z,0,L.view.maxExtraZoom);if(!zoom){pan={x:0,y:0};world.stopFollow()}camera()}
canvas.addEventListener('wheel',e=>{e.preventDefault();changeZoom(zoom+(e.deltaY<0?1:-1))},{passive:false});$('#zoom-in').onclick=()=>changeZoom(zoom+1);$('#zoom-out').onclick=()=>changeZoom(zoom-1);
function pickAgent(p){return world.agents.slice().sort((a,b)=>b.g.position.y-a.g.position.y).find(a=>Math.abs(p.x-a.g.position.x)<18&&p.y>a.g.position.y-28&&p.y<a.g.position.y+2)}

function render(){camera();state.sync();backdropOffset=layers.render(world,pan);if(world.placement)editor.draw();ctx.fillStyle=L.view.background;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;ctx.drawImage(native,view.x,view.y,native.width*view.scale,native.height*view.scale)}
canvas.onpointerdown=e=>{const p=point(e);if(world.placement){const result=editor.down(p,e);if(result.consumed){if(result.handle){drag={handle:result.handle};canvas.setPointerCapture(e.pointerId)}return}}drag={start:{x:e.clientX,y:e.clientY},pan:{...pan},moved:false};canvas.setPointerCapture(e.pointerId)};
canvas.onpointermove=e=>{const p=point(e);if(drag?.handle){drag.handle.set(p);return}if(drag?.start){const dx=e.clientX-drag.start.x,dy=e.clientY-drag.start.y;drag.moved ||= Math.hypot(dx,dy)>L.view.panThreshold;if(drag.moved){world.stopFollow();pan={x:drag.pan.x+dx/view.scale,y:drag.pan.y+dy/view.scale}}return}const a=pickAgent(p),hover=$('#hover');hover.textContent=a?.name||'';hover.style.display=a&&!world.placement?'block':'none';hover.style.left=e.clientX+10+'px';hover.style.top=e.clientY-20+'px'};
canvas.onpointerup=e=>{if(drag?.start&&!drag.moved&&!world.placement)world.select(pickAgent(point(e))||null);drag=null};canvas.onpointercancel=()=>drag=null;
window.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;if(e.key==='Escape'){world.stopFollow();editor.cancel()}if(e.key==='Enter')editor.finish();if(e.key.toLowerCase()==='p')editor.toggle(!world.placement)});
window.addEventListener('resize',resize);
window.worldView={look:L,state,layout:state.layout,editor,get view(){return view},get zoom(){return zoom},setZoom:changeZoom,render,native,room:layers.shell,get backdropOffset(){return backdropOffset},selectEditor:editor.select,get handles(){return editor.handles()},get selection(){return editor.selection}};
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;state.sync();world.update(dt);render();requestAnimationFrame(frame)}requestAnimationFrame(frame);
