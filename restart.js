// This script will restart the application by killing any existing processes on port 3002
import { execSync } from 'child_process';
import { spawn } from 'child_process';

console.log('Restarting the application...');

try {
  // Find and kill any processes using port 3002
  console.log('Checking for processes on port 3002...');
  try {
    const output = execSync('lsof -i :3002 -t').toString().trim();
    if (output) {
      console.log(`Found processes: ${output}`);
      execSync(`kill -9 ${output}`);
      console.log('Killed existing processes on port 3002');
    } else {
      console.log('No processes found on port 3002');
    }
  } catch (error) {
    console.log('No processes found on port 3002');
  }
  
  // Wait a moment for the port to be released
  setTimeout(() => {
    console.log('Starting application...');
    const process = spawn('node', ['start-app.js'], { stdio: 'inherit' });
    
    process.on('error', (error) => {
      console.error(`Failed to start process: ${error.message}`);
    });
    
    process.on('close', (code) => {
      console.log(`Process exited with code ${code}`);
    });
  }, 1000);
} catch (error) {
  console.error(`Error restarting application: ${error.message}`);
}