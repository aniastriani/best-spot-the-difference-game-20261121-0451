# Lantern Market at Dusk

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/aniastriani/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/aniastriani/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A spot-the-difference game set in a night market at dusk. Two pictures of
the market hang side by side — but they are not quite the same. Find every
difference before the clock runs out: 7 in the Dusk Market, 8 in the Rainy
Night, 9 in the Festival Finale, with less time on each round.

Click a difference on either picture to ring it in green. A wrong click
costs 25 points; a hint (H) reveals one difference for 50 points. Clearing
a round pays a time bonus of 5 points per second left. Every scene is drawn
in code with the Canvas 2D API — no image files, no network, no libraries —
and each round is seeded, so the two panels always agree except for the
differences themselves. Sounds are synthesized with the Web Audio API.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080/ in a desktop browser and play. Keyboard:
H for a hint, R to restart, Enter to start.

Screenshot poses for the entry's own screenshots live behind a query
string: `?shot=start`, `?shot=play`, `?shot=hint` and `?shot=win`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` into the output directory and
writes `dossier.json` there with the kit's dossier builder.

---

<sub>Entered on [make.fun](https://make.fun/?ref=nr75efcw&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
