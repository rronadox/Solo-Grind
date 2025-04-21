import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import config from "../config";

// Using imported config instead of dotenv

// Simple logging function
function serverLog(message: string, level: string = "info") {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  // Log to console
  console.log(logMessage);
  
  // Also call the original log function for compatibility with the source parameter
  log(message, level === "info" ? "server" : level);
}

// Create Express application
const app = express();

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from project root (for sound files)
app.use(express.static(process.cwd()));

// Simple request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      serverLog(`${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`, "api");
    }
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main startup function
async function startServer() {
  try {
    serverLog("Starting server initialization...", "info");
    
    // Register API routes and get HTTP server
    serverLog("Registering API routes...", "info");
    const server = await registerRoutes(app);
    
    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      serverLog(`Error: ${message}`, "error");
      res.status(status).json({ message });
    });
    
    // Setup frontend serving (Vite in dev, static in prod)
    if (config.NODE_ENV !== "production") {
      serverLog("Setting up Vite for development mode...", "info");
      await setupVite(app, server);
    } else {
      serverLog("Setting up static file serving for production mode...", "info");
      serveStatic(app);
    }
    
    if (config.VERCEL) {
      // Export for Vercel serverless function
      serverLog("Running in Vercel serverless mode", "info");
      // For Vercel, we need to export the Express app
      module.exports = app;
      // Also export the server handler for WebSocket support
      module.exports.server = server;
    } else {
      // Start local server
      const port = Number(process.env.PORT || 5000);
      server.listen(port, "0.0.0.0", () => {
        console.clear(); // Clear console for cleaner output
        serverLog(`Server running on port ${port} in ${config.NODE_ENV} mode`, "info");
        serverLog("Server startup complete!", "info");
      });
    }
    
    return server;
  } catch (error) {
    serverLog(`Failed to start server: ${error}`, "error");
    process.exit(1);
  }
}

// Start the server
serverLog("Starting server...", "info");
startServer();
