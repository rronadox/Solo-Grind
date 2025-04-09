// Run this file to test if environment variables are set properly
console.log("Testing environment variables setup...");

// First, run the compiler for config.ts
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compile config.ts to JS
exec('npx tsc config.ts --module commonjs', async (error, stdout, stderr) => {
  if (error) {
    console.error(`Error compiling config.ts: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Compiler stderr: ${stderr}`);
  }
  
  console.log(`Successfully compiled config.ts to config.js`);
  
  // Now import the config values and set env vars
  try {
    // Dynamic import of the compiled config.js
    const config = await import('./config.js');
    
    // Set environment variables
    process.env.DATABASE_URL = config.DATABASE_URL;
    process.env.SESSION_SECRET = config.SESSION_SECRET;
    process.env.MISTRAL_API_KEY = config.MISTRAL_API_KEY;
    
    // Log the environment variables
    console.log("Environment variables set:");
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? "✅ Set" : "❌ Not set"}`);
    console.log(`SESSION_SECRET: ${process.env.SESSION_SECRET ? "✅ Set" : "❌ Not set"}`);
    console.log(`MISTRAL_API_KEY: ${process.env.MISTRAL_API_KEY ? "✅ Set" : "❌ Not set"}`);
    
    // Test if drizzle config can see the variables
    console.log("\nTesting drizzle.config.ts access to DATABASE_URL:");
    if (process.env.DATABASE_URL) {
      console.log("✅ DATABASE_URL is available for drizzle.config.ts");
    } else {
      console.log("❌ DATABASE_URL is NOT available for drizzle.config.ts");
    }
  } catch (err) {
    console.error("Error importing config.js:", err);
  }
});