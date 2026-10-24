import {assemble} from './models.js';
export const assembly=[["loungeDesignSofa", [0.3, 0, 0], 3.4], ["loungeDesignSofaCorner", [-1.8, 0, 0.3], 1.6], ["loungeSofaOttoman", [-1.8, 0, 1.3], 1.4], ["pillow", [0.7, 0.7, -0.3], 0.55]];
export default ()=>assemble(assembly,'sofa');
