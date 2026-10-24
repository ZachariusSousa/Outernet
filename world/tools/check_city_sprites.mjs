import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const prefix=process.env.WORLD_CAPTURE_PREFIX||'docs/w0-city-sprites';
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1}),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(process.env.WORLD_URL||'http://127.0.0.1:5180/');await page.waitForFunction(()=>window.world?.agents.length===12);
 const initial=await page.evaluate(()=>{const s=worldView.state,city=s.layout.sprites.filter(o=>o.layer==='city');return {count:city.length,designs:new Set(city.map(o=>o.sprite)).size,backdrop:s.data.assets.backdrop,agents:world.agents.length}});
 assert.equal(initial.count,9);assert.equal(initial.designs,2);assert.equal(initial.backdrop,'sky-river.png');
 assert(await page.evaluate(()=>!worldView.layout.sprites.some(o=>o.sprite==='tower-art-deco')));
 await page.click('#place');await page.selectOption('#edit-kind','city');
 assert.equal(await page.locator('#edit-object option').count(),10);
 const screen=async p=>page.evaluate(p=>({x:worldView.view.x+p.x*worldView.view.scale,y:document.querySelector('#stage').getBoundingClientRect().top+worldView.view.y+p.y*worldView.view.scale}),p);
 // A clipped neighbor has an offscreen center: test dragging an opaque facade pixel.
 const hit=await page.evaluate(()=>{const s=worldView.state,o=s.byId('city-neighbor-right'),a=s.manifest.sprites[o.sprite],canvas=document.createElement('canvas');canvas.width=a.width;canvas.height=a.height;const c=canvas.getContext('2d');c.drawImage(s.images.get('sprites/'+a.file),0,0);const px=c.getImageData(0,0,a.width,a.height).data;
  for(let y=155;y<210;y++)for(let x=450;x<478;x++){const ix=Math.floor((x-o.x)/o.scale),iy=Math.floor((y-o.y)/o.scale),sx=o.flip?a.width-1-ix:ix;if(ix>=0&&ix<a.width&&iy>=0&&iy<a.height&&px[(iy*a.width+sx)*4+3])return {x,y,oldX:o.x,oldY:o.y}}throw Error('No visible facade pixel');});
 const from=await screen(hit),to=await screen({x:hit.x-8,y:hit.y+4});await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y);await page.mouse.up();
 assert.equal(await page.evaluate(()=>worldView.editor.selection.o.id),'city-neighbor-right');
 assert.equal(await page.evaluate(()=>worldView.state.byId('city-neighbor-right').x),hit.oldX-8);
 assert.equal(await page.evaluate(()=>worldView.state.byId('city-neighbor-right').y),hit.oldY+4);
 const flip=await page.evaluate(()=>worldView.editor.selection.o.flip);await page.click('#mirror');assert.equal(await page.evaluate(()=>worldView.editor.selection.o.flip),!flip);
 await page.locator('#editor details summary').click();await page.selectOption('#sprite-choice','tower-brick-water');await page.click('#add-sprite');const at=await screen({x:250,y:100});await page.mouse.click(at.x,at.y);
 assert.equal(await page.evaluate(()=>worldView.editor.selection.o.layer),'city');
 await page.click('#delete-object');assert.equal(await page.evaluate(()=>worldView.layout.sprites.filter(o=>o.layer==='city').length),9);
 await page.click('#export-layout');const exported=await page.evaluate(()=>JSON.parse(window.exportedLayout));assert.equal(exported.sprites.find(o=>o.id==='city-neighbor-right').x,hit.oldX-8);
 assert.equal(exported.sprites.filter(o=>o.layer==='city').length,9);
 await page.mouse.move(5,5);await page.screenshot({path:prefix+'-placement.png'});
 await page.reload();await page.waitForFunction(()=>window.world?.agents.length===12);await page.click('#play');await page.mouse.move(5,5);
 await page.screenshot({path:prefix+'-fit.png'});await page.evaluate(()=>worldView.setZoom(2));await page.screenshot({path:prefix+'-fit-plus-2.png'});
 assert.deepEqual(errors,[]);
 const report={...initial,dragClippedBuilding:true,flip:true,paletteDefaultsToCity:true,addRemove:true,layoutExport:true,consoleErrors:errors};
 writeFileSync(prefix+'-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
