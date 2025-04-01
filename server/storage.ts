import type { User, InsertUser, Vehicle, InsertVehicle, Watchlist, InsertWatchlist, Alert, InsertAlert, Camera, InsertCamera, Activity, InsertActivity, Notification } from "@shared/schema";
import { FirebaseStorage } from './firebase-storage';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Vehicle methods
  getAllVehicles(): Promise<Vehicle[]>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehicleByLicensePlate(licensePlate: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: Partial<InsertVehicle>): Promise<Vehicle>;
  updateVehicle(id: number, data: Partial<Vehicle>): Promise<Vehicle>;
  
  // Watchlist methods
  getAllWatchlist(): Promise<Watchlist[]>;
  getWatchlistEntry(id: number): Promise<Watchlist | undefined>;
  createWatchlistEntry(entry: Partial<InsertWatchlist>): Promise<Watchlist>;
  
  // Alert methods
  getAllAlerts(): Promise<Alert[]>;
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: Partial<InsertAlert>): Promise<Alert>;
  updateAlert(id: number, data: Partial<Alert>): Promise<Alert>;
  
  // Camera methods
  getAllCameras(): Promise<Camera[]>;
  getCamera(id: number): Promise<Camera | undefined>;
  createCamera(camera: Partial<InsertCamera>): Promise<Camera>;
  
  // Activity methods
  getAllActivities(): Promise<Activity[]>;
  createActivity(activity: Partial<InsertActivity>): Promise<Activity>;
  
  // Notification methods
  getNotificationsForUser(userId: number): Promise<any[]>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  dismissNotification(id: number): Promise<void>;
  
  // Stats methods
  getStats(): Promise<any[]>;
}

// Export Firebase storage as the default storage
const storage = new FirebaseStorage();
export default storage;
