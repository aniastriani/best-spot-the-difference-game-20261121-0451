// Everything the player sees on top of the pictures: the rings around
// found differences, the hint pulse, the miss ripple, the HUD numbers,
// and the title, round-clear, win and time-up overlays.

import { drawScene } from './scene.js';

// The mods for a panel: the left panel is the plain scene, the right one
// carries every difference of the round.
export function modsFor(side, round) {
  if (side === 'left') return {};
  const mods = {};
  for (const d of round.differences) mods[d.id] = true;
  return mods;
}

// Paint both panels from the game's state, then the markers on top.
export function paintPanels(game, leftCtx, rightCtx) {
  drawScene(leftCtx, game.round, modsFor('left', game.round));
  drawScene(rightCtx, game.round, modsFor('right', game.round));
  for (const d of game.round.differences) {
    if (game.found.has(d.id)) {
      ring(leftCtx, d.x, d.y, d.r, '#22c55e');
      ring(rightCtx, d.x, d.y, d.r, '#22c55e');
      tick(leftCtx, d.x, d.y);
      tick(rightCtx, d.x, d.y);
    }
  }
  if (game.hintSpot && Date.now() < game.hintSpot.until) {
    const pulse = 1 + 0.18 * Math.sin(Date.now() / 90);
    ring(leftCtx, game.hintSpot.x, game.hintSpot.y, 26 * pulse, '#facc15');
    ring(rightCtx, game.hintSpot.x, game.hintSpot.y, 26 * pulse, '#facc15');
  }
  if (game.missSpot && Date.now() < game.missSpot.until) {
    ring(leftCtx, game.missSpot.x, game.missSpot.y, 14, '#ef4444');
    ring(rightCtx, game.missSpot.x, game.missSpot.y, 14, '#ef4444');
  }
}

function ring(ctx, x, y, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r + 3, 0, Math.PI * 2);
  ctx.stroke();
}

function tick(ctx, x, y) {
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9, y);
  ctx.lineTo(x - 2, y + 8);
  ctx.lineTo(x + 10, y - 8);
  ctx.stroke();
}

function mmss(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Write the HUD numbers into the page.
export function paintHud(game, els) {
  els.roundName.textContent = `${game.roundIndex + 1} · ${game.round.name}`;
  els.found.textContent = `Found ${game.found.size} / ${game.totalDifferences}`;
  els.timer.textContent = mmss(game.timeLeft);
  els.timer.classList.toggle('low', game.timeLeft <= 30 && game.state === 'playing');
  els.score.textContent = `Score ${game.score}`;
  els.hints.textContent = `Hints ${game.hintsLeft}`;
  els.hintButton.disabled = game.state !== 'playing' || game.hintsLeft <= 0;
  els.muteButton.textContent = game.sounds.muted ? 'Sound off' : 'Sound on';
}

// Show exactly one overlay, or none while playing.
export function paintOverlay(game, els) {
  const show = (el) => {
    for (const o of [els.titleOverlay, els.clearOverlay, els.winOverlay, els.loseOverlay]) {
      o.classList.toggle('hidden', o !== el);
    }
  };
  if (game.state === 'title') {
    show(els.titleOverlay);
  } else if (game.state === 'roundClear') {
    els.clearScore.textContent =
      `Round clear! Time bonus +${game.timeBonus}. Score ${game.score}.`;
    els.clearNext.textContent =
      game.roundIndex + 1 < 3 ? 'Next round' : 'See results';
    show(els.clearOverlay);
  } else if (game.state === 'gameWon') {
    els.winScore.textContent = `You found every difference in all three rounds. Final score ${game.score}.`;
    show(els.winOverlay);
  } else if (game.state === 'timeUp') {
    els.loseScore.textContent =
      `Time ran out with ${game.totalDifferences - game.found.size} difference` +
      `${game.totalDifferences - game.found.size === 1 ? '' : 's'} still hidden. Score ${game.score}.`;
    show(els.loseOverlay);
  } else {
    show(null);
  }
}
