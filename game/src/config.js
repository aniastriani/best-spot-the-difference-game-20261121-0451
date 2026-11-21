// Lantern Market at Dusk — configuration for every round.
//
// One job: every number that places a thing on a panel lives here, so the
// scene painter and the difference list can never disagree about where
// something is. A panel is 560 by 420 pixels; the left panel shows the
// scene as drawn, the right panel shows it with every difference applied.

export const PANEL_W = 560;
export const PANEL_H = 420;

// The moon and the one star that can go missing.
export const MOON = { x: 452, y: 70, r: 34 };
export const MOON_CRATER = { x: 440, y: 60, r: 7 };
export const LONELY_STAR = { x: 118, y: 54, r: 5 };

// The string of bulbs across the top of the scene. Bulb positions are
// fixed, so a dark bulb is a fair difference instead of a random one.
export const BULBS = [];
for (let i = 0; i < 12; i += 1) {
  const x = 28 + i * 46;
  const y = 66 - Math.round(16 * Math.sin((i / 11) * Math.PI));
  BULBS.push({ x, y, r: 8 });
}

// Stalls: three little shops in a row, each with its own awning.
export const STALLS = {
  fruit: { x: 36, y: 190, w: 150, h: 130, awning: ['#e4572e', '#fff3e0'] },
  lantern: { x: 205, y: 180, w: 150, h: 140, awning: ['#2a9d8f', '#fff3e0'] },
  balloon: { x: 374, y: 190, w: 150, h: 130, awning: ['#e9c46a', '#fff3e0'] },
};

// The cat naps on a crate in front of the lantern stall.
export const CAT = { x: 300, y: 338 };
export const CRATE = { x: 268, y: 330, w: 64, h: 34 };

// The bunch of balloons tied to the balloon stall.
export const BALLOONS = [
  { x: 468, y: 128, color: '#ef476f' },
  { x: 492, y: 112, color: '#06d6a0' },
  { x: 512, y: 138, color: '#118ab2' },
];

// The lanterns hanging from the middle stall's awning.
export const HANGING_LANTERNS = [
  { x: 232, y: 236, color: '#e63946' },
  { x: 272, y: 244, color: '#f4a261' },
  { x: 312, y: 244, color: '#e63946' },
  { x: 348, y: 236, color: '#f4a261' },
];

// The bunting flags strung between the stalls.
export const BUNTING = [];
for (let i = 0; i < 9; i += 1) {
  BUNTING.push({ x: 60 + i * 52, y: 158 + Math.round(10 * Math.sin((i / 8) * Math.PI)) });
}

// The paper lantern on a pole at the right edge, and the puddle below.
export const POLE_LANTERN = { x: 528, y: 250 };
export const PUDDLE = { x: 120, y: 392, rx: 90, ry: 12 };

// A difference is one small change between the two panels: where it is,
// how big a click may be, and the flag the painter checks.
export const ROUNDS = [
  {
    id: 'dusk-market',
    name: 'Dusk Market',
    seconds: 180,
    seed: 20261121,
    hints: 3,
    rain: false,
    fireworks: false,
    blurb: 'Seven changes hide in the evening crowd. Find them all before dusk ends.',
    differences: [
      { id: 'moon-crater', x: MOON_CRATER.x, y: MOON_CRATER.y, r: 22, hint: 'Look at the moon.' },
      { id: 'dark-bulb', x: BULBS[6].x, y: BULBS[6].y, r: 20, hint: 'One bulb in the string is out.' },
      { id: 'lantern-color', x: HANGING_LANTERNS[2].x, y: HANGING_LANTERNS[2].y, r: 24, hint: 'A lantern changed its colour.' },
      { id: 'cat-tail', x: 262, y: 327, r: 24, hint: 'The cat moved its tail.' },
      { id: 'balloon-gone', x: BALLOONS[1].x, y: BALLOONS[1].y, r: 22, hint: 'Count the balloons.' },
      { id: 'awning-stripe', x: 98, y: 203, r: 22, hint: 'The fruit stall awning is different.' },
      { id: 'star-gone', x: LONELY_STAR.x, y: LONELY_STAR.y, r: 18, hint: 'A star went out near the top left.' },
    ],
  },
  {
    id: 'rainy-night',
    name: 'Rainy Night',
    seconds: 150,
    seed: 1121,
    hints: 3,
    rain: true,
    fireworks: false,
    blurb: 'Rain on the lanterns. Eight changes hide in the wet light.',
    differences: [
      { id: 'umbrella-color', x: 112, y: 155, r: 24, hint: 'The umbrella over the fruit stall.' },
      { id: 'puddle-star', x: 150, y: 392, r: 22, hint: 'Something is missing from the puddle.' },
      { id: 'rain-streak', x: 420, y: 110, r: 22, hint: 'The rain falls differently up high.' },
      { id: 'lantern-out', x: HANGING_LANTERNS[0].x, y: HANGING_LANTERNS[0].y, r: 24, hint: 'A lantern went dark.' },
      { id: 'fruit-color', x: 96, y: 268, r: 22, hint: 'The fruit on the stall changed.' },
      { id: 'flag-gone', x: BUNTING[4].x, y: BUNTING[4].y, r: 20, hint: 'A flag is missing from the bunting.' },
      { id: 'cat-moved', x: 210, y: 352, r: 24, hint: 'The cat found a new spot.' },
      { id: 'sign-letter', x: 280, y: 200, r: 22, hint: 'Read the lantern stall sign.' },
    ],
  },
  {
    id: 'festival-finale',
    name: 'Festival Finale',
    seconds: 120,
    seed: 777,
    hints: 3,
    rain: false,
    fireworks: true,
    blurb: 'Fireworks over the market. Nine changes, and the clock is short.',
    differences: [
      { id: 'firework-color', x: 150, y: 92, r: 24, hint: 'A firework burst changed colour.' },
      { id: 'firework-gone', x: 330, y: 64, r: 22, hint: 'One firework is missing from the sky.' },
      { id: 'pole-lantern', x: 510, y: 212, r: 24, hint: 'The lantern on the pole.' },
      { id: 'balloon-string', x: 482, y: 205, r: 22, hint: 'Follow the balloon strings down.' },
      { id: 'moon-phase', x: MOON.x, y: MOON.y, r: 26, hint: 'The moon itself is different.' },
      { id: 'crate-fruit', x: 434, y: 300, r: 22, hint: 'A crate near the balloon stall.' },
      { id: 'awning-stripe-2', x: 436, y: 203, r: 22, hint: 'The balloon stall awning is different.' },
      { id: 'cat-bow', x: 324, y: 340, r: 20, hint: 'The cat is wearing something.' },
      { id: 'bulb-color', x: BULBS[2].x, y: BULBS[2].y, r: 20, hint: 'One bulb glows a new colour.' },
    ],
  },
];
