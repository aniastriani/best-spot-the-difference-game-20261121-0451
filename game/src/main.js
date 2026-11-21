// Bootstraps Lantern Market at Dusk: finds the page's pieces, wires the
// buttons and keys, and repaints the panels whenever the game changes.

import { PANEL_W, PANEL_H } from './config.js';
import { SoundBank } from './audio.js';
import { Game } from './game.js';
import { attachPanelClicks } from './input.js';
import { paintPanels, paintHud, paintOverlay } from './render.js';
import { applyShot } from './shots.js';

function el(id) {
  const found = document.getElementById(id);
  if (!found) throw new Error(`missing element #${id}`);
  return found;
}

function main() {
  const left = el('panel-left');
  const right = el('panel-right');
  left.width = PANEL_W;
  left.height = PANEL_H;
  right.width = PANEL_W;
  right.height = PANEL_H;
  const leftCtx = left.getContext('2d');
  const rightCtx = right.getContext('2d');

  const els = {
    roundName: el('round-name'),
    found: el('found-count'),
    timer: el('timer'),
    score: el('score'),
    hints: el('hints-left'),
    hintButton: el('hint-button'),
    restartButton: el('restart-button'),
    muteButton: el('mute-button'),
    startButton: el('start-button'),
    nextButton: el('next-button'),
    againButton: el('again-button'),
    retryButton: el('retry-button'),
    titleOverlay: el('overlay-title'),
    clearOverlay: el('overlay-clear'),
    winOverlay: el('overlay-win'),
    loseOverlay: el('overlay-lose'),
    clearScore: el('clear-score'),
    clearNext: el('clear-next'),
    winScore: el('win-score'),
    loseScore: el('lose-score'),
  };

  const game = new Game(new SoundBank());
  game.onChange = () => {
    paintPanels(game, leftCtx, rightCtx);
    paintHud(game, els);
    paintOverlay(game, els);
  };

  attachPanelClicks(left, right, (x, y) => game.pick(x, y));
  els.startButton.addEventListener('click', () => game.startGame());
  els.nextButton.addEventListener('click', () => game.nextRound());
  els.againButton.addEventListener('click', () => game.startGame());
  els.retryButton.addEventListener('click', () => game.startGame());
  els.restartButton.addEventListener('click', () => game.startGame());
  els.hintButton.addEventListener('click', () => game.useHint());
  els.muteButton.addEventListener('click', () => game.toggleMute());
  window.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') game.useHint();
    if (event.key === 'r' || event.key === 'R') game.startGame();
    if (event.key === 'Enter' && game.state === 'title') game.startGame();
  });

  // Keep the hint pulse and miss ripple moving while they are visible.
  window.setInterval(() => {
    if (game.hintSpot || game.missSpot) paintPanels(game, leftCtx, rightCtx);
  }, 120);

  // A screenshot pose, when the page was opened with ?shot=.
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (shot) {
    applyShot(game, shot);
  } else {
    game.state = 'title';
    game.timeLeft = game.round.seconds;
    game.hintsLeft = game.round.hints;
    game.emit();
  }
}

document.addEventListener('DOMContentLoaded', main);
