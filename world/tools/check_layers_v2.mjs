import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1.25}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const url=process.env.WORLD_URL||'http://127.0.0.1:5180/';
await page.goto(url);await page.waitForFunction(()=>window.world?.agents.length===12);
assert(await page.locator('#play').isVisible());assert(await page.locator('#speed').isVisible());
const log=readFileSync('world/fixtures/fake-run.jsonl','utf8');
const runs=await page.evaluate(log=>{
 const result=[];for(const speed of [1,4,16]){world.load(log);world.setSpeed(speed);let overlaps=0,maxPending=0;const effects=new Set();for(let i=0;i<Math.ceil(6060/speed);i++){worldView.state.sync();world.update(.1);for(const a of world.agents){if(a.move)maxPending=Math.max(maxPending,world.elapsed-a.move.start);for(const b of world.agents)if(b.index>a.index&&Math.abs(a.g.position.x-b.g.position.x)<35&&Math.abs(a.g.position.y-b.g.position.y)<31)overlaps++}for(const f of world.effects)effects.add(f.kind);if(i%10===0)worldView.render()}result.push({speed,cursor:world.cursor,total:world.total,overlaps,maxPending,effects:[...effects]})}return result;
},log);
for(const r of runs){assert.equal(r.cursor,r.total);assert.equal(r.overlaps,0);assert(r.maxPending<=5.1)}
const roster=JSON.parse(log.split('\n')[0]);roster.detail.nodes=roster.detail.nodes.slice(0,1);
const steps=await page.evaluate(roster=>{
 world.load(JSON.stringify(roster));world.setSpeed(1);const a=world.agents[0],target=world.data.spots.find(s=>s.id==='hangout-02'),route=world.route(a.g.position,target),paths=world.data.paths;
 world.data.paths=paths.filter(p=>p.type!=='steps');const without=world.route(a.g.position,target);world.data.paths=paths;
 world.move(a,target);const visited=[];let onSteps=false;for(let i=0;i<260;i++){world.update(.01);visited.push(a.g.position.level);if(route.some(p=>p.step&&Math.hypot(p.x-a.g.position.x,p.y-a.g.position.y)<8))onSteps=true}return {viaSteps:route.some(p=>p.step),levels:[...new Set(visited)],withoutSteps:without,onSteps,arrived:a.g.position.level===-1};
},roster);
assert(steps.viaSteps&&steps.onSteps&&steps.arrived);assert.equal(steps.withoutSteps,null);assert.deepEqual(steps.levels,[0,-1]);
const depth=await page.evaluate(roster=>{
 world.load(JSON.stringify(roster));const L=worldView.look;
 L.weather.depths.forEach(d=>d.count=0);L.weather.steam.alpha=0;L.weather.dust.alpha=0;L.weather.twinkleAlpha=0;L.glass.alpha=0;L.glass.reflectionAlpha=0;L.grade.warmth=0;L.grade.vignette=0;Object.values(L.light.glows).forEach(g=>g.strength=0);Object.values(L.light.lines).forEach(g=>g.enabled=false);
 const c=worldView.native.getContext('2d'),pixel=(x,y)=>[...c.getImageData(x,y,1,1).data],a=world.agents[0];a.g.position.x=120;a.g.position.y=205;a.pose='stand';a.blinkAt=999;worldView.render();const behind=pixel(120,195);
 const state=worldView.state,o=state.byId('sofa'),asset=state.images.get('sprites/'+state.manifest.sprites[o.sprite].file),raw=document.createElement('canvas');raw.width=asset.width;raw.height=asset.height;raw.getContext('2d').drawImage(asset,0,0);const expected=[...raw.getContext('2d').getImageData(120-o.x,195-o.y,1,1).data];
 a.g.position.y=232;worldView.render();const front=pixel(120,221);
 const shell=document.createElement('canvas');shell.width=480;shell.height=360;shell.getContext('2d').drawImage(worldView.room,0,0);const alpha=(x,y)=>shell.getContext('2d').getImageData(x,y,1,1).data[3];
 L.light.lines.rgb.enabled=true;L.light.rgbColor='#ff0000';worldView.render();const red=pixel(35,101);L.light.rgbColor='#00ff00';worldView.render();const green=pixel(35,101);
 return {behind,expected,front,panesTransparent:alpha(240,70)===0,outsideTransparent:alpha(0,0)===0,rgbChanged:JSON.stringify(red)!==JSON.stringify(green)};
},roster);
assert.deepEqual(depth.behind,depth.expected);assert.notDeepEqual(depth.front,depth.behind);assert(depth.panesTransparent&&depth.outsideTransparent&&depth.rgbChanged);
await page.reload();await page.waitForFunction(()=>window.world?.agents.length===12);await page.keyboard.press('p');
await page.selectOption('#edit-kind','furniture');
const sofaIndex=await page.evaluate(()=>worldView.editor.entries().findIndex(e=>e.o.id==='sofa'));await page.selectOption('#edit-object',String(sofaIndex));
const before=await page.evaluate(()=>({sprite:{...worldView.state.byId('sofa')},spot:{...world.data.spots.find(s=>s.id==='sofa-seat')},width:worldView.state.byId('sofa').width}));
const screen=async p=>page.evaluate(p=>({x:worldView.view.x+p.x*worldView.view.scale,y:document.querySelector('#stage').getBoundingClientRect().top+worldView.view.y+p.y*worldView.view.scale}),p);
// Use the actual center rather than assumptions about trimmed source dimensions.
const actual=await page.evaluate(()=>{const o=worldView.state.byId('sofa');return {x:o.x+o.width/2,y:o.y+o.height/2}}),start=await screen(actual),end=await screen({x:actual.x+8,y:actual.y+4});
await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(end.x,end.y);await page.mouse.up();
const moved=await page.evaluate(()=>({x:worldView.state.byId('sofa').x,spot:world.data.spots.find(s=>s.id==='sofa-seat').x}));assert.equal(moved.x,before.sprite.x+8);assert.equal(moved.spot,before.spot.x+8);
await page.click('#mirror');assert.equal(await page.evaluate(()=>worldView.state.byId('sofa').flip),!before.sprite.flip);
const count=await page.evaluate(()=>worldView.layout.sprites.length);await page.locator('#editor details summary').click();await page.selectOption('#sprite-choice','moon-sign');await page.click('#add-sprite');const addAt=await screen({x:390,y:245});await page.mouse.click(addAt.x,addAt.y);assert.equal(await page.evaluate(()=>worldView.layout.sprites.length),count+1);await page.click('#delete-object');assert.equal(await page.evaluate(()=>worldView.layout.sprites.length),count);
await page.selectOption('#edit-kind','lightLines');const lineIndex=await page.evaluate(()=>worldView.editor.entries().findIndex(e=>e.o.id==='wall-rgb'));await page.selectOption('#edit-object',String(lineIndex));const first=await screen({x:35,y:101}),next=await screen({x:41,y:105});await page.mouse.move(first.x,first.y);await page.mouse.down();await page.mouse.move(next.x,next.y);await page.mouse.up();assert.equal(await page.evaluate(()=>worldView.layout.lightLines[0].points[0].x),41);
await page.click('#export-layout');await page.click('#export');const exported=await page.evaluate(()=>({layout:JSON.parse(window.exportedLayout),scene:JSON.parse(window.exportedScene)}));assert.equal(exported.layout.sprites.length,count);assert(exported.scene.spots.find(s=>s.id==='sofa-seat').anchor);assert(!('objects' in exported.scene));assert(!('width' in exported.layout.sprites[0]));
await page.reload();await page.waitForFunction(()=>window.world?.agents.length===12);
await page.evaluate(roster=>{world.load(JSON.stringify(roster));world.apply({node:'node-01',event:'future-event',detail:{ignored:true}});world.apply({node:'node-01',event:'tool_call',detail:{tool:'search',arg:'modular card check',extra:true},unknown:true});worldView.render()},roster);await page.click('#play');
const cardAt=await screen({x:79,y:186});await page.mouse.click(cardAt.x,cardAt.y);assert.match(await page.locator('#card').innerText(),/Pip[\s\S]*modular card check/);await page.locator('#card summary').click();assert.match(await page.locator('#card pre').innerText(),/tool_call/);
await page.evaluate(()=>worldView.setZoom(2));await page.getByRole('button',{name:'Follow',exact:true}).click();await page.evaluate(()=>worldView.render());assert(await page.evaluate(()=>Math.abs(worldView.view.x+world.follow.g.position.x*worldView.view.scale-document.querySelector('canvas').width/2)<=worldView.view.scale));await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>world.follow),null);
const planes=await page.evaluate(log=>{world.load(log);world.apply({node:'node-01',event:'message_sent',detail:{to:'node-02',mode:'canvas',declined:true},sim_latency_ms:200});const f=world.effects.find(f=>f.kind==='plane');world.apply({node:'node-02',event:'message_received',detail:{}});return {duration:f.duration,receiver:f.receiver,declined:f.declined,retained:world.effects.includes(f)}},log);assert.equal(planes.duration,3.5);assert(planes.retained&&planes.declined);assert.equal(planes.receiver,'node-02');
await page.evaluate(log=>{world.load(log);world.setSpeed(1);worldView.setZoom(0);for(let i=0;i<100;i++)world.update(.1);worldView.render()},log);await page.click('#play');
await page.screenshot({path:'C:/Outernet/docs/w0-modular-v2-fit.png'});await page.evaluate(()=>{worldView.setZoom(2);worldView.render()});await page.screenshot({path:'C:/Outernet/docs/w0-modular-v2-fit-plus-2.png'});
const parallaxBefore=await page.evaluate(()=>worldView.backdropOffset.x);const dragStart=await screen({x:270,y:220});await page.mouse.move(dragStart.x,dragStart.y);await page.mouse.down();await page.mouse.move(dragStart.x+160,dragStart.y);await page.mouse.up();await page.waitForTimeout(50);const parallaxAfter=await page.evaluate(()=>worldView.backdropOffset.x);assert.notEqual(parallaxBefore,parallaxAfter);
await page.keyboard.press('p');await page.selectOption('#edit-kind','spots');await page.screenshot({path:'C:/Outernet/docs/w0-modular-v2-placement.png'});
assert.deepEqual(errors,[]);const result={runs,steps,depth,placement:{drag:true,attachedSpot:true,flip:true,paletteAddRemove:true,lightPolyline:true,exports:true},parallax:true,cardFollow:true,unknownEvent:true,planes,errors};writeFileSync('docs/w0-modular-v2-check.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();
