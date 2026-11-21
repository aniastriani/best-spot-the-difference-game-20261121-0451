// All of the game's sounds, made with the Web Audio API and nothing else:
// no audio files are shipped, so the game still has sound with no network.

// A short beep: a sine note that fades out. The audio context is created
// lazily on the first user gesture, which is what browsers require.
export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  tone(freq, dur, vol, when = 0) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime + when;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // A happy two-note chime when a difference is found.
  found() {
    this.tone(660, 0.14, 0.18);
    this.tone(990, 0.22, 0.16, 0.09);
  }

  // A dull low buzz for a click that hits nothing.
  miss() {
    this.tone(140, 0.18, 0.12);
  }

  // A soft tick when a hint is spent.
  hint() {
    this.tone(520, 0.1, 0.1);
    this.tone(780, 0.12, 0.08, 0.07);
  }

  // A little rising run when a round is cleared.
  win() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.2, 0.16, i * 0.11));
  }

  // A falling note when the clock runs out.
  lose() {
    [392, 330, 262].forEach((f, i) => this.tone(f, 0.25, 0.14, i * 0.13));
  }
}
