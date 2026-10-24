import {object} from './object.js';
export const parts=[
  [
    [
      0,
      1,
      0
    ],
    [
      1.3,
      2,
      0.5
    ],
    "wood"
  ],
  [
    [
      0,
      1,
      0.28
    ],
    [
      1.1,
      1.8,
      0.05
    ],
    "rug"
  ]
];
export default ()=>object(parts,'bookshelf');
