import {object} from './object.js';
export const parts=[
  [
    [
      0,
      -0.14,
      0
    ],
    [
      2,
      0.16,
      0.6
    ],
    "stone"
  ],
  [
    [
      0,
      -0.3,
      0.5
    ],
    [
      2,
      0.16,
      0.6
    ],
    "stone"
  ]
];
export default ()=>object(parts,'steps');
