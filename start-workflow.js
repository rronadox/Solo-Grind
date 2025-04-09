// This script is designed to be used with Replit workflows
import { spawn } from 'child_process';
import './init-env.js';

console.log('Starting Solo Grind application...');

// Start the server
const process = spawn('tsx', ['server/index.ts'], { 
  stdio: 'inherit',
  env: {
    ...process.env,
    // Force the app to listen on 0.0.0.0 to be accessible
    HOST: '0.0.0.0',
    PORT: '3002'
  }
});

process.on('error', (error) => {
  console.error(`Failed to start application: ${error.message}`);
});

// This keeps the process alive
process.stdin.resume();

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down application...');
  process.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down application...');
  process.kill('SIGTERM');
});