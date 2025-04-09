// This script ensures proper environment variable handling for Vercel deployment
// It should be run before your build command

import dotenv from 'dotenv';
import { writeFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Get the current script's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file if it exists (for local development)
dotenv.config();

// Variables we need to ensure are available
const requiredVars = ['DATABASE_URL', 'SESSION_SECRET', 'MISTRAL_API_KEY'];

// Function to check if we're running in Vercel
const isVercel = () => {
  return process.env.VERCEL === '1' || process.env.VERCEL === 'true';
};

// Function to write a temporary config.js file if needed for production
const generateConfigFile = () => {
  console.log('Setting up environment for production deployment');
  
  // Prepare config content
  let configFileContent = `// Auto-generated config file for production
// This file will be overwritten on deploy

export const DATABASE_URL = "${process.env.DATABASE_URL || ''}";
export const SESSION_SECRET = "${process.env.SESSION_SECRET || ''}";
export const MISTRAL_API_KEY = "${process.env.MISTRAL_API_KEY || ''}";

// Export as a default object to simplify imports
export default {
  DATABASE_URL,
  SESSION_SECRET,
  MISTRAL_API_KEY
};
`;

  // Write to config.ts
  const configPath = resolve(__dirname, 'config.ts');
  writeFileSync(configPath, configFileContent);
  console.log(`Config file written to ${configPath}`);
};

// Check for required environment variables
let missingVars = [];
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
}

// Warn about missing variables
if (missingVars.length > 0) {
  console.warn(`⚠️ Warning: Missing required environment variables: ${missingVars.join(', ')}`);
  console.warn('Make sure to set these variables in your Vercel project settings!');
}

// If we're in Vercel, generate the config file
if (isVercel()) {
  generateConfigFile();
} else {
  console.log('Running in development mode - using .env file');
}

console.log('Environment setup complete');