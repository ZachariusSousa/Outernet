import * as T from 'three';
import {object,material} from './object.js';
import {look as L} from '../../look.js';
export default ()=>{const g=object('terrace');const arc=(radius,y)=>new T.CatmullRomCurve3(Array.from({length:L.terrace.railSegments+1},(_,i)=>{const a=i/L.terrace.railSegments*Math.PI/2;return new T.Vector3(-8-radius*Math.cos(a),y,5+radius*Math.sin(a))}));
for(const [radius,y,tube,m] of [[2,.94,L.terrace.railRadius,'dark'],[2,1.02,L.terrace.capRadius,'snow'],[1.7,-.18,L.terrace.planterRadius,'stone'],[1.7,.04,L.terrace.capRadius,'snow']])g.add(new T.Mesh(new T.TubeGeometry(arc(radius,y),L.terrace.railSegments,tube,6,false),material(m,Math.PI*radius/2,tube*Math.PI*2)));
return g};
