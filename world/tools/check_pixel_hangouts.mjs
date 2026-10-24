import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const b=await chromium.launch({headless:true,channel:'msedge'}),p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto('http://127.0.0.1:5180');await p.waitForFunction(()=>window.world?.agents.length===12);
const roster=JSON.parse(readFileSync('world/fixtures/fake-run.jsonl','utf8').split('\n')[0]);
const result=await p.evaluate(roster=>{
 world.load(JSON.stringify(roster));const before=world.agents.map(a=>a.slot);for(let i=0;i<650;i++)world.update(.1);const wanderers=world.agents.filter((a,i)=>a.slot!==before[i]).length;
 const pair=structuredClone(roster);pair.detail.nodes=pair.detail.nodes.slice(0,2);world.load(JSON.stringify(pair));for(const [node,partner] of [['node-01','node-02'],['node-02','node-01']])world.apply({node,event:'state',detail:{state:'playing',partner}});for(let i=0;i<60;i++)world.update(.1);
 const games=world.agents.map(a=>({node:a.node,state:a.state,spot:world.data.spots.find(s=>s.id===a.slot)}));
 return {wanderers,games:games.map(a=>({node:a.node,state:a.state,group:a.spot.group,tags:a.spot.tags})),separated:Math.abs(world.agents[0].g.position.x-world.agents[1].g.position.x)>=worldView.look.agents.spacing||Math.abs(world.agents[0].g.position.y-world.agents[1].g.position.y)>=worldView.look.agents.footSpacing};
},roster);
assert(result.wanderers>0);assert(result.games.every(a=>a.tags.includes('game')));assert.equal(result.games[0].group,result.games[1].group);assert(result.separated);
console.log(JSON.stringify(result));writeFileSync('docs/w0-pixel-hangout-check.json',JSON.stringify(result,null,2));
// A small visual evidence sheet of the live states, tool feedback and plane variants.
await p.evaluate(roster=>{world.load(JSON.stringify(roster));world.setSpeed(1);world.apply({node:'node-01',event:'state',detail:{state:'studying'}});world.apply({node:'node-04',event:'state',detail:{state:'playing',partner:'node-05'}});world.apply({node:'node-05',event:'state',detail:{state:'playing',partner:'node-04'}});world.apply({node:'node-07',event:'state',detail:{state:'helping'}});world.apply({node:'node-10',event:'state',detail:{state:'serving_owner'}});for(let i=0;i<35;i++)world.update(.1);for(const [node,tool] of [['node-01','open_page'],['node-04','load_skill'],['node-07','search'],['node-10','save_note']])world.apply({node,event:'tool_call',detail:{tool,arg:'visual check'}});for(const [i,mode] of ['forward','text_help','canvas'].entries())world.apply({node:'node-0'+(i+1),event:'message_sent',sim_latency_ms:100,detail:{to:'node-0'+(i+7),mode,declined:i===2}});worldView.render()},roster);await p.screenshot({path:'C:/Outernet/docs/w0-pixel-activities.png'});await b.close();
