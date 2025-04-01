import express, { Request, Response } from 'express';
import cors from 'cors';
import { login } from '../server/auth';

// Create Express application
const app = express();

// Add middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

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

// Auth routes
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = login(email, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

app.get('/api/auth/me', (req, res) => {
  // For demo purposes, return a mock user
  res.json({ user: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' } });
});

// API routes
app.get('/api/stats', (req, res) => {
  res.json(mockData.stats);
});

app.get('/api/vehicles', (req, res) => {
  res.json(mockData.vehicles);
});

app.get('/api/vehicles/:id', (req, res) => {
  const vehicle = mockData.vehicles.find(v => v.id === req.params.id);
  
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  res.json(vehicle);
});

app.get('/api/alerts', (req, res) => {
  res.json(mockData.alerts);
});

// Catch-all for WebSocket connections
app.all('/api/ws', (req, res) => {
  // This will be upgraded to WebSocket if supported by the client
  res.status(200).send('WebSocket endpoint');
});

// Default error handler
app.use((err: any, req: Request, res: Response) => {
  console.error('API error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app; 