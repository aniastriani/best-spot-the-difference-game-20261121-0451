// A tiny seeded random generator, so both panels of a scene agree exactly
// about every speck of dust the painter throws in, and so a round looks
// the same every time it is played.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A number between low and high, from the given generator.
export function range(rng, low, high) {
  return low + rng() * (high - low);
}

// One item of a list, picked by the generator.
export function pick(rng, list) {
  return list[Math.floor(rng() * list.length)];
}
