import {object} from './object.js';
export const parts=[
  [
    [
      0,
      0.8,
      0
    ],
    [
      1.5,
      0.12,
      1.5
    ],
    "wood",
    "cylinder"
  ],
  [
    [
      0,
      0.4,
      0
    ],
    [
      0.2,
      0.8,
      0.2
    ],
    "dark",
    "cylinder"
  ]
];
export default ()=>object(parts,'dining');
