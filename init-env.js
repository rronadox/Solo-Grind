// Initialize environment variables from config.cjs
// This is required for files like drizzle.config.ts that can't import from config.ts directly
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

console.log("Initializing environment variables from config.cjs...");
try {
  // Load the configuration
  const config = require('./config.cjs');

  // Set environment variables for files that require process.env
  process.env.DATABASE_URL = config.DATABASE_URL;
  process.env.SESSION_SECRET = config.SESSION_SECRET;
  process.env.MISTRAL_API_KEY = config.MISTRAL_API_KEY;

  console.log("Environment variables initialized successfully:");
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? "✅ Set" : "❌ Not set"}`);
  console.log(`- SESSION_SECRET: ${process.env.SESSION_SECRET ? "✅ Set" : "❌ Not set"}`);
  console.log(`- MISTRAL_API_KEY: ${process.env.MISTRAL_API_KEY ? "✅ Set" : "❌ Not set"}`);
} catch (error) {
  console.error("Error initializing environment variables:", error);
}