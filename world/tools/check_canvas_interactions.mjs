import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const b=await chromium.launch({headless:true,channel:'msedge'}),page=await b.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1.25}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));await page.goto('http://127.0.0.1:5180');await page.waitForFunction(()=>window.world?.agents.length===12);
const roster=JSON.parse(readFileSync('world/fixtures/fake-run.jsonl','utf8').split('\n')[0]);roster.detail.nodes=roster.detail.nodes.slice(0,1);
const depth=await page.evaluate(async roster=>{
 const L=worldView.look;world.load(JSON.stringify(roster));
 L.light.strength=0;L.light.rgbGlow=0;L.grade.warmth=0;L.grade.vignette=0;L.weather.depths.forEach(d=>d.count=0);L.weather.steam.alpha=0;L.weather.dust.alpha=0;L.weather.twinkleAlpha=0;L.weather.shimmer=0;
 const a=world.agents[0];a.g.position.x=126;a.g.position.y=190;a.pose='stand';a.blinkAt=999;worldView.render();
 const pixel=(x,y)=>Array.from(worldView.native.getContext('2d').getImageData(x,y,1,1).data),raw=document.createElement('canvas');raw.width=480;raw.height=360;const rc=raw.getContext('2d');rc.drawImage(worldView.room,0,0);const room=(x,y)=>Array.from(rc.getImageData(x,y,1,1).data);
 const behind={actual:pixel(126,179),room:room(126,179)};a.g.position.y=235;worldView.render();const front={actual:pixel(126,224),room:room(126,224)};
 L.light.rgbGlow=.23;L.light.rgbColor='#ff0000';worldView.render();const red=pixel(300,65);L.light.rgbColor='#00ff00';worldView.render();const green=pixel(300,65);
 return {behind,front,rgbChanged:JSON.stringify(red)!==JSON.stringify(green)};
},roster);
assert.deepEqual(depth.behind.actual,depth.behind.room);assert.notDeepEqual(depth.front.actual,depth.front.room);assert(depth.rgbChanged);
await page.reload();await page.waitForFunction(()=>window.world?.agents.length===12);await page.click('#play');
// Actual click, expandable raw JSON, follow, Escape.
await page.evaluate(()=>world.apply({node:'node-01',event:'tool_call',detail:{tool:'search',arg:'pixel card test'}}));
let v=await page.evaluate(()=>({...worldView.view,top:document.querySelector('#stage').getBoundingClientRect().top}));
await page.mouse.click(v.x+101*v.scale,v.top+v.y+210*v.scale);assert.match(await page.locator('#card').innerText(),/Pip[\s\S]*pixel card test/);await page.locator('#card summary').click();assert.match(await page.locator('#card pre').innerText(),/"tool_call"/);
await page.evaluate(()=>worldView.setZoom(2));await page.getByRole('button',{name:'Follow',exact:true}).click();assert.equal(await page.evaluate(()=>world.follow.node),'node-01');await page.evaluate(()=>worldView.render());assert(await page.evaluate(()=>Math.abs(worldView.view.x+world.follow.g.position.x*worldView.view.scale-document.querySelector('canvas').width/2)<=worldView.view.scale));await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>world.follow),null);await page.getByRole('button',{name:'Close',exact:true}).click();
await page.evaluate(()=>worldView.setZoom(0));await page.keyboard.press('p');await page.selectOption('#edit-kind','spots');
v=await page.evaluate(()=>({...worldView.view,top:document.querySelector('#stage').getBoundingClientRect().top}));
await page.mouse.move(v.x+101*v.scale,v.top+v.y+220*v.scale);await page.mouse.down();await page.mouse.move(v.x+112*v.scale,v.top+v.y+220*v.scale);await page.mouse.up();
await page.click('#export');const exported=await page.evaluate(()=>JSON.parse(window.exportedScene));assert.equal(exported.spots[0].x,112);
// New occluder polygon, with automatically created draggable foot line.
await page.selectOption('#edit-kind','occluders');await page.click('#new-polygon');for(const [x,y] of [[300,290],[320,290],[310,310]])await page.mouse.click(v.x+x*v.scale,v.top+v.y+y*v.scale);await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>world.data.occluders.length),7);
await page.keyboard.press('p');
const sizes=[];for(const size of [{width:900,height:700},{width:1920,height:1080},{width:1440,height:1000}]){await page.setViewportSize(size);await page.waitForTimeout(80);await page.mouse.wheel(0,-100);const r=await page.evaluate(()=>({canvas:document.querySelector('canvas').width,stage:document.querySelector('#stage').clientWidth,scale:worldView.view.scale,pixelRatio:devicePixelRatio}));assert.equal(r.canvas,r.stage);assert(Number.isInteger(r.scale));sizes.push(r)}
assert.deepEqual(errors,[]);const results={depth,card:true,follow:true,placementExport:true,newPolygon:true,resizes:sizes,errors};writeFileSync('docs/w0-pixel-interaction-check.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await b.close();
