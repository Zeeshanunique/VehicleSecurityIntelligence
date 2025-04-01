/**
 * Generates random statistics for the dashboard
 * This is a placeholder until real stats are implemented with Firestore
 */
export function generateRandomStats() {
  return [
    { name: 'Total Vehicles', value: Math.floor(100 + Math.random() * 900) },
    { name: 'Active Alerts', value: Math.floor(5 + Math.random() * 30) },
    { name: 'Watchlist Entries', value: Math.floor(20 + Math.random() * 100) },
    { name: 'Cameras Online', value: Math.floor(10 + Math.random() * 50) },
    { name: 'Theft Incidents (Week)', value: Math.floor(2 + Math.random() * 15) },
    { name: 'Traffic Violations', value: Math.floor(30 + Math.random() * 200) }
  ];
}

/**
 * Helper function to format dates consistently
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Helper function to generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Helper function to create a delay (useful for simulating network latency)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
} 