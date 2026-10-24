import {look as L} from './look.js';

export function createLayers(c,state,sprites){
 const {data,layout,images,manifest}=state,[width,height]=L.art.size;
 const shell=images.get(data.assets.shell),backdrop=images.get(data.assets.backdrop);
 function polygon(points){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath()}
 function drawObject(o,t=0){c.save();c.translate(Math.round(o.x)+(o.flip?o.width:0),Math.round(o.y));if(o.flip)c.scale(-1,1);const asset=manifest.sprites[o.sprite];c.drawImage(images.get('sprites/'+asset.file),0,0,o.width,o.height);
  if(o.layer==='city'){c.fillStyle=L.city.windowColor;for(const [i,p] of (asset.twinkles||[]).entries()){c.globalAlpha=L.city.twinkleAlpha*Math.max(0,Math.sin(t*L.weather.twinkleRate+i*2+o.x));c.fillRect(p.x*o.scale,p.y*o.scale,p.w*o.scale,p.h*o.scale)}}c.restore()}
 function snow(t,depth){const d=L.weather.depths[depth];c.save();c.fillStyle=L.weather.snowColor;c.globalAlpha=d.alpha;for(let i=0;i<d.count;i++){const x=((i*73+Math.sin(i)*17+t*d.drift)%width+width)%width,y=(i*37+t*d.speed)%height;c.fillRect(Math.round(x),Math.round(y),d.size,d.size)}c.restore()}
 function drawBackdrop(t,pan){
  const x=Math.max(width-backdrop.width,Math.min(0,Math.round((width-backdrop.width)/2+pan.x*L.view.parallax))),y=Math.max(height-backdrop.height,Math.min(0,Math.round((height-backdrop.height)/2+pan.y*L.view.parallax)));
  c.drawImage(backdrop,x,y);
  c.save();c.fillStyle=L.weather.snowColor;
  for(const [i,r] of data.backdropTwinkles.entries()){c.globalAlpha=L.weather.twinkleAlpha*Math.max(0,Math.sin(t*L.weather.twinkleRate+i*2));c.fillRect(x+r.x,y+r.y,r.w,r.h)}c.restore();
  return {x,y};
 }
 function glass(){c.save();for(const pane of data.windows){c.save();polygon(pane.polygon);c.clip();c.globalAlpha=L.glass.alpha;c.fillStyle=L.glass.color;c.fill();c.strokeStyle=L.glass.reflection;c.globalAlpha=L.glass.reflectionAlpha;c.lineWidth=L.glass.lineWidth;for(const [a,b] of pane.reflections||[]){c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke()}c.restore()}c.restore()}
 function lightLines(t){
  for(const line of layout.lightLines){const style=L.light.lines[line.style];if(!line.enabled||!style?.enabled||line.points.length<2)continue;const color=line.style==='rgb'?L.light.rgbColor:style.color;
   c.save();c.strokeStyle=style.wire;c.lineWidth=1;c.beginPath();line.points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();
   let walked=0,next=0,bulb=0;
   for(let i=1;i<line.points.length;i++){const a=line.points[i-1],b=line.points[i],length=Math.hypot(b.x-a.x,b.y-a.y);if(!length)continue;
    while(next<=walked+length){const f=(next-walked)/length,x=Math.round(a.x+(b.x-a.x)*f),y=Math.round(a.y+(b.y-a.y)*f),pulse=1-Math.abs(Math.sin(t*style.speed+bulb++))*style.twinkle;c.fillStyle=color;c.globalAlpha=pulse;c.fillRect(x,y,style.size,style.size);c.globalCompositeOperation='lighter';c.globalAlpha=style.glow*pulse;c.fillRect(x-1,y-1,style.size+2,style.size+2);c.globalCompositeOperation='source-over';next+=style.spacing}walked+=length;
   }c.restore();
  }
 }
 function glow(t){c.save();c.globalCompositeOperation='lighter';for(const [i,r] of data.glows.entries()){if(r.enabled===false)continue;const style=L.light.glows[r.style];if(!style)continue;polygon(state.region(r));c.fillStyle=style.color;c.globalAlpha=style.strength*(1+Math.sin(t*L.light.flickerSpeed+i)*Math.sin(t*L.light.flickerSpeed*1.7)*L.light.flickerAmount);c.fill()}c.restore()}
 function atmosphere(t){
  c.save();c.fillStyle=L.weather.steam.color;c.globalAlpha=L.weather.steam.alpha;for(const source of data.steam){const p=state.point(source);for(let i=0;i<L.weather.steam.count;i++){const phase=(t*L.weather.steam.speed+i*3)%L.weather.steam.height;c.fillRect(Math.round(p.x+Math.sin(phase)),Math.round(p.y-phase),1,2)}}
  c.fillStyle=L.weather.dust.color;c.globalAlpha=L.weather.dust.alpha;for(let i=0;i<L.weather.dust.count;i++){const r=data.glows[i%data.glows.length];if(!r)continue;const points=state.region(r),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);c.save();polygon(points);c.clip();c.fillRect(Math.round(x+(i*17+t*L.weather.dust.speed)%Math.max(1,Math.max(...xs)-x)),Math.round(y+(i*23+t*L.weather.dust.speed)%Math.max(1,Math.max(...ys)-y)),1,1);c.restore()}c.restore();
 }
 function grade(){c.save();c.globalCompositeOperation='soft-light';c.fillStyle=L.grade.warmthColor;c.globalAlpha=L.grade.warmth;c.fillRect(0,0,width,height);c.restore();c.save();c.fillStyle=L.grade.vignetteColor;for(let i=0;i<L.grade.vignetteBands;i++){c.globalAlpha=L.grade.vignette/L.grade.vignetteBands;const b=L.grade.vignetteStep*(i+1);c.fillRect(0,0,width,b);c.fillRect(0,height-b,width,b);c.fillRect(0,b,b,height-b*2);c.fillRect(width-b,b,b,height-b*2)}c.restore();if(L.grade.contrast!==1){const im=c.getImageData(0,0,width,height);for(let i=0;i<im.data.length;i+=4)for(let j=0;j<3;j++)im.data[i+j]=128+(im.data[i+j]-128)*L.grade.contrast;c.putImageData(im,0,0)}}
 function render(world,pan){
  c.imageSmoothingEnabled=false;c.globalAlpha=1;c.globalCompositeOperation='source-over';c.clearRect(0,0,width,height);
  const backdropOffset=drawBackdrop(world.elapsed,pan);
  // Buildings share editable world coordinates, but sort in their own outdoor layer.
  // The transparent shell windows reveal them without putting towers in the room.
  for(const o of layout.sprites.filter(o=>o.layer==='city').sort((a,b)=>a.foot.y-b.foot.y))drawObject(o,world.elapsed);
  snow(world.elapsed,0);c.drawImage(shell,0,0);
  for(const o of layout.sprites)if(o.layer==='floor')drawObject(o);
  const sorted=[...layout.sprites.filter(o=>o.layer!=='floor'&&o.layer!=='city').map(o=>({y:o.foot.y,draw:()=>drawObject(o)})),...world.agents.map(a=>({y:a.g.position.y,draw:()=>sprites.agent(c,a,world.elapsed)}))].sort((a,b)=>a.y-b.y);sorted.forEach(o=>o.draw());
  for(const f of world.effects)sprites.effect(c,f,world.elapsed);
  glass();lightLines(world.elapsed);glow(world.elapsed);snow(world.elapsed,1);atmosphere(world.elapsed);grade();return backdropOffset;
 }
 return {render,polygon,drawObject,shell};
}
