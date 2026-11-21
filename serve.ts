// Leonida Platinum v6 — tiny static server for app/ only (Node 22, stdlib only).
// Usage: node serve.ts            -> http://localhost:8080
//        node serve.ts --port 8081 -> that port. Binds 127.0.0.1 only.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = resolve(join(fileURLToPath(new URL('.', import.meta.url)), 'app'));
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function portFromArgs(argv) {
  const i = argv.indexOf('--port');
  if (i >= 0 && argv[i + 1]) {
    const p = Number(argv[i + 1]);
    if (Number.isInteger(p) && p > 0 && p < 65536) return p;
  }
  return 8080;
}

const port = portFromArgs(process.argv.slice(2));

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/index.html';
    const target = resolve(join(APP_ROOT, normalize(rel).replace(/^(\.\.[/\\])+/, '')));
    if (target !== APP_ROOT && !target.startsWith(APP_ROOT + sep)) {
      res.writeHead(403, { 'content-type': 'text/plain' });
      res.end('403 forbidden\n');
      return;
    }
    const body = await readFile(target);
    res.writeHead(200, {
      'content-type': MIME[extname(target).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('404 not found\n');
    } else {
      res.writeHead(500, { 'content-type': 'text/plain' });
      res.end('500 error\n');
    }
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Leonida Platinum v6 serving app/ at http://localhost:${port}`);
});
