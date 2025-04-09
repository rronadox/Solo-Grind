import { exec } from 'child_process';

// Compile config.ts to config.js
exec('npx tsc config.ts --module commonjs', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error compiling config.ts: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Successfully compiled config.ts to config.js`);
});