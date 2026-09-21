import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('[Dev Runner] Starting SEO Admin Server and Next.js dev server...');

// Start SEO Admin Server
const seoServer = spawn('node', [path.join(rootDir, 'scripts', 'seo-server.mjs')], {
  stdio: 'inherit',
  shell: true,
});

// Start Next.js dev server
const nextDev = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

function cleanup() {
  try {
    seoServer.kill();
  } catch {}
  try {
    nextDev.kill();
  } catch {}
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
