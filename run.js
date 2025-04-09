import { spawn } from 'child_process';
import './init-env.js';

console.log("Starting server with npm run dev...");

// Start npm run dev process
const proc = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3002'
  }
});

// Handle errors
proc.on('error', (err) => {
  console.error('Failed to start server:', err);
});

// Handle close
proc.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Process cleanup
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  proc.kill('SIGINT');
  setTimeout(() => process.exit(0), 100);
});