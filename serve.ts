// serve.ts — tiny static server for app/ only (Leonida Platinum, v3).
// Usage: node serve.ts [--port 8081]  — binds 127.0.0.1, serves app/ at root.
import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = resolve(join(fileURLToPath(new URL('.', import.meta.url)), 'app'));

const MIME: Record<string, string> = {
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

function portFromArgs(): number {
  const args = process.argv.slice(2);
  const at = args.indexOf('--port');
  if (at >= 0 && args[at + 1]) {
    const p = Number.parseInt(args[at + 1], 10);
    if (Number.isInteger(p) && p > 0 && p < 65536) return p;
  }
  return 8080;
}

const port = portFromArgs();

const server = createServer((req, res) => {
  const raw = req.url ?? '/';
  const pathOnly = raw.split(/[?#]/)[0] ?? '/';
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathOnly);
  } catch {
    res.writeHead(400, { 'cache-control': 'no-store' });
    res.end('bad request');
    return;
  }
  const rel = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  const target = resolve(join(APP_DIR, rel));
  if (target !== APP_DIR && !target.startsWith(APP_DIR + '/')) {
    res.writeHead(403, { 'cache-control': 'no-store' });
    res.end('forbidden');
    return;
  }
  let st;
  try {
    st = statSync(target);
  } catch {
    res.writeHead(404, { 'cache-control': 'no-store' });
    res.end('not found');
    return;
  }
  if (!st.isFile()) {
    res.writeHead(404, { 'cache-control': 'no-store' });
    res.end('not found');
    return;
  }
  const ext = extname(target).toLowerCase();
  const type = MIME[ext];
  if (!type) {
    res.writeHead(403, { 'cache-control': 'no-store' });
    res.end('forbidden');
    return;
  }
  const body = readFileSync(target);
  res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store', 'content-length': body.length });
  res.end(body);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Leonida Platinum serving app/ at http://127.0.0.1:${port}/`);
});
