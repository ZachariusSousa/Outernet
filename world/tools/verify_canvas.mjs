import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto('http://127.0.0.1:5180');await page.waitForFunction(()=>window.world?.agents.length===12);
const log=readFileSync('world/fixtures/fake-run.jsonl','utf8');
const results=await page.evaluate(log=>{
 const runs=[];for(const speed of [1,4,16]){
  world.load(log);world.setSpeed(speed);let overlap=0,maxPending=0;const effects=new Set(),states=new Set();
  for(let i=0;i<Math.ceil(6060/speed);i++){
   world.update(.1);
   for(const a of world.agents){states.add(a.state);if(a.move)maxPending=Math.max(maxPending,world.elapsed-a.move.start);for(const b of world.agents)if(b.index>a.index&&Math.abs(a.g.position.x-b.g.position.x)<35&&Math.abs(a.g.position.y-b.g.position.y)<31)overlap++}
   for(const f of world.effects)effects.add(f.kind);if(i%10===0)worldView.render();
  }
  runs.push({speed,cursor:world.cursor,total:world.total,sim:world.sim,overlap,maxPending,states:[...states],effects:[...effects]});
 }
 // Unknown event envelope fields/types must leave the agents intact.
 world.load(log);world.apply({node:'node-01',event:'future_event',detail:{unused:true}});world.apply({node:'node-01',event:'tool_call',detail:{tool:'search',arg:'test',future:true},extra:'ok'});
 const a=world.agents[0],b=world.agents[1];world.apply({node:a.node,event:'message_sent',detail:{to:b.node,mode:'canvas'},sim_latency_ms:200});const flight=world.effects.find(f=>f.kind==='plane');world.apply({node:b.node,event:'message_received',detail:{}});const plane={duration:flight.duration,retained:world.effects.includes(flight),receiver:flight.receiver};
 return {runs,plane,view:worldView.view,context:document.querySelector('canvas').getContext('2d')!==null};
},log);
for(const r of results.runs){assert.equal(r.cursor,r.total);assert.equal(r.overlap,0);assert(r.maxPending<=5.1);assert.equal(r.states.length,5)}assert.equal(results.plane.duration,3.5);assert(results.plane.retained);assert.deepEqual(errors,[]);console.log(JSON.stringify({results,errors},null,2));writeFileSync('docs/w0-pixel-verification.json',JSON.stringify({results,errors},null,2));
await page.evaluate(log=>{world.load(log);world.setSpeed(1);for(let i=0;i<800;i++)world.update(.1);worldView.render()},log);await page.screenshot({path:'C:/Outernet/docs/w0-pixel-fit.png'});
await page.evaluate(()=>{worldView.setZoom(2);worldView.render()});await page.screenshot({path:'C:/Outernet/docs/w0-pixel-fit-plus-2.png'});
await page.keyboard.press('p');await page.screenshot({path:'C:/Outernet/docs/w0-pixel-placement.png'});
await browser.close();
