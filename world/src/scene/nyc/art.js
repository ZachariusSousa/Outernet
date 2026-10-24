import {object} from './object.js';
export const parts=[
  [
    [
      0,
      1.8,
      0
    ],
    [
      0.9,
      1.2,
      0.12
    ],
    "wood"
  ],
  [
    [
      0,
      1.8,
      0.08
    ],
    [
      0.75,
      1.05,
      0.02
    ],
    "rug"
  ]
];
export default ()=>object(parts,'art');
