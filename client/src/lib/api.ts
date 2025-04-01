/**
 * API service for all backend communication.
 * This module centralizes all API calls to the backend server.
 */

const API_BASE_URL = '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Generic function to handle API responses
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    if (response.status === 401) {
      // Handle authentication errors
      window.location.href = '/login';
      return { error: 'Authentication required' };
    }
    
    // Try to get error message from response
    try {
      const errorData = await response.json();
      return { error: errorData.message || `Error: ${response.status}` };
    } catch (e) {
      // If can't parse json, use status text
      return { error: response.statusText || `Error: ${response.status}` };
    }
  }
  
  // For 204 No Content responses
  if (response.status === 204) {
    return { data: {} as T };
  }
  
  // Parse JSON response
  try {
    const data = await response.json();
    return { data };
  } catch (e) {
    return { error: 'Failed to parse response' };
  }
}

/**
 * API service with methods for each endpoint
 */
export const api = {
  /**
   * Authentication methods
   */
  auth: {
    /**
     * Login with email and password
     */
    login: async (email: string, password: string): Promise<ApiResponse<{ user: any }>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
    
    /**
     * Log out the current user
     */
    logout: async (): Promise<ApiResponse<{ message: string }>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
    
    /**
     * Get current user information
     */
    getMe: async (): Promise<ApiResponse<{ user: any }>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
  },

  /**
   * Dashboard methods
   */
  dashboard: {
    /**
     * Get dashboard statistics
     */
    getStats: async (): Promise<ApiResponse<any[]>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/stats`, {
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
  },

  /**
   * Vehicle methods
   */
  vehicles: {
    /**
     * Search vehicles by license plate
     */
    searchByPlate: async (plateNumber: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicles/search?plate=${encodeURIComponent(plateNumber)}`, {
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
    
    /**
     * Get vehicle details by ID
     */
    getById: async (id: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
    
    /**
     * Register a stolen vehicle
     */
    reportStolen: async (vehicleId: string, details: any): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/report-stolen`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(details),
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
  },

  /**
   * Alerts methods
   */
  alerts: {
    /**
     * Get all alerts
     */
    getAll: async (filters?: any): Promise<ApiResponse<any[]>> => {
      try {
        const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
        const response = await fetch(`${API_BASE_URL}/alerts${queryParams}`, {
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
    
    /**
     * Create a new alert
     */
    create: async (alertData: any): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/alerts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(alertData),
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
  },

  /**
   * Facial Recognition methods
   */
  facialRecognition: {
    /**
     * Process image for facial recognition
     */
    processImage: async (imageData: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/facial-recognition`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ image: imageData }),
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
  },

  /**
   * License Plate Recognition methods
   */
  lpr: {
    /**
     * Process image for license plate recognition
     */
    processImage: async (imageData: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/lpr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ image: imageData }),
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
  },

  /**
   * Accident Detection methods
   */
  accidentDetection: {
    /**
     * Process image for accident detection
     */
    processImage: async (imageData: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/accident-detection`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ image: imageData }),
        });
        
        return handleResponse(response);
      } catch (error) {
        return { error: 'Network error. Please check your connection.' };
      }
    },
  },
}; 