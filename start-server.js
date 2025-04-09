import { spawn } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Starting server...');

const server = spawn('node', ['--import', 'tsx', 'server/index.ts'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    PORT: '3000'
  }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

process.on('SIGINT', () => {
  console.log('Stopping server...');
  server.kill('SIGINT');
  process.exit();
});