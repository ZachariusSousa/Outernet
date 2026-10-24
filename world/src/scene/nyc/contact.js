import * as T from 'three';
import {look as L} from '../../look.js';
const c=document.createElement('canvas');c.width=c.height=L.softness.contact.texels;const ctx=c.getContext('2d'),h=c.width/2,g=ctx.createRadialGradient(h,h,0,h,h,h);g.addColorStop(0,'rgba(0,0,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height);const texture=new T.CanvasTexture(c);
export function contactShadow(width,depth){const mesh=new T.Mesh(new T.PlaneGeometry(width,depth),new T.MeshBasicMaterial({map:texture,transparent:true,opacity:L.softness.contact.opacity,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));mesh.rotation.x=-Math.PI/2;mesh.position.y=L.softness.contact.lift;return mesh}
