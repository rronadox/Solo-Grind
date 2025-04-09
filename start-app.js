// This script is designed to run the application with proper error handling
import { spawn } from 'child_process';
import { createServer } from 'http';
import './init-env.js';

// Check if the port is already in use
function isPortInUse(port) {
  return new Promise((resolve, reject) => {
    const server = createServer()
      .once('error', err => {
        if (err.code === 'EADDRINUSE') {
          resolve(true);
        } else {
          reject(err);
        }
      })
      .once('listening', () => {
        server.close();
        resolve(false);
      })
      .listen(port, '0.0.0.0');
  });
}

async function startApplication() {
  console.log('Starting application...');
  
  try {
    // Check if port 8080 is in use
    const portInUse = await isPortInUse(8080);
    
    if (portInUse) {
      console.log('Port 8080 is already in use. Please restart the Replit or manually kill the process.');
      return;
    }
    
    // Start the application
    const process = spawn('tsx', ['server/index.ts'], { stdio: 'inherit' });
    
    process.on('error', (error) => {
      console.error(`Failed to start process: ${error.message}`);
    });
    
    process.on('close', (code) => {
      console.log(`Process exited with code ${code}`);
    });
    
    // Handle app termination
    process.on('SIGINT', () => {
      console.log('Stopping application...');
      process.kill('SIGINT');
      process.exit();
    });
    
  } catch (error) {
    console.error(`Error starting application: ${error.message}`);
  }
}

startApplication();