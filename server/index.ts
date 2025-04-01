import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import registerRoutes from './routes';
import { setupVite, log } from "./vite";

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Body parsers - make sure these are before any routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  // Log all API requests for debugging
  if (path.startsWith("/api")) {
    console.log(`${req.method} ${path} - Request Body: ${JSON.stringify(req.body)}`);
  }
  
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      if (capturedJsonResponse) {
        // Truncate to avoid large logs
        const responseStr = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${responseStr.length > 100 ? responseStr.slice(0, 100) + '...' : responseStr}`;
      }

      console.log(logLine);
    }
  });

  next();
});

// Register routes and API handlers
registerRoutes(app);

// Create HTTP server
const server = http.createServer(app);

// Setup Vite with both app and server
setupVite(app, server);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static client files
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle SPA routing - send all requests to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
