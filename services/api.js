// services/api.js
// API service module for handling all backend communications

const API_BASE_URL = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL 
  : 'http://127.0.0.1:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Get authentication token
  getToken() {
    if (this.token) {
      return this.token;
    }
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
      return this.token;
    }
    
    return null;
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Generic request method
  async request(endpoint, options = {}, suppressErrors = false) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (!suppressErrors) {
        // In production, we don't log errors to console to prevent information leakage
        if (process.env.NODE_ENV !== 'production') {
          console.error(`API request failed: ${error.message}`);
        }
      }
      throw error;
    }
  }

  // User Authentication & Management

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.full_name - Full name of the user
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} userData.phone - Phone number
   * @returns {Promise<Object>} Response message
   */
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication token
   */
  async login(email, password) {
    // Encode credentials for Basic Auth
    const credentials = btoa(`${email}:${password}`);
    
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });
    
    // Set token upon successful login
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  /**
   * Logout user
   * Attempts to call backend logout endpoint, but falls back to client-side logout
   * if the endpoint doesn't exist
   */
  async logout() {
    try {
      // Call backend logout endpoint
      await this.request('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Logout endpoint error:', error.message);
      }
    } finally {
      // Always clear the token on client side
      this.clearToken();
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile() {
    try {
      const response = await this.request('/api/users/me', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching user profile:', error);
      }
      throw error;
    }
  }

  /**
   * Get current user's donation history
   * @returns {Promise<Array>} User's donation history
   */
  async getUserDonations() {
    try {
      const response = await this.request('/api/users/me/donations', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching user donations:', error);
      }
      throw error;
    }
  }

  /**
   * Get all locations
   * @returns {Promise<Array>} List of locations
   */
  async getLocations() {
    try {
      const response = await this.request('/api/locations', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching locations:', error);
      }
      throw error;
    }
  }

  /**
   * Create a new donation
   * @param {Object} donationData - Donation data
   * @returns {Promise<Object>} Created donation
   */
  async createDonation(donationData) {
    try {
      const response = await this.request('/api/donations', {
        method: 'POST',
        body: JSON.stringify(donationData),
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error creating donation:', error);
      }
      throw error;
    }
  }

  /**
   * Process payment for a donation
   * @param {string} donationId - Donation ID
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Payment response
   */
  async processPayment(donationId, paymentData) {
    try {
      const response = await this.request(`/api/donations/${donationId}/payment`, {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error processing payment:', error);
      }
      throw error;
    }
  }

  // Admin API Methods

  /**
   * Get all donations for admin panel
   * @returns {Promise<Array>} List of all donations
   */
  async adminGetDonations() {
    try {
      const response = await this.request('/api/admin/donations', {
        method: 'GET',
      });
      return response.donations || [];
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching admin donations:', error);
      }
      throw error;
    }
  }

  /**
   * Update donation status
   * @param {string} donationId - Donation ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Update response
   */
  async adminUpdateDonation(donationId, updateData) {
    try {
      const response = await this.request(`/api/admin/donations/${donationId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error updating donation:', error);
      }
      throw error;
    }
  }

  /**
   * Get all users for admin panel
   * @returns {Promise<Array>} List of all users
   */
  async adminGetUsers() {
    try {
      const response = await this.request('/api/admin/users', {
        method: 'GET',
      });
      return response.users || [];
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching admin users:', error);
      }
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user response
   */
  async adminCreateUser(userData) {
    try {
      const response = await this.request('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error creating user:', error);
      }
      throw error;
    }
  }

  /**
   * Update a user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Update response
   */
  async adminUpdateUser(userId, userData) {
    try {
      const response = await this.request(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error updating user:', error);
      }
      throw error;
    }
  }

  /**
   * Delete a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Delete response
   */
  async adminDeleteUser(userId) {
    try {
      const response = await this.request(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error deleting user:', error);
      }
      throw error;
    }
  }

  /**
   * Get all locations for admin panel
   * @returns {Promise<Array>} List of all locations
   */
  async adminGetLocations() {
    try {
      const response = await this.request('/api/admin/locations', {
        method: 'GET',
      });
      return response.locations || [];
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching admin locations:', error);
      }
      throw error;
    }
  }

  /**
   * Create a new location
   * @param {Object} locationData - Location data
   * @returns {Promise<Object>} Created location response
   */
  async adminCreateLocation(locationData) {
    try {
      const response = await this.request('/api/admin/locations', {
        method: 'POST',
        body: JSON.stringify(locationData),
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error creating location:', error);
      }
      throw error;
    }
  }

  /**
   * Update a location
   * @param {string} locationId - Location ID
   * @param {Object} locationData - Updated location data
   * @returns {Promise<Object>} Update response
   */
  async adminUpdateLocation(locationId, locationData) {
    try {
      const response = await this.request(`/api/admin/locations/${locationId}`, {
        method: 'PUT',
        body: JSON.stringify(locationData),
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error updating location:', error);
      }
      throw error;
    }
  }

  /**
   * Delete a location
   * @param {string} locationId - Location ID
   * @returns {Promise<Object>} Delete response
   */
  async adminDeleteLocation(locationId) {
    try {
      const response = await this.request(`/api/admin/locations/${locationId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error deleting location:', error);
      }
      throw error;
    }
  }

  /**
   * Get donation summary for admin panel
   * @returns {Promise<Object>} Donation summary
   */
  async adminGetDonationsSummary() {
    try {
      const response = await this.request('/api/admin/reports/donations-summary', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      // In production, we don't log errors to console to prevent information leakage
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching admin donations summary:', error);
      }
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;