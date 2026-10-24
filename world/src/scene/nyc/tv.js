import {assemble} from './models.js';
export const assembly=[["cabinetTelevision", [0, 0, 0], 3.8], ["televisionModern", [0, 0.7, 0], 3.3]];
export default ()=>assemble(assembly,'tv');
