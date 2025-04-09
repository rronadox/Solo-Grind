// Simplified API handler for WebSocket fallback
import { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  // Inform client that WebSockets are not supported in serverless mode
  res.status(200).json({
    message: 'WebSocket connections are not supported in serverless mode. Please use the REST API instead.',
    success: false,
    timestamp: new Date().toISOString()
  });
}