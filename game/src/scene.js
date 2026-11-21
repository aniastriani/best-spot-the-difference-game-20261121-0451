// The painter: draws one panel of the night market on a canvas.
//
// The same round, drawn twice — once plain (the left panel) and once with
// every difference flag set (the right panel) — gives two near-identical
// pictures. All randomness is decided up front from the round's seed, so
// a flag can never shift a speck of dust on one panel only.

import {
  PANEL_W, PANEL_H, MOON, MOON_CRATER, LONELY_STAR, BULBS, STALLS,
  CAT, CRATE, BALLOONS, HANGING_LANTERNS, BUNTING, POLE_LANTERN, PUDDLE,
} from './config.js';
import { mulberry32, range } from './random.js';

// Every random speck of the scene, decided before any flag is looked at.
function makeDecor(round) {
  const rng = mulberry32(round.seed);
  const stars = [];
  for (let i = 0; i < 46; i += 1) {
    stars.push({ x: range(rng, 8, PANEL_W - 8), y: range(rng, 8, 150), r: range(rng, 0.7, 1.8) });
  }
  const rain = [];
  for (let i = 0; i < 70; i += 1) {
    rain.push({ x: range(rng, 0, PANEL_W), y: range(rng, 0, PANEL_H), len: range(rng, 10, 18) });
  }
  const sparks = [];
  const centers = [{ x: 150, y: 92 }, { x: 330, y: 64 }, { x: 480, y: 80 }];
  for (const c of centers) {
    const burst = [];
    for (let i = 0; i < 26; i += 1) {
      const a = range(rng, 0, Math.PI * 2);
      const d = range(rng, 12, 42);
      burst.push({ x: c.x + Math.cos(a) * d, y: c.y + Math.sin(a) * d * 0.8, r: range(rng, 1, 2.4) });
    }
    sparks.push({ x: c.x, y: c.y, burst });
  }
  const cobbles = [];
  for (let i = 0; i < 26; i += 1) {
    cobbles.push({ x: range(rng, 10, PANEL_W - 10), y: range(rng, 356, 412), r: range(rng, 3, 7) });
  }
  return { stars, rain, sparks, cobbles };
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawSky(ctx, round) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  if (round.rain) {
    g.addColorStop(0, '#141b33');
    g.addColorStop(0.55, '#2c3a5e');
    g.addColorStop(1, '#7a5a78');
  } else if (round.fireworks) {
    g.addColorStop(0, '#0d0b2e');
    g.addColorStop(0.55, '#3b2a6b');
    g.addColorStop(1, '#b45309');
  } else {
    g.addColorStop(0, '#1e1b4b');
    g.addColorStop(0.55, '#4c2a85');
    g.addColorStop(1, '#c2703d');
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

function drawStars(ctx, decor, mods) {
  ctx.fillStyle = '#fef9c3';
  for (const s of decor.stars) circle(ctx, s.x, s.y, s.r);
  if (!mods['star-gone']) {
    ctx.fillStyle = '#fef08a';
    circle(ctx, LONELY_STAR.x, LONELY_STAR.y, LONELY_STAR.r);
    ctx.fillStyle = '#fff';
    circle(ctx, LONELY_STAR.x - 2, LONELY_STAR.y - 2, 1.6);
  }
}

function drawMoon(ctx, mods) {
  ctx.fillStyle = '#fef3c7';
  circle(ctx, MOON.x, MOON.y, MOON.r);
  ctx.fillStyle = '#e7d391';
  if (!mods['moon-crater']) circle(ctx, MOON_CRATER.x, MOON_CRATER.y, MOON_CRATER.r);
  circle(ctx, MOON.x + 10, MOON.y + 12, 5);
  circle(ctx, MOON.x - 14, MOON.y + 14, 4);
  if (mods['moon-phase']) {
    // A bite taken out of the moon: a sky-coloured disc over its edge.
    ctx.fillStyle = '#1e1b4b';
    circle(ctx, MOON.x + 16, MOON.y - 10, 28);
  }
}

function drawFireworks(ctx, decor, mods) {
  const colors = ['#fbbf24', '#f472b6', '#a78bfa'];
  decor.sparks.forEach((burst, i) => {
    if (i === 1 && mods['firework-gone']) return;
    const color = i === 0 && mods['firework-color'] ? '#f472b6' : colors[i];
    ctx.fillStyle = color;
    circle(ctx, burst.x, burst.y, 4);
    for (const s of burst.burst) circle(ctx, s.x, s.y, s.r);
  });
}

function drawRooftops(ctx) {
  ctx.fillStyle = '#171233';
  ctx.fillRect(0, 132, PANEL_W, 34);
  ctx.fillRect(40, 108, 60, 26);
  ctx.fillRect(430, 112, 70, 22);
  ctx.fillRect(64, 92, 12, 18);
  ctx.fillRect(452, 96, 12, 18);
  // A few lit windows in the dark houses.
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(52, 140, 10, 12);
  ctx.fillRect(96, 140, 10, 12);
  ctx.fillRect(446, 140, 10, 12);
}

function drawStringLights(ctx, mods) {
  ctx.strokeStyle = '#3f3a5e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, 58);
  ctx.quadraticCurveTo(PANEL_W / 2, 96, PANEL_W - 10, 54);
  ctx.stroke();
  BULBS.forEach((b, i) => {
    const dark = mods['dark-bulb'] && i === 6;
    const blue = mods['bulb-color'] && i === 2;
    ctx.fillStyle = dark ? '#4b4763' : blue ? '#60a5fa' : '#fde047';
    if (!dark) {
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = blue ? '#60a5fa' : '#fde047';
      circle(ctx, b.x, b.y, b.r + 6);
      ctx.globalAlpha = 1;
      ctx.fillStyle = blue ? '#60a5fa' : '#fde047';
    }
    circle(ctx, b.x, b.y, b.r);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(b.x - 2, b.y - b.r - 3, 4, 4);
  });
}

function drawAwning(ctx, stall, stripeMod) {
  const { x, y, w, awning } = stall;
  const stripes = 6;
  const sw = w / stripes;
  for (let i = 0; i < stripes; i += 1) {
    let color = awning[i % 2];
    if (stripeMod && i === 2) color = '#3b82f6';
    ctx.fillStyle = color;
    ctx.fillRect(x + i * sw, y, sw, 26);
  }
  // Scalloped edge.
  ctx.fillStyle = awning[0];
  for (let i = 0; i < stripes; i += 1) {
    ctx.beginPath();
    ctx.arc(x + i * sw + sw / 2, y + 26, sw / 2, 0, Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = '#5b3a1e';
  ctx.fillRect(x - 4, y + 26, 5, 108);
  ctx.fillRect(x + w - 1, y + 26, 5, 108);
}

function drawFruitStall(ctx, round, mods) {
  const s = STALLS.fruit;
  drawAwning(ctx, s, mods['awning-stripe']);
  ctx.fillStyle = '#7c4a21';
  ctx.fillRect(s.x + 4, s.y + 96, s.w - 8, 38);
  ctx.fillStyle = '#a16207';
  ctx.fillRect(s.x + 4, s.y + 90, s.w - 8, 8);
  // A pile of round fruit on the counter.
  const fruitColor = mods['fruit-color'] ? '#65a30d' : '#ea580c';
  ctx.fillStyle = fruitColor;
  for (let row = 0; row < 3; row += 1) {
    for (let i = 0; i < 5 - row; i += 1) {
      circle(ctx, s.x + 28 + i * 24 + row * 12, s.y + 84 - row * 13, 10);
    }
  }
  if (round.rain) {
    // A little umbrella shelters the fruit from the rain.
    ctx.fillStyle = mods['umbrella-color'] ? '#0d9488' : '#dc2626';
    ctx.beginPath();
    ctx.arc(112, 178, 46, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(112, 132);
    ctx.lineTo(112, 178);
    ctx.stroke();
  }
}

function drawLanternStall(ctx, mods) {
  const s = STALLS.lantern;
  drawAwning(ctx, s, false);
  ctx.fillStyle = '#134e4a';
  ctx.fillRect(s.x + 4, s.y + 96, s.w - 8, 44);
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(s.x + 4, s.y + 90, s.w - 8, 8);
  // The hanging sign: TEA on one panel, TOA on the other.
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(255, 195, 50, 24);
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 2;
  ctx.strokeRect(255, 195, 50, 24);
  ctx.fillStyle = '#7c2d12';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(mods['sign-letter'] ? 'TOA' : 'TEA', 280, 208);
  // Paper lanterns swaying under the awning.
  HANGING_LANTERNS.forEach((lamp, i) => {
    const lit = !(mods['lantern-out'] && i === 0);
    const color = mods['lantern-color'] && i === 2 ? '#16a34a' : lamp.color;
    ctx.strokeStyle = '#3f3a5e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(lamp.x, s.y + 30);
    ctx.lineTo(lamp.x, lamp.y - 10);
    ctx.stroke();
    if (lit) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = color;
      circle(ctx, lamp.x, lamp.y, 20);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = lit ? color : '#57534e';
    ctx.beginPath();
    ctx.ellipse(lamp.x, lamp.y, 11, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.fillRect(lamp.x - 4, lamp.y - 16, 8, 4);
    ctx.fillRect(lamp.x - 4, lamp.y + 12, 8, 4);
  });
}

function drawBalloonStall(ctx, mods) {
  const s = STALLS.balloon;
  drawAwning(ctx, s, mods['awning-stripe-2']);
  ctx.fillStyle = '#7c4a21';
  ctx.fillRect(s.x + 4, s.y + 96, s.w - 8, 38);
  ctx.fillStyle = '#a16207';
  ctx.fillRect(s.x + 4, s.y + 90, s.w - 8, 8);
  // A crate of fruit by the stall's foot.
  ctx.fillStyle = '#92400e';
  ctx.fillRect(412, 296, 44, 26);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(412, 306, 44, 3);
  ctx.fillStyle = mods['crate-fruit'] ? '#92400e' : '#ea580c';
  if (!mods['crate-fruit']) {
    circle(ctx, 424, 294, 7);
    circle(ctx, 438, 292, 7);
    circle(ctx, 431, 284, 7);
  }
  // The balloons, with strings down to the stall.
  BALLOONS.forEach((b, i) => {
    if (mods['balloon-gone'] && i === 1) return;
    if (!mods['balloon-string']) {
      ctx.strokeStyle = '#d6d3d1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + 16);
      ctx.quadraticCurveTo(b.x - 8, b.y + 44, s.x + 60, s.y + 90);
      ctx.stroke();
    }
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, 15, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    circle(ctx, b.x - 5, b.y - 6, 4);
  });
}

function drawBunting(ctx, mods) {
  ctx.strokeStyle = '#3f3a5e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 150);
  ctx.quadraticCurveTo(PANEL_W / 2, 178, PANEL_W - 40, 148);
  ctx.stroke();
  const colors = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#f78c6b'];
  BUNTING.forEach((flag, i) => {
    if (mods['flag-gone'] && i === 4) return;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(flag.x - 9, flag.y);
    ctx.lineTo(flag.x + 9, flag.y);
    ctx.lineTo(flag.x, flag.y + 18);
    ctx.closePath();
    ctx.fill();
  });
}

function drawCat(ctx, mods) {
  const pos = mods['cat-moved'] ? { x: 210, y: 352 } : CAT;
  // Crate under the cat, only when the cat sits on it.
  if (!mods['cat-moved']) {
    ctx.fillStyle = '#92400e';
    ctx.fillRect(CRATE.x, CRATE.y, CRATE.w, CRATE.h);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(CRATE.x, CRATE.y + 12, CRATE.w, 3);
    ctx.fillRect(CRATE.x + 20, CRATE.y, 3, CRATE.h);
  }
  const x = pos.x;
  const y = pos.y;
  // Body, head, ears, tail.
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.ellipse(x, y, 26, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, x + 24, y - 12, 12);
  ctx.beginPath();
  ctx.moveTo(x + 16, y - 20);
  ctx.lineTo(x + 19, y - 30);
  ctx.lineTo(x + 24, y - 21);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 26, y - 22);
  ctx.lineTo(x + 30, y - 31);
  ctx.lineTo(x + 34, y - 21);
  ctx.closePath();
  ctx.fill();
  // Eyes: two green glints.
  ctx.fillStyle = '#a3e635';
  circle(ctx, x + 20, y - 14, 1.8);
  circle(ctx, x + 28, y - 14, 1.8);
  // Tail: curled up on one panel, flat on the ground on the other.
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 24, y + 4);
  if (mods['cat-tail']) {
    ctx.quadraticCurveTo(x - 44, y + 12, x - 52, y + 2);
  } else {
    ctx.quadraticCurveTo(x - 40, y - 18, x - 30, y - 26);
  }
  ctx.stroke();
  // A red bow, only on the festival panel.
  if (mods['cat-bow']) {
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(x + 24, y + 2);
    ctx.lineTo(x + 14, y - 4);
    ctx.lineTo(x + 14, y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 24, y + 2);
    ctx.lineTo(x + 34, y - 4);
    ctx.lineTo(x + 34, y + 8);
    ctx.closePath();
    ctx.fill();
    circle(ctx, x + 24, y + 2, 3);
  }
}

function drawPoleLantern(ctx, mods) {
  ctx.fillStyle = '#44403c';
  ctx.fillRect(POLE_LANTERN.x - 2, 180, 4, 150);
  ctx.strokeStyle = '#44403c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(POLE_LANTERN.x - 2, 180);
  ctx.lineTo(POLE_LANTERN.x - 22, 196);
  ctx.stroke();
  const lit = !mods['pole-lantern'];
  if (lit) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#f59e0b';
    circle(ctx, POLE_LANTERN.x - 18, 212, 22);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = lit ? '#f59e0b' : '#57534e';
  ctx.beginPath();
  ctx.ellipse(POLE_LANTERN.x - 18, 212, 10, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#78350f';
  ctx.fillRect(POLE_LANTERN.x - 23, 196, 10, 4);
}

function drawGround(ctx, decor, mods) {
  ctx.fillStyle = '#241d33';
  ctx.fillRect(0, 350, PANEL_W, 70);
  ctx.fillStyle = '#322a45';
  for (const c of decor.cobbles) circle(ctx, c.x, c.y, c.r);
  // The puddle mirrors the lights and one star.
  ctx.fillStyle = 'rgba(147, 197, 253, 0.35)';
  ctx.beginPath();
  ctx.ellipse(PUDDLE.x, PUDDLE.y, PUDDLE.rx, PUDDLE.ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(253, 224, 71, 0.8)';
  circle(ctx, PUDDLE.x - 30, PUDDLE.y, 3);
  circle(ctx, PUDDLE.x + 20, PUDDLE.y + 2, 3);
  if (!mods['puddle-star']) {
    ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
    circle(ctx, 150, PUDDLE.y - 2, 2.5);
  }
}

function drawRain(ctx, decor, mods) {
  ctx.strokeStyle = 'rgba(191, 219, 254, 0.5)';
  ctx.lineWidth = 1.5;
  for (const drop of decor.rain) {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - 4, drop.y + drop.len);
    ctx.stroke();
  }
  // One fixed streak high on the right: it is there on the left panel and
  // gone on the right, so the difference sits exactly where it is marked.
  if (!mods['rain-streak']) {
    ctx.beginPath();
    ctx.moveTo(420, 100);
    ctx.lineTo(416, 118);
    ctx.stroke();
  }
}

// Draw one whole panel: the market as it is, plus whatever the flags change.
export function drawScene(ctx, round, mods) {
  const decor = makeDecor(round);
  drawSky(ctx, round);
  drawStars(ctx, decor, mods);
  drawMoon(ctx, mods);
  if (round.fireworks) drawFireworks(ctx, decor, mods);
  drawRooftops(ctx);
  drawStringLights(ctx, mods);
  drawBunting(ctx, mods);
  drawFruitStall(ctx, round, mods);
  drawLanternStall(ctx, mods);
  drawBalloonStall(ctx, mods);
  drawPoleLantern(ctx, mods);
  drawGround(ctx, decor, mods);
  drawCat(ctx, mods);
  if (round.rain) drawRain(ctx, decor, mods);
}
