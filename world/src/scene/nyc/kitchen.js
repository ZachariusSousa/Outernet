import {assemble} from './models.js';
export const assembly=[["kitchenFridge", [-2, 0, 0], 1.2], ["kitchenCabinet", [-0.7, 0, 0], 1.3], ["kitchenStove", [0.6, 0, 0], 1.2], ["kitchenCabinet", [1.8, 0, 0], 1.2], ["kitchenCabinetUpper", [0, 2, 0], 1.4], ["kitchenCabinetUpper", [1.5, 2, 0], 1.4], ["kitchenCoffeeMachine", [-0.7, 1, 0], 0.3]];
export default ()=>assemble(assembly,'kitchen');
