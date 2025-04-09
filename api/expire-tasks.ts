// API endpoint to check for expired tasks and mark them as failed
// Can be called by a cron job service like cron-job.org

import { Request, Response } from 'express';
import { storage } from '../server/storage';

export default async function handler(req: Request, res: Response) {
  try {
    // Only allow GET requests (for simplicity and security)
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Check for a secret token to secure this endpoint
    const { token } = req.query;
    if (!token || token !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get all expired tasks
    const expiredTasks = await storage.getExpiredTasks();
    
    // Update each task to failed status
    const updatePromises = expiredTasks.map(task => 
      storage.updateTask(task.id, { 
        status: 'failed',
        completedAt: new Date() 
      })
    );
    
    const updatedTasks = await Promise.all(updatePromises);
    
    return res.status(200).json({
      success: true,
      expiredCount: expiredTasks.length,
      updatedTasks: updatedTasks.map(task => ({
        id: task.id,
        title: task.title,
        userId: task.userId
      }))
    });
  } catch (error) {
    console.error('Error in expire-tasks endpoint:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
}