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
    console.log('API: Setting token:', token);
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      console.log('API: Token stored in localStorage');
    }
  }

  // Get authentication token
  getToken() {
    if (this.token) {
      console.log('API: Returning token from instance:', this.token);
      return this.token;
    }
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
      console.log('API: Retrieved token from localStorage:', this.token);
      return this.token;
    }
    
    console.log('API: No token found');
    return null;
  }

  // Clear authentication token
  clearToken() {
    console.log('API: Clearing token');
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Generic request method
  async request(endpoint, options = {}, suppressErrors = false) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('API: Making request to', url, 'with token:', this.token);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };
    
    console.log('API: Request config:', config);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (!suppressErrors) {
        console.error(`API request failed: ${error.message}`);
      } else {
        console.log(`API request failed (suppressed): ${error.message}`);
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
    console.log('API: Attempting login for email:', email);
    // Encode credentials for Basic Auth
    const credentials = btoa(`${email}:${password}`);
    
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });
    
    console.log('API: Login response received:', response);
    // Set token upon successful login
    if (response.token) {
      console.log('API: Token found in response, setting token');
      this.setToken(response.token);
    } else {
      console.log('API: No token found in response');
    }
    
    return response;
  }

  /**
   * Logout user
   * Attempts to call backend logout endpoint, but falls back to client-side logout
   * if the endpoint doesn't exist
   */
  async logout() {
    console.log('API: Logout called, stack trace:', new Error().stack);
    try {
      // Call backend logout endpoint
      await this.request('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Log error but continue with client-side logout
      console.error('Logout endpoint error:', error.message);
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
      console.log('API: Fetching user profile with token:', this.token);
      const response = await this.request('/api/users/me', {
        method: 'GET',
      });
      console.log('API: User profile response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Get current user's donation history
   * @returns {Promise<Array>} User's donation history
   */
  async getUserDonations() {
    try {
      console.log('API: Fetching user donations with token:', this.token);
      const response = await this.request('/api/users/me/donations', {
        method: 'GET',
      });
      console.log('API: User donations response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching user donations:', error);
      throw error;
    }
  }

  /**
   * Get all locations
   * @returns {Promise<Array>} List of locations
   */
  async getLocations() {
    try {
      console.log('API: Fetching locations');
      const response = await this.request('/api/locations', {
        method: 'GET',
      });
      console.log('API: Locations response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching locations:', error);
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
      console.log('API: Creating donation:', donationData);
      const response = await this.request('/api/donations', {
        method: 'POST',
        body: JSON.stringify(donationData),
      });
      console.log('API: Donation created:', response);
      return response;
    } catch (error) {
      console.error('Error creating donation:', error);
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
      console.log('API: Processing payment for donation:', donationId, paymentData);
      const response = await this.request(`/api/donations/${donationId}/payment`, {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
      console.log('API: Payment processed:', response);
      return response;
    } catch (error) {
      console.error('Error processing payment:', error);
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
      console.log('API: Fetching all donations for admin');
      const response = await this.request('/api/admin/donations', {
        method: 'GET',
      });
      console.log('API: Admin donations response:', response);
      return response.donations || [];
    } catch (error) {
      console.error('Error fetching admin donations:', error);
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
      console.log('API: Updating donation:', donationId, updateData);
      const response = await this.request(`/api/admin/donations/${donationId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      console.log('API: Donation updated:', response);
      return response;
    } catch (error) {
      console.error('Error updating donation:', error);
      throw error;
    }
  }

  /**
   * Get all users for admin panel
   * @returns {Promise<Array>} List of all users
   */
  async adminGetUsers() {
    try {
      console.log('API: Fetching all users for admin');
      const response = await this.request('/api/admin/users', {
        method: 'GET',
      });
      console.log('API: Admin users response:', response);
      return response.users || [];
    } catch (error) {
      console.error('Error fetching admin users:', error);
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
      console.log('API: Creating new user:', userData);
      const response = await this.request('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      console.log('API: User created:', response);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
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
      console.log('API: Updating user:', userId, userData);
      const response = await this.request(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      console.log('API: User updated:', response);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
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
      console.log('API: Deleting user:', userId);
      const response = await this.request(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      console.log('API: User deleted:', response);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Get all locations for admin panel
   * @returns {Promise<Array>} List of all locations
   */
  async adminGetLocations() {
    try {
      console.log('API: Fetching all locations for admin');
      const response = await this.request('/api/admin/locations', {
        method: 'GET',
      });
      console.log('API: Admin locations response:', response);
      return response.locations || [];
    } catch (error) {
      console.error('Error fetching admin locations:', error);
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
      console.log('API: Creating new location:', locationData);
      const response = await this.request('/api/admin/locations', {
        method: 'POST',
        body: JSON.stringify(locationData),
      });
      console.log('API: Location created:', response);
      return response;
    } catch (error) {
      console.error('Error creating location:', error);
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
      console.log('API: Updating location:', locationId, locationData);
      const response = await this.request(`/api/admin/locations/${locationId}`, {
        method: 'PUT',
        body: JSON.stringify(locationData),
      });
      console.log('API: Location updated:', response);
      return response;
    } catch (error) {
      console.error('Error updating location:', error);
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
      console.log('API: Deleting location:', locationId);
      const response = await this.request(`/api/admin/locations/${locationId}`, {
        method: 'DELETE',
      });
      console.log('API: Location deleted:', response);
      return response;
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }

  /**
   * Get donation summary for admin panel
   * @returns {Promise<Object>} Donation summary
   */
  async adminGetDonationsSummary() {
    try {
      console.log('API: Fetching donations summary for admin');
      const response = await this.request('/api/admin/reports/donations-summary', {
        method: 'GET',
      });
      console.log('API: Admin donations summary response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching admin donations summary:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;