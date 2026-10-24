import {object} from './object.js';
export const parts=[
  [
    [
      0,
      2.9,
      0
    ],
    [
      0.035,
      1.2,
      0.035
    ],
    "dark",
    "cylinder"
  ],
  [
    [
      0,
      2.3,
      0
    ],
    [
      0.48,
      0.48,
      0.48
    ],
    "bulb",
    "sphere"
  ]
];
export default ()=>object(parts,'pendant');
