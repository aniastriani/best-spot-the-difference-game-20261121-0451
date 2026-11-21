// Screenshot presets: open the game with ?shot=start, ?shot=play,
// ?shot=hint or ?shot=win and it poses itself for that picture, so the
// screenshots in screenshots/ are real renders of the game's own code.
//
// The presets only ever run when the page is opened with ?shot=, and they
// touch nothing a player can reach by playing.

export function applyShot(game, name) {
  if (name === 'start') {
    game.state = 'title';
    game.roundIndex = 0;
    game.found = new Set();
    game.timeLeft = game.round.seconds;
    game.hintsLeft = game.round.hints;
    game.emit();
    return true;
  }
  if (name === 'play') {
    game.startGame();
    // Three finds already ringed, four still hidden, clock mid-round.
    const ids = game.round.differences.slice(0, 3).map((d) => d.id);
    game.found = new Set(ids);
    game.timeLeft = 151;
    game.score = 300;
    game.emit();
    return true;
  }
  if (name === 'hint') {
    game.startGame();
    const ids = game.round.differences.slice(0, 4).map((d) => d.id);
    game.found = new Set(ids);
    game.timeLeft = 96;
    game.score = 400;
    const next = game.round.differences[4];
    game.hintSpot = { x: next.x, y: next.y, until: Date.now() + 60000 };
    game.emit();
    return true;
  }
  if (name === 'win') {
    game.startGame();
    game.found = new Set(game.round.differences.map((d) => d.id));
    game.timeLeft = 74;
    game.timeBonus = 74 * 5;
    game.score = 700 + game.timeBonus;
    game.state = 'roundClear';
    game.stopTimer();
    game.emit();
    return true;
  }
  return false;
}
