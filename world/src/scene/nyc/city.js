import * as T from 'three';
import {material} from './object.js';
import {look as L} from '../../look.js';
export default function city(){
 const g=new T.Group(),C=L.city;g.name='city';let seed=C.seed;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};const batches=new Map();
 function add(p,d,color,emission=0){const k=color+':'+emission;if(!batches.has(k))batches.set(k,{color,emission,parts:[]});batches.get(k).parts.push({p,d});}
 const snow=C.snow,stone=C.stone;
 function tower(x,z,w,d,h,variant){const base=C.floorY;add([x,base+h/2,z],[w,h,d],stone);add([x,base+h+.1,z],[w+.2,.2,d+.2],snow);
 for(let floor=base+1;floor<base+h-1;floor+=C.floorSpacing){for(let u=-w/2+1;u<w/2;u+=C.windowSpacing){const c=rand()<C.litFraction?C.windowColors[Math.floor(rand()*3)]:C.windowColors[3];add([x+u,floor,z+d/2+.04],[...C.windowSize],c,c===C.windowColors[3]?0:C.emission)}for(let v=-d/2+1;v<d/2;v+=C.windowSpacing){const c=C.windowColors[Math.floor(rand()*C.windowColors.length)];add([x+w/2+.04,floor,z+v],[.05,C.windowSize[1],C.windowSize[0]],c,C.emission*.7)}}
 for(let u=-w/2;u<=w/2;u+=C.windowSpacing)add([x+u,base+h/2,z+d/2+.12],[.15,h,.2],stone);
 if(variant==='crown'){for(let i=0;i<4;i++)add([x,base+h+i*.8,z],[w-i*.8,.8,d-i*.8],stone);add([x,base+h+4,z],[.12,3,.12],C.windowColors[0],C.emission)}
 if(variant==='setback'){for(let i=0;i<3;i++)add([x,base+h+i*1.3,z],[w-i*1.2,1.3,d-i*1.2],stone)}
 if(variant==='water'){const tank=new T.Mesh(new T.CylinderGeometry(1,1,2,C.segments),new T.MeshStandardMaterial({color:stone,roughness:1}));tank.position.set(x,base+h+2,z);g.add(tank);for(const u of [-.7,.7])for(const v of [-.7,.7])add([x+u,base+h+.7,z+v],[.1,1.4,.1],stone);add([x,base+h+3,z],[2,.15,2],snow)}
 if(variant==='slant'){const roof=new T.Mesh(new T.BoxGeometry(w,.2,d),new T.MeshStandardMaterial({color:'#7696b0',roughness:.4}));roof.position.set(x,base+h+1,z);roof.rotation.z=.25;g.add(roof)}
 }
 tower(0,0,15,11,27.3,'setback'); // 27.3 so the 3 setback tiers end under the penthouse slab instead of poking through the floor
 // Wedding-cake crown beneath the apartment and its wider snowy setback.
 for(const [y,w,d] of [[-2,19,15],[-3.8,18,14],[-5.4,17,13]]){add([0,y,0],[w,1.4,d],stone);add([0,y+.76,0],[w+.15,.16,d+.15],snow)}
 for(const [x,z,w,d,h,v] of [[-22,-15,10,10,22,'water'],[-6,-24,9,10,25,'crown'],[13,-20,9,9,23,'slant'],[24,-5,8,10,19,'water'],[-22,8,9,8,15,'setback'],[22,17,8,8,12,'crown'],[0,-42,7,7,45,'crown']])tower(x,z,w,d,h,v);

 // Snowy block footprints separated by a street grid, instead of one featureless ground plane.
 const H=C.horizon;for(let x=-H.extent;x<=H.extent;x+=H.spacing)for(let z=-H.extent;z<=H.extent;z+=H.spacing){add([x,C.floorY-.5,z],[H.spacing-4,.5,H.spacing-4],snow);if(Math.abs(x)<32&&Math.abs(z)<48||z>5&&Math.abs(x)<36)continue;const height=H.minHeight+rand()*(H.maxHeight-H.minHeight),w=7+rand()*5,d=7+rand()*5;tower(x,z,w,d,height,['water','crown','setback','slant'][Math.floor(rand()*4)]);}
 const horizonMap=new T.TextureLoader().load('/art/textures/'+H.card);horizonMap.colorSpace=T.SRGBColorSpace;horizonMap.minFilter=horizonMap.magFilter=T.NearestFilter;horizonMap.generateMipmaps=false;const card=new T.Mesh(new T.PlaneGeometry(...H.cardSize),new T.MeshBasicMaterial({map:horizonMap,transparent:true,depthWrite:false,fog:true}));card.position.set(...H.cardPosition);g.add(card);
 add([0,C.floorY,17],[C.roadLength,.1,C.roadWidth],'#1b2b43');add([19,C.floorY,.5],[10,.1,70],'#1b2b43');
 for(const z of [9,25])add([0,C.floorY+.2,z],[100,.4,3],snow);
 for(let x=13;x<26;x+=2)add([x,C.floorY+.07,17],[.8,.03,10],snow);
 for(let x=-40;x<42;x+=8){add([x,C.floorY+2.5,9],[.1,5,.1],stone);add([x,C.floorY+5,9],[.6,.15,.35],C.windowColors[0],C.emission*2);add([x,C.floorY+1,-6],[3,.05,1.6],C.windowColors[0],C.emission)}
 add([0,C.floorY-1,C.riverZ],[C.riverWidth,.1,18],'#223650');for(let x=-40;x<45;x+=4)add([x,C.floorY,C.riverZ-9],[.2,.2,.2],C.windowColors[0],C.emission);
 // Instanced repeated masonry, ledges and windows.
 const geo=new T.BoxGeometry(1,1,1),dummy=new T.Object3D();for(const b of batches.values()){const mat=(()=>{const m=material(b.emission?'bulb':'stone',2,2).clone();m.color.set(b.color);m.emissive.set(b.color);m.emissiveIntensity=b.emission;return m})();const mesh=new T.InstancedMesh(geo,mat,b.parts.length);b.parts.forEach((p,i)=>{dummy.position.set(...p.p);dummy.scale.set(...p.d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});g.add(mesh)}
 const signals=[];for(const x of [12,25]){const post=new T.Mesh(new T.BoxGeometry(.12,3,.12),new T.MeshStandardMaterial({color:stone}));post.position.set(x,C.floorY+1.5,10);g.add(post);const signal=new T.Mesh(new T.BoxGeometry(.3,.6,.3),new T.MeshBasicMaterial({color:'#859879'}));signal.position.set(x,C.floorY+3,10);g.add(signal);signals.push(signal)}
 const beacon=new T.Mesh(new T.SphereGeometry(.15,6,4),new T.MeshBasicMaterial({color:'#b77183'}));beacon.position.set(-6,C.floorY+44,-24);g.add(beacon);
 const movers=[];for(let i=0;i<C.trafficCount;i++){const car=new T.Group();const body=new T.Mesh(new T.BoxGeometry(1.8,.65,.85),new T.MeshStandardMaterial({color:i%3?'#e3b476':'#7696b0'}));car.add(body);const roof=body.clone();roof.scale.set(.55,.7,.9);roof.position.y=.45;car.add(roof);for(const z of [-.25,.25]){const light=new T.Mesh(new T.BoxGeometry(.06,.14,.16),new T.MeshBasicMaterial({color:'#ffcf8a'}));light.position.set(1,.05,z);car.add(light)}car.position.set(-45+rand()*90,C.floorY+.6,C.streetZ+(i%2?2:-2));g.add(car);movers.push({o:car,speed:(i%2?1:-1)*C.carSpeed*(.7+rand())})}
 for(let i=0;i<C.peopleCount;i++){const person=new T.Mesh(new T.BoxGeometry(.23,.65,.23),new T.MeshStandardMaterial({color:C.windowColors[i%4]}));person.position.set(rand()*80-40,C.floorY+.6,i%2?9:25);g.add(person);movers.push({o:person,speed:C.personSpeed*(i%2?1:-1)})}
 const steam=[];for(let i=0;i<C.steamCount;i++){const puff=new T.Mesh(new T.SphereGeometry(.35,6,4),new T.MeshBasicMaterial({color:snow,transparent:true,opacity:.16,depthWrite:false}));puff.position.set(-10+i%3*11,C.floorY+1+i/3,25);g.add(puff);steam.push(puff)}
 g.userData.update=(dt,time)=>{beacon.visible=Math.sin(time/C.antennaPeriod*Math.PI*2)>0;signals.forEach((o,i)=>o.material.color.set(Math.floor(time/C.signalPeriod+i)%2?'#859879':'#b77183'));for(const b of g.children)if(b.isInstancedMesh&&b.material.emissiveIntensity>0)b.material.emissiveIntensity=C.emission*(.85+.15*Math.sin(time/C.windowFlickerPeriod));for(const m of movers){m.o.position.x+=m.speed*dt;if(Math.abs(m.o.position.x)>48)m.o.position.x*=-1}for(const p of steam){p.position.y+=dt*C.steamRise;if(p.position.y>C.floorY+4)p.position.y=C.floorY+.4;p.scale.setScalar(1+(p.position.y-C.floorY)*.25)}};return g;
}

