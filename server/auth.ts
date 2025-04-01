import { Request, Response, NextFunction } from 'express';

// Simple user store - in a real app, this would be a database
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password', // In a real app, this would be hashed
    name: 'Admin User',
    role: 'admin'
  }
];

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// Authentication functions
export function login(email: string, password: string): AuthUser | null {
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return null;
  }
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as AuthUser;
}

export function getUserById(id: string): AuthUser | null {
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return null;
  }
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as AuthUser;
}

// Session typing
declare module 'express-session' {
  interface SessionData {
    user: AuthUser;
  }
} 