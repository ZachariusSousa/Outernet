import {assemble} from './models.js';
export const assembly=[["desk", [0, 0, 0], 3.3], ["computerScreen", [-0.7, 0.95, -0.2], 1.25], ["computerScreen", [0.7, 0.95, -0.2], 1.25], ["computerKeyboard", [0, 0.96, 0.2], 0.9]];
export default ()=>assemble(assembly,'desk');
