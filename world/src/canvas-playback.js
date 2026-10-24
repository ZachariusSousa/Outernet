// Canvas playback adapter. JSONL parsing, controls and card retained from f5d6064.
// State/props and tagged hangouts retain the later playback.js behavior.
import {look as L} from './look.js';
export class Point {
 constructor(x=0,y=0){this.x=x;this.y=y}
 clone(){return new Point(this.x,this.y)}
 copy(p){this.x=p.x;this.y=p.y;return this}
 lerpVectors(a,b,t){this.x=a.x+(b.x-a.x)*t;this.y=a.y+(b.y-a.y)*t;return this}
}
export function startPlayback(data){
const A=L.agents,scene={remove(){}},rand=(a,b)=>a+Math.random()*(b-a);
let agents=[],events=[],cursor=0,sim=-3,elapsed=0,playing=true,speed=1,selected=null,follow=null,fx=[],placement=false;
function species(n){return {'llada2.2-mini':'axolotl','dream-v0-instruct-7b':'moth','qwen3.5-9b':'raccoon','gemma-4-e4b':'beaver'}[n.model]||(n.engine==='diffusion'?'jellyfish':'red panda')}
function creature(n,i){const spot=data.spots[i%data.spots.length];return {...n,index:i,species:species(n),g:{position:new Point(spot.x,spot.y)},state:'resting',tool:'',arg:'',history:[],slot:spot.id,pose:spot.pose,facing:spot.facing,move:null,until:0,blinkAt:rand(A.blinkMin,A.blinkMax),wander:rand(A.wanderMin,A.wanderMax),restStyle:'idle',animationEnd:0}}
function clear(p,a,extra=0){return !agents.some(b=>b!==a&&Math.abs(p.x-b.g.position.x)<A.spacing+extra&&Math.abs(p.y-b.g.position.y)<A.footSpacing+extra)}
function choose(a,partner,random=false){
 const tags=a.state==='studying'?['comfy']:a.state==='playing'?['game']:['comfy','window','snack','terrace'];
 const friend=agents.find(b=>b.node===partner),group=data.spots.find(s=>s.id===friend?.slot)?.group;
 return data.spots.filter(s=>s.id!==a.slot&&s.tags.some(t=>tags.includes(t))&&!agents.some(b=>{if(b===a)return false;const dest=data.spots.find(p=>p.id===b.slot);return dest&&Math.abs(dest.x-s.x)<A.spacing&&Math.abs(dest.y-s.y)<A.footSpacing})&&clear(s,a)).map(s=>({s,score:Math.hypot(s.x-a.g.position.x,s.y-a.g.position.y)+(group&&s.group!==group?1000:0)+(random?Math.random()*500:0)})).sort((a,b)=>a.score-b.score)[0]?.s;
}
// Dijkstra on the editable walkway graph, not a fixed station-to-station animation.
function route(from,to){
 const nodes=[],edges=[],index=p=>{let i=nodes.findIndex(n=>n.x===p.x&&n.y===p.y);if(i<0){i=nodes.length;nodes.push(new Point(p.x,p.y));edges.push([])}return i};
 for(const path of data.paths)for(let i=1;i<path.points.length;i++){const a=index(path.points[i-1]),b=index(path.points[i]);edges[a].push(b);edges[b].push(a)}
 if(!nodes.length)return [from.clone(),new Point(to.x,to.y)];
 const nearest=p=>nodes.reduce((best,n,i)=>Math.hypot(n.x-p.x,n.y-p.y)<Math.hypot(nodes[best].x-p.x,nodes[best].y-p.y)?i:best,0),start=nearest(from),end=nearest(to),dist=nodes.map(()=>Infinity),prev=[],done=new Set();dist[start]=0;
 while(done.size<nodes.length){let u=-1;for(let i=0;i<nodes.length;i++)if(!done.has(i)&&(u<0||dist[i]<dist[u]))u=i;if(u<0||dist[u]===Infinity||u===end)break;done.add(u);for(const v of edges[u]){const d=dist[u]+Math.hypot(nodes[u].x-nodes[v].x,nodes[u].y-nodes[v].y);if(d<dist[v]){dist[v]=d;prev[v]=u}}}
 if(dist[end]===Infinity)return [from.clone(),new Point(to.x,to.y)];
 const middle=[];for(let i=end;i!==undefined;i=prev[i])middle.unshift(nodes[i].clone());return [from.clone(),...middle,new Point(to.x,to.y)];
}
function effect(a,kind,duration=A.effectLife){fx.push({kind,position:a.g.position.clone(),start:elapsed,duration})}
function move(a,spot){if(!spot)return;a.slot=spot.id;a.pose=spot.pose;a.facing=spot.facing;
 if(speed===16||a.move||a.animationEnd-elapsed>5){a.g.position.copy(spot);a.move=null;effect(a,'poof',A.poof);return}
 const points=route(a.g.position,spot),lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y));
 a.move={points,lengths,total:lengths.at(-1),start:elapsed,duration:A.walk,target:spot};
}
function apply(e){const a=agents.find(a=>a.node===e.node);if(!a)return;const d=e.detail||{};
 // Future fields/types are deliberately ignored before changing card history.
 if(!['state','tool_call','message_sent','message_received','answer'].includes(e.event))return;
 a.history.unshift(e);a.history=a.history.slice(0,5);
 if(e.event==='state'){a.state=d.state;a.tool='';a.arg='';a.restStyle='idle';if(!['helping','serving_owner'].includes(a.state))move(a,choose(a,d.partner));}
 if(e.event==='tool_call'){a.tool=d.tool;a.arg=d.arg||'';const busy=a.animationEnd-elapsed>5;a.until=elapsed+(busy?A.busyTool:A.tool);a.animationEnd=busy?a.until:Math.max(elapsed,a.animationEnd)+A.tool;effect(a,d.tool,busy?A.busyTool:A.effectLife);if(d.tool==='save_note')effect(a,'sticky',A.stickyLife);}
 if(e.event==='answer')effect(a,'sparkle');
 if(e.event==='message_sent'){const b=agents.find(b=>b.node===d.to);if(b)fx.push({kind:'plane',mode:d.mode,declined:!!d.declined,from:a.g.position.clone(),to:b.g.position.clone(),sender:a.node,receiver:b.node,start:elapsed,duration:Math.max(A.planeMin,Math.min(A.planeMax,A.planeBase+(e.sim_latency_ms||0)/A.planeLatencyDivisor))});}
 // Receipts record evidence, but never cancel an in-flight animation.
 if(selected===a)card();
}
function card(){const el=document.querySelector('#card');el.hidden=!selected;if(!selected)return;const a=selected;el.replaceChildren();const title=document.createElement('h2');title.textContent=a.name;el.append(title);for(const value of [a.species,a.model,a.interest,`State: ${a.state}`,`Tool: ${a.tool||'—'} ${a.arg}`,`${a.library_pages} library pages`]){const p=document.createElement('p');p.textContent=value;el.append(p)}const btn=document.createElement('button');btn.textContent='Follow';btn.onclick=()=>follow=a;el.append(btn);const close=document.createElement('button');close.textContent='Close';close.onclick=()=>{selected=null;card()};el.append(close);const det=document.createElement('details'),sum=document.createElement('summary'),pre=document.createElement('pre');sum.textContent='Last 5 events';pre.textContent=a.history.map(e=>JSON.stringify(e,null,2)).join('\n');det.append(sum,pre);el.append(det)}

