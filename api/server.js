
import serverless from 'serverless-http';
import express from 'express';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import * as schema from '../shared/schema.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());

// Database setup
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});
const db = drizzle(pool, { schema });

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'solo_grind_session_secret_2024',
  resave: false,
  saveUninitialized: false,
  proxy: true, // Required for Vercel
  cookie: {
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(
  { usernameField: 'username' },
  async (username, password, done) => {
    try {
      // Find user by username
      const users = await db.select().from(schema.users).where(eq(schema.users.username, username));
      const user = users[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id));
    const user = users[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// User auth routes
app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

app.post('/api/auth/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true });
  });
});

app.get('/api/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Tasks routes
app.get('/api/tasks', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const tasks = await db.select().from(schema.tasks).where(eq(schema.tasks.userId, req.user.id));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get individual task with punishment options
app.get('/api/tasks/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Get task details
    const tasks = await db.select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, parseInt(req.params.id)))
      .where(eq(schema.tasks.userId, req.user.id));
    
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const task = tasks[0];
    
    // Get punishment options
    const punishmentOptions = await db.select()
      .from(schema.punishmentOptions)
      .where(eq(schema.punishmentOptions.taskId, task.id));
    
    // Return combined task with punishment options
    res.json({
      ...task,
      punishmentOptions: punishmentOptions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Polling endpoint for notifications - replaces WebSocket in serverless environments
app.get('/api/notifications', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Check for expired tasks that haven't been processed yet
    const failedTasks = await db.select()
      .from(schema.tasks)
      .where(eq(schema.tasks.userId, req.user.id))
      .where(eq(schema.tasks.status, 'failed'))
      .orderBy(schema.tasks.updatedAt);
    
    // Calculate the events to send to the client
    const events = [];
    
    // Add failed task events
    failedTasks.forEach(task => {
      // Check if the task was updated in the last polling interval (15 seconds)
      const taskUpdatedAt = new Date(task.updatedAt).getTime();
      const fifteenSecondsAgo = Date.now() - 15000;
      
      if (taskUpdatedAt > fifteenSecondsAgo) {
        events.push({
          type: 'TASK_FAILED',
          data: { task }
        });
      }
    });
    
    // Return events
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Export the serverless handler
export default serverless(app);
