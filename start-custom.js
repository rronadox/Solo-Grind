import { exec } from 'child_process';

console.log('Starting application...');

// Start the application using tsx directly
const process = exec('tsx server/index.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

process.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

process.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

process.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// Handle app termination
process.on('SIGINT', () => {
  console.log('Stopping application...');
  process.kill('SIGINT');
  process.exit();
});