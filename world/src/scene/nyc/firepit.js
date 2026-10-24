import {object} from './object.js';
export const parts=[
  [
    [
      0,
      0.25,
      0
    ],
    [
      1.3,
      0.5,
      1.3
    ],
    "dark",
    "cylinder"
  ],
  [
    [
      0,
      0.54,
      0
    ],
    [
      0.9,
      0.15,
      0.9
    ],
    "bulb",
    "cone"
  ]
];
export default ()=>object(parts,'firepit');
