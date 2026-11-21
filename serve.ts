// A tiny static file server for play-testing the game in a browser.
//
//   node serve.ts
//
// serves game/ at http://localhost:8080/ — open index.html there and play.
// Standard library only; it serves files under game/ and nothing else.

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';

const PORT = 8080;
const ROOT = new URL('./game/', import.meta.url).pathname;

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const server = createServer((req, res) => {
  const raw = decodeURIComponent(req.url?.split('?')[0] ?? '/');
  const path = raw === '/' ? '/index.html' : raw;
  const file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found\n');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});

server.listen(PORT, () => {
  console.log(`Lantern Market at Dusk on http://localhost:${PORT}/`);
});
