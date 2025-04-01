import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { login, requireAuth } from './auth';

// Mock data for the application
const mockData = {
  users: [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' }
  ],
  vehicles: [
    { id: '1', make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC123', isStolen: false },
    { id: '2', make: 'Honda', model: 'Civic', year: 2019, licensePlate: 'XYZ789', isStolen: true },
    { id: '3', make: 'Ford', model: 'F-150', year: 2021, licensePlate: 'DEF456', isStolen: false }
  ],
  alerts: [
    { id: '1', type: 'Stolen Vehicle', severity: 'High', title: 'Stolen Honda Civic', description: 'Vehicle reported stolen on 4/1/2023', status: 'active' },
    { id: '2', type: 'Traffic Violation', severity: 'Medium', title: 'Speeding', description: 'Vehicle recorded at 55 mph in 35 mph zone', status: 'resolved' }
  ],
  stats: [
    { name: 'Total Vehicles', value: 3 },
    { name: 'Active Alerts', value: 1 },
    { name: 'Stolen Vehicles', value: 1 },
    { name: 'Cameras Online', value: 12 }
  ]
};

export default function registerRoutes(app: express.Express) {
  // CORS configuration
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
  }));

  // Parse JSON request bodies
  app.use(express.json());
  
  // Session setup
  app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = login(email, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Set user in session
    req.session.user = user;
    
    res.json({ user });
  });
  
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  app.get('/api/auth/me', (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({ user: req.session.user });
  });

  // API routes
  const api = express.Router();

  // Stats
  api.get('/stats', requireAuth, (req, res) => {
    res.json(mockData.stats);
  });

  // Vehicles
  api.get('/vehicles', requireAuth, (req, res) => {
    res.json(mockData.vehicles);
  });

  api.get('/vehicles/:id', requireAuth, (req, res) => {
    const vehicle = mockData.vehicles.find(v => v.id === req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.json(vehicle);
  });

  // Alerts
  api.get('/alerts', requireAuth, (req, res) => {
    res.json(mockData.alerts);
  });

  // Mount API routes
  app.use('/api', api);

  // Development proxy for Vite
  if (process.env.NODE_ENV === 'development') {
    app.use('/', createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
      ws: true,
    }));
  }
}
