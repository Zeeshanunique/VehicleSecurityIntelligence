// User types
export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  role: 'law_enforcement' | 'admin' | 'analyst';
  email: string;
}

export type InsertUser = Omit<User, 'id'>;

// Vehicle types
export interface Vehicle {
  id: number;
  licensePlate: string;
  isStolen: boolean;
  owner: string;
  vehicleType: string;
  color: string;
  lastSeen: Date;
  location: string;
}

export type InsertVehicle = Omit<Vehicle, 'id'>;

// Watchlist types
export interface Watchlist {
  id: number;
  name: string;
  status: string;
  confidence: number;
  lastSeen: Date;
  location: string;
}

export type InsertWatchlist = Omit<Watchlist, 'id'>;

// Alert types
export interface Alert {
  id: number;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'dismissed';
  details: Record<string, any>;
}

export type InsertAlert = Omit<Alert, 'id'>;

// Camera types
export interface Camera {
  id: number;
  name: string;
  location: string;
  latitude: string;
  longitude: string;
  type: string;
  active: boolean;
  features: {
    lpr: boolean;
    facial: boolean;
    accident: boolean;
  };
}

export type InsertCamera = Omit<Camera, 'id'>;

// Activity types
export interface Activity {
  id: number;
  activityType: string;
  description: string;
  userId: number;
  timestamp: Date;
  details: Record<string, any>;
}

export type InsertActivity = Omit<Activity, 'id'>;

// Notification types
export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
  relatedId?: number;
  relatedType?: string;
}

export type InsertNotification = Omit<Notification, 'id'>; 