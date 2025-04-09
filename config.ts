// This file contains embedded credentials - for demo purposes only
// Not recommended for production use

export const DATABASE_URL = "postgresql://neondb_owner:npg_yE3BTOock2XW@ep-plain-sun-a4ryukwk.us-east-1.aws.neon.tech/neondb?sslmode=require";
export const SESSION_SECRET = "solo_grind_session_secret_2024_demo_app";
export const MISTRAL_API_KEY = "j4h3leTe769ILXBLzwsMkrKEzWqZjOTj";
export const CRON_SECRET = "solo_grind_cron_secret_2024_demo_app";
export const NODE_ENV = "development";
export const VERCEL = false;

// Export as a default object to simplify imports
export default {
  DATABASE_URL,
  SESSION_SECRET,
  MISTRAL_API_KEY,
  CRON_SECRET,
  NODE_ENV,
  VERCEL
};