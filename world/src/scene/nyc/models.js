import {contactShadow} from './contact.js';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {look as L} from '../../look.js';
const manifest=await fetch('/art/models/models.json').then(r=>r.json()),loader=new GLTFLoader(),cache=new Map();
await Promise.all(manifest.map(async item=>{const gltf=await loader.loadAsync('/art/models/'+item.file);cache.set(item.pack+':'+item.name,gltf.scene)}));
export function getModel(name,pack='kenney-furniture',width=1){const root=cache.get(pack+':'+name).clone(true);const bounds=new T.Box3().setFromObject(root),size=bounds.getSize(new T.Vector3());const scale=width/Math.max(size.x,.001);root.scale.multiplyScalar(scale);root.position.set(-(bounds.min.x+bounds.max.x)/2*scale,-bounds.min.y*scale,-(bounds.min.z+bounds.max.z)/2*scale);const group=new T.Group();group.add(root);group.add(contactShadow(width,Math.max(.2,size.z*scale)));root.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;const soften=m=>{const c=m.clone();c.roughness=L.modelStyle.roughness;c.flatShading=false;c.emissiveIntensity=0;for(const [prefix,color] of Object.entries(L.modelStyle.remaps))if(m.name.toLowerCase().includes(prefix))c.color.set(color);return c};o.material=Array.isArray(o.material)?o.material.map(soften):soften(o.material)}});return group}
export function assemble(items,type){const group=new T.Group();group.name=type;for(const [name,p,width,pack] of items){const model=getModel(name,pack,width);model.position.fromArray(p);group.add(model)}return group}
