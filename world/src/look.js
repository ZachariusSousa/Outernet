// Effective look; Claude c71d3dd values preserved. Geometry lives in object modules.
export const look = {
  "textures": {
    "density": 32,
    "palette": [
      "#101b30",
      "#1b2b43",
      "#2c405c",
      "#49617d",
      "#7696b0",
      "#b3c9da",
      "#e2e9ec",
      "#f5e8cf",
      "#c6b69e",
      "#98856e",
      "#6e5b49",
      "#423b37",
      "#e3b476",
      "#ffcf8a",
      "#ffad57",
      "#a86f42",
      "#9173c4",
      "#bba2df",
      "#4c3f6c",
      "#354e43",
      "#53715b",
      "#859879",
      "#833f51",
      "#b77183"
    ]
  },
  "render": {
    "pixelRatio": 1.25,
    "exposure": 1,
    "shadowSize": 1024,
    "bevel": 0.035,
    "bevelSegments": 1,
    "segments": 12,
    "roughness": 0.94
  },
  "camera": {
    "fov": 12,
    "near": 0.1,
    "far": 900,
    "target": [
      0,
      0.7,
      0
    ],
    "yaw": 40,
    "tilt": 55,
    "close": 95,
    "farDistance": 365,
    "orbit": 20,
    "orbitSensitivity": 0.004,
    "spring": 0.06,
    "zoomEase": 0.07,
    "scrollSensitivity": 0.02,
    "farTarget": [
      0,
      -17,
      0
    ],
    "farTilt": 43
  },
  "post": {
    "bloom": {
      "strength": 0.6,
      "radius": 0.35,
      "threshold": 1.4
    },
    "focus": {
      "aperture": 0.00008,
      "maxblur": 0.004
    },
    "fog": {
      "color": "#243152",
      "near": 240,
      "far": 760
    },
    "vignette": 0.18
  },
  "lighting": {
    "ambient": {
      "sky": "#5d6f9e",
      "ground": "#3a3040",
      "strength": 0.35
    },
    "rgb": "#af68ff",
    "rgbPower": 3,
    "screenPower": 0.025,
    "bulbPower": 2.8,
    "glassOpacity": 0.13,
    "lights": [
      {
        "position": [
          -4,
          3,
          -2
        ],
        "color": "#ffce8a",
        "strength": 32,
        "range": 10,
        "shadow": true
      },
      {
        "position": [
          3,
          3,
          -3
        ],
        "color": "#ffbf77",
        "strength": 22,
        "range": 8
      },
      {
        "position": [
          4,
          1.8,
          1
        ],
        "color": "#9c7dff",
        "strength": 10,
        "range": 6
      },
      {
        "position": [
          -7,
          1,
          3
        ],
        "color": "#ffbb7a",
        "strength": 16,
        "range": 7
      },
      {
        "position": [
          -12,
          9,
          9
        ],
        "color": "#829fdb",
        "strength": 16,
        "range": 22
      },
      {
        "position": [
          0,
          1,
          -4
        ],
        "color": "#729cf0",
        "strength": 8,
        "range": 5
      },
      {
        "position": [
          -1,
          2,
          3
        ],
        "color": "#ffce8a",
        "strength": 14,
        "range": 6
      },
      {
        "position": [
          3,
          2,
          -2
        ],
        "color": "#ffce8a",
        "strength": 14,
        "range": 6
      }
    ],
    "flicker": {
      "amount": 0.025,
      "speed": 1.4
    },
    "interior": {
      "min": [
        -6.8,
        -0.5,
        -4.8
      ],
      "max": [
        6.8,
        3.5,
        4.8
      ],
      "color": "#ffb060",
      "strength": 1
    }
  },
  "weather": {
    "count": 400,
    "area": [
      26,
      16,
      24
    ],
    "speed": 0.6,
    "size": 0.065,
    "drift": 0.15,
    "color": "#cbd9ed",
    "opacity": 0.7,
    "bottom": -1
  },
  "materials": {
    "wood": "wood",
    "floor": "parquet",
    "cream": "fabric",
    "dark": "metal",
    "rug": "rug",
    "snow": "snow",
    "stone": "stone",
    "wall": "concrete",
    "green": "leaf",
    "screen": "tv-screen",
    "rgb": "white",
    "bulb": "white",
    "glass": "white",
    "red": "velvet"
  },
  "colors": {
    "wood": "#c6b69e",
    "floor": "#bfb3a6",
    "cream": "#f5e8cf",
    "dark": "#354158",
    "rug": "#7a7488",
    "snow": "#e2e9ec",
    "stone": "#b3c9da",
    "wall": "#f5e8cf",
    "green": "#ffffff",
    "screen": "#ffffff",
    "rgb": "#ffffff",
    "bulb": "#ffcf8a",
    "glass": "#b3c9da",
    "red": "#833f51"
  },
  "ui": {
    "background": "#101b30",
    "text": "#f5e8cf",
    "muted": "#8ea4c0",
    "font": "13px system-ui",
    "top": 28,
    "left": 32,
    "title": "Somewhere above the snow.",
    "eyebrow": "OUTERNET / MIDTOWN",
    "subtitle": "Penthouse study · HD-2D scene review",
    "hint": "Scroll to pull back · Drag to look around",
    "titleSize": 28,
    "smallSize": 10,
    "captionSize": 11,
    "footerBottom": 18,
    "panel": "#101b30ee",
    "border": "#7696b0"
  },
  "city": {
    "floorY": -32,
    "width": 17,
    "depth": 13,
    "height": 31,
    "segments": 12,
    "windowSpacing": 1.6,
    "floorSpacing": 2.2,
    "windowSize": [
      0.7,
      1.1,
      0.05
    ],
    "litFraction": 0.45,
    "seed": 23,
    "windowColors": [
      "#ffcf8a",
      "#ffb35c",
      "#e3b476",
      "#1b2b43",
      "#26344d"
    ],
    "emission": 1.6,
    "stone": "#7696b0",
    "snow": "#b3c9da",
    "trafficCount": 14,
    "peopleCount": 24,
    "streetZ": 16,
    "laneWidth": 3,
    "roadWidth": 12,
    "roadLength": 100,
    "carSpeed": 3,
    "personSpeed": 0.4,
    "steamCount": 12,
    "steamRise": 0.6,
    "riverZ": -60,
    "riverWidth": 100,
    "windowFlickerPeriod": 13,
    "antennaPeriod": 1.3,
    "signalPeriod": 9,
    "horizon": {
      "extent": 150,
      "spacing": 22,
      "minHeight": 12,
      "maxHeight": 48,
      "texture": "facade-distant.png",
      "card": "skyline-card.png",
      "cardPosition": [
        0,
        -5,
        -150
      ],
      "cardSize": [
        300,
        70
      ],
      "roadColor": "#1b2b43"
    }
  },
  "terrace": {
    "left": -7,
    "right": 7,
    "back": -5,
    "front": 7,
    "outerLeft": -10,
    "radius": 2,
    "level": -0.42,
    "railSegments": 12,
    "snowCap": 0.16,
    "railRadius": 0.045,
    "planterRadius": 0.23,
    "capRadius": 0.09
  },
  "agents": {
    "unit": 0.01,
    "bodyDepth": 56,
    "partDepth": 20,
    "bob": 0.012,
    "hop": 0.04,
    "blinkMin": 3,
    "blinkMax": 6,
    "blinkDuration": 0.13,
    "tints": [
      0,
      0.035,
      -0.035
    ],
    "wanderMin": 20,
    "wanderMax": 60,
    "walk": 2.5,
    "tool": 1.2,
    "shimmer": 5,
    "planeBase": 1.5,
    "planeLatencyDivisor": 100,
    "planeMin": 1.5,
    "planeMax": 4,
    "planeArc": 0.8,
    "poof": 0.4,
    "shadowOpacity": 0.2,
    "followDistance": 30,
    "stickyLife": 60
  },
  "placement": {
    "color": "#859879",
    "pathColor": "#e3b476",
    "radius": 0.15
  }
};
