import { collections, adminDb } from './firebase';
import type { IStorage } from './storage';
import type { 
  User, InsertUser, Vehicle, InsertVehicle, 
  Watchlist, InsertWatchlist, Alert, InsertAlert, 
  Camera, InsertCamera, Activity, InsertActivity, 
  Notification, InsertNotification 
} from "@shared/schema";
import { generateRandomStats } from './utils';

export class FirebaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const doc = await collections.users.doc(id).get();
    return doc.exists ? { id, ...doc.data() as User } : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const snapshot = await collections.users
      .where('username', '==', username)
      .limit(1)
      .get();
    
    if (snapshot.empty) return undefined;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() as User };
  }

  async createUser(user: InsertUser): Promise<User> {
    const docRef = await collections.users.add(user);
    const newUser = { id: docRef.id, ...user };
    return newUser;
  }

  async getUsers(): Promise<User[]> {
    const snapshot = await collections.users.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as User
    }));
  }
  
  // Vehicle methods
  async getVehicles(): Promise<Vehicle[]> {
    const snapshot = await collections.vehicles.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Vehicle
    }));
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const doc = await collections.vehicles.doc(id).get();
    return doc.exists ? { id, ...doc.data() as Vehicle } : undefined;
  }

  async getVehicleByLicensePlate(licensePlate: string): Promise<Vehicle | undefined> {
    const snapshot = await collections.vehicles
      .where('licensePlate', '==', licensePlate)
      .limit(1)
      .get();
    
    if (snapshot.empty) return undefined;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() as Vehicle };
  }

  async createVehicle(vehicle: Partial<InsertVehicle>): Promise<Vehicle> {
    const docRef = await collections.vehicles.add(vehicle);
    const newVehicle = { id: docRef.id, ...vehicle } as Vehicle;
    return newVehicle;
  }

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    await collections.vehicles.doc(id).update(data);
    const updatedDoc = await collections.vehicles.doc(id).get();
    return { id, ...updatedDoc.data() as Vehicle };
  }
  
  // Watchlist methods
  async getWatchlist(): Promise<Watchlist[]> {
    const snapshot = await collections.watchlist.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Watchlist
    }));
  }

  async getWatchlistEntry(id: string): Promise<Watchlist | undefined> {
    const doc = await collections.watchlist.doc(id).get();
    return doc.exists ? { id, ...doc.data() as Watchlist } : undefined;
  }

  async createWatchlistEntry(entry: Partial<InsertWatchlist>): Promise<Watchlist> {
    const docRef = await collections.watchlist.add(entry);
    const newEntry = { id: docRef.id, ...entry } as Watchlist;
    return newEntry;
  }
  
  // Alert methods
  async getAlerts(): Promise<Alert[]> {
    const snapshot = await collections.alerts
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Alert
    }));
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    const doc = await collections.alerts.doc(id).get();
    return doc.exists ? { id, ...doc.data() as Alert } : undefined;
  }

  async createAlert(alert: Partial<InsertAlert>): Promise<Alert> {
    const now = new Date();
    const alertData = {
      ...alert,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await collections.alerts.add(alertData);
    const newAlert = { id: docRef.id, ...alertData } as Alert;
    return newAlert;
  }

  async updateAlert(id: string, data: Partial<Alert>): Promise<Alert> {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    
    await collections.alerts.doc(id).update(updateData);
    const updatedDoc = await collections.alerts.doc(id).get();
    return { id, ...updatedDoc.data() as Alert };
  }
  
  // Camera methods
  async getCameras(): Promise<Camera[]> {
    const snapshot = await collections.cameras.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Camera
    }));
  }

  async getCamera(id: string): Promise<Camera | undefined> {
    const doc = await collections.cameras.doc(id).get();
    return doc.exists ? { id, ...doc.data() as Camera } : undefined;
  }

  async createCamera(camera: Partial<InsertCamera>): Promise<Camera> {
    const docRef = await collections.cameras.add(camera);
    const newCamera = { id: docRef.id, ...camera } as Camera;
    return newCamera;
  }
  
  // Activity methods
  async getActivities(): Promise<Activity[]> {
    const snapshot = await collections.activities
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Activity
    }));
  }

  async createActivity(activity: Partial<InsertActivity>): Promise<Activity> {
    const activityData = {
      ...activity,
      timestamp: activity.timestamp || new Date()
    };
    
    const docRef = await collections.activities.add(activityData);
    const newActivity = { id: docRef.id, ...activityData } as Activity;
    return newActivity;
  }
  
  // Notification methods
  async getNotifications(): Promise<Notification[]> {
    const snapshot = await collections.notifications
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Notification
    }));
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    const snapshot = await collections.notifications
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Notification
    }));
  }

  async createNotification(notification: Partial<InsertNotification>): Promise<Notification> {
    const notificationData = {
      ...notification,
      createdAt: new Date(),
      read: false
    };
    
    const docRef = await collections.notifications.add(notificationData);
    const newNotification = { id: docRef.id, ...notificationData } as Notification;
    return newNotification;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const batch = collections.notifications.firestore.batch();
    
    const snapshot = await collections.notifications
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
  }

  async dismissNotification(id: string): Promise<void> {
    await collections.notifications.doc(id).delete();
  }
  
  // Stats methods
  async getStats(): Promise<any[]> {
    // For now, return mock stats
    return generateRandomStats();
  }
} 