function load(text){const parsed=text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(s=>s.trim()).map(JSON.parse);if(parsed[0]?.event!=='roster')throw Error('Log must begin with roster');agents.forEach(a=>scene.remove(a.g));fx.forEach(f=>scene.remove(f.m));fx=[];agents=[];parsed[0].detail.nodes.forEach((n,i)=>agents.push(creature(n,i)));events=parsed.slice(1);cursor=0;sim=-3;elapsed=0;selected=null;follow=null;card();playing=true;document.querySelector('#play').textContent='Pause';document.querySelector('#run').textContent=parsed[0].run;}

document.querySelector('#play').onclick=e=>{playing=!playing;e.target.textContent=playing?'Pause':'Play'};document.querySelector('#speed').onchange=e=>speed=+e.target.value;
async function read(file){try{load(await file.text())}catch(e){document.querySelector('#run').textContent=e.message}}document.querySelector('#file').onchange=e=>read(e.target.files[0]);window.ondragover=e=>e.preventDefault();window.ondrop=e=>{e.preventDefault();if(e.dataTransfer.files[0])read(e.dataTransfer.files[0])};


function update(dt){
 if(playing&&!placement){elapsed+=dt;sim+=dt*speed;while(cursor<events.length&&events[cursor].t<=sim)apply(events[cursor++]);}
 for(const a of agents){
  if(a.move){const m=a.move,t=Math.min((elapsed-m.start)/m.duration,1),distance=t*m.total;let i=1;while(i<m.lengths.length-1&&m.lengths[i]<distance)i++;const f=(distance-m.lengths[i-1])/Math.max(.00001,m.lengths[i]-m.lengths[i-1]),next=new Point().lerpVectors(m.points[i-1],m.points[i],f);
   if(clear(next,a)){a.facing=next.x<a.g.position.x?'left':'right';a.g.position.copy(next)}
   if(t>=1&&clear(m.target,a)){a.g.position.copy(m.target);a.facing=m.target.facing;a.move=null}
   else if(elapsed-m.start>5){let dest=clear(m.target,a)?m.target:choose(a);if(dest){a.g.position.copy(dest);a.slot=dest.id;a.pose=dest.pose;a.facing=dest.facing;effect(a,'poof',A.poof)}a.move=null;}
  }
  if(a.state==='resting'&&elapsed>a.wander){a.restStyle=Math.random()<A.napChance?'nap':Math.random()<A.snackChance?'snack':'idle';move(a,choose(a,null,true));a.wander=elapsed+rand(A.wanderMin,A.wanderMax)}
  if(a.state==='resting'&&(a.restStyle==='nap'||a.pose==='lie')&&(!a.zz||elapsed-a.zz>4)){effect(a,'sleep',2);a.zz=elapsed}
  if(elapsed>a.blinkAt+A.blinkDuration)a.blinkAt=elapsed+rand(A.blinkMin,A.blinkMax);
 }
 fx=fx.filter(f=>elapsed-f.start<f.duration);
}
const api={update,apply,load,data,clear,move,choose,get agents(){return agents},get effects(){return fx},get elapsed(){return elapsed},get sim(){return sim},get cursor(){return cursor},get total(){return events.length},get speed(){return speed},get selected(){return selected},get follow(){return follow},get placement(){return placement},setPlacement(v){placement=v;follow=null;document.querySelector('#export').hidden=!v},select(a){selected=a;card()},stopFollow(){follow=null},setSpeed(v){speed=v;document.querySelector('#speed').value=String(v)}};
window.world=api;
fetch('/fixtures/fake-run.jsonl').then(r=>r.text()).then(load).catch(e=>document.querySelector('#run').textContent=e.message);
return api;
}
