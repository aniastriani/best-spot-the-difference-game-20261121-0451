// Lantern Market at Dusk — the hand-in program.
//
// When the grader runs this file it stages the entry for the judge: the
// game folder and the screenshots are copied into the output directory,
// and dossier.json is written there from the same files, using the kit's
// dossier builder. It runs on Node 22 with the standard library only.
//
// Usage outside the grader:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildDossier } from './vendor/makefun-game.ts';

// The judge's output directory: /output in the grader, or the directory
// MAKEFUN_OUTPUT_DIR names when it is set.
function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv !== undefined && fromEnv !== '' ? fromEnv : '/output';
}

// Copy every file of one folder into another, making folders as needed.
function copyTree(from: string, to: string): number {
  mkdirSync(to, { recursive: true });
  let copied = 0;
  for (const name of readdirSync(from).sort()) {
    const src = join(from, name);
    const dst = join(to, name);
    if (statSync(src).isDirectory()) {
      copied += copyTree(src, dst);
    } else {
      copyFileSync(src, dst);
      copied += 1;
    }
  }
  return copied;
}

function main(): void {
  const here = new URL('.', import.meta.url).pathname;
  const dest = outputDir();

  const gameFiles = copyTree(join(here, 'game'), join(dest, 'game'));
  let shotFiles = 0;
  const shots = join(here, 'screenshots');
  if (existsSync(shots)) {
    shotFiles = copyTree(shots, join(dest, 'screenshots'));
  }

  // The scorer's own limits for this bounty: the dossier text is capped
  // at 160 KiB, and at most four screenshots of 256 KiB each ride along.
  const dossier = buildDossier(dest, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
  });
  writeFileSync(join(dest, 'dossier.json'), dossier);

  console.log(`Lantern Market at Dusk staged in ${dest}`);
  console.log(`  game files copied: ${gameFiles}`);
  console.log(`  screenshots copied: ${shotFiles}`);
  console.log(`  dossier.json bytes: ${dossier.length}`);
}

main();
