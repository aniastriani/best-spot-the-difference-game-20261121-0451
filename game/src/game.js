// The game's state: which round is up, what is found, how much time is
// left, and what the player has scored. The painter owns the pictures;
// this owns the rules.

import { ROUNDS } from './config.js';
import { hitTest } from './input.js';

export const POINTS_FOUND = 100;
export const POINTS_MISS = 25;
export const POINTS_HINT = 50;
export const TIME_BONUS_PER_SECOND = 5;

export class Game {
  constructor(sounds) {
    this.sounds = sounds;
    this.roundIndex = 0;
    this.state = 'title'; // title | playing | roundClear | gameWon | timeUp
    this.found = new Set();
    this.hintsLeft = 0;
    this.score = 0;
    this.misses = 0;
    this.timeLeft = 0;
    this.timeBonus = 0;
    this.hintSpot = null; // {x, y, until} while a hint ring pulses
    this.missSpot = null; // {x, y, until} while a miss ripple shows
    this.onChange = null; // called after every state change, to repaint
    this.timerId = null;
  }

  get round() {
    return ROUNDS[this.roundIndex];
  }

  get totalDifferences() {
    return this.round.differences.length;
  }

  get allFound() {
    return this.found.size >= this.totalDifferences;
  }

  startGame() {
    this.roundIndex = 0;
    this.score = 0;
    this.misses = 0;
    this.beginRound();
  }

  beginRound() {
    this.found = new Set();
    this.hintsLeft = this.round.hints;
    this.timeLeft = this.round.seconds;
    this.timeBonus = 0;
    this.hintSpot = null;
    this.missSpot = null;
    this.state = 'playing';
    this.startTimer();
    this.emit();
  }

  startTimer() {
    this.stopTimer();
    this.timerId = window.setInterval(() => {
      if (this.state !== 'playing') return;
      this.timeLeft -= 1;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.stopTimer();
        this.state = 'timeUp';
        this.sounds.lose();
      }
      this.emit();
    }, 1000);
  }

  stopTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // A click at panel coordinates: find a difference or count a miss.
  pick(x, y) {
    if (this.state !== 'playing') return;
    const hit = hitTest(this.round.differences, this.found, x, y);
    if (hit) {
      this.found.add(hit.id);
      this.score += POINTS_FOUND;
      this.sounds.found();
      if (this.allFound) this.clearRound();
    } else {
      this.misses += 1;
      this.score = Math.max(0, this.score - POINTS_MISS);
      this.missSpot = { x, y, until: Date.now() + 450 };
      this.sounds.miss();
    }
    this.emit();
  }

  clearRound() {
    this.stopTimer();
    this.timeBonus = this.timeLeft * TIME_BONUS_PER_SECOND;
    this.score += this.timeBonus;
    this.sounds.win();
    this.state = this.roundIndex + 1 >= ROUNDS.length ? 'gameWon' : 'roundClear';
    this.emit();
  }

  nextRound() {
    this.roundIndex += 1;
    this.beginRound();
  }

  useHint() {
    if (this.state !== 'playing' || this.hintsLeft <= 0) return;
    const remaining = this.round.differences.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    const spot = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - POINTS_HINT);
    this.hintSpot = { x: spot.x, y: spot.y, until: Date.now() + 2200 };
    this.sounds.hint();
    this.emit();
  }

  toggleMute() {
    this.sounds.muted = !this.sounds.muted;
    this.emit();
    return this.sounds.muted;
  }

  emit() {
    if (this.onChange) this.onChange(this);
  }
}
