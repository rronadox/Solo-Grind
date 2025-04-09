// Test database connectivity
import './init-env.js';
import * as pg from '@neondatabase/serverless';
import ws from 'ws';

// Initialize the configuration for Neon Serverless
pg.neonConfig.webSocketConstructor = ws;

async function testDatabaseConnection() {
  // Use our DATABASE_URL from config.cjs (set via init-env.js)
  const connectionString = process.env.DATABASE_URL;
  console.log(`Testing database connection with URL: ${connectionString ? "URL is set" : "URL is missing"}`);
  
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Please set it before running this test.");
    return;
  }
  
  // Create a new connection pool
  const pool = new pg.Pool({ connectionString });
  
  try {
    // Try a simple query
    const result = await pool.query('SELECT current_timestamp as time, current_database() as database');
    console.log("Database Connection Successful!");
    console.log("Current time from database:", result.rows[0].time);
    console.log("Current database:", result.rows[0].database);
    
    // Check if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log("\nDatabase Tables:");
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

testDatabaseConnection();