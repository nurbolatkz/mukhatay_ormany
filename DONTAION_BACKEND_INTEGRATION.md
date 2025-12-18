# Donation Backend Integration

## Problem
The donation form was not creating donations in the backend. Instead, it was only saving them to localStorage. This meant that donations were not being properly tracked in the system.

## Solution Implemented

### 1. API Service Enhancement (`services/api.js`)

Added two new methods to the API service:

1. **createDonation** - Creates a new donation record in the backend
2. **processPayment** - Processes payment for a donation and updates its status

```javascript
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
```

### 2. Payment Step Component Update (`components/donation/payment-step.tsx`)

Updated the payment step component to:

1. Import the API service and auth context
2. Use the auth context to get user information
3. Create donations in the backend when processing payments
4. Process payments through the backend API
5. Maintain localStorage fallback for user history
6. Add proper error handling

Key changes:
- Added imports for `apiService` and `useAuth`
- Added `locationId` mapping to convert frontend location names to backend IDs
- Replaced localStorage-only implementation with backend API calls
- Added try/catch error handling
- Maintained localStorage storage for user history display

### 3. Data Mapping

The component now properly maps frontend data to backend requirements:
- Location mapping: "nursery" → "loc_nursery_001", "karaganda" → "loc_karaganda_002"
- Properly structured donation payload matching backend expectations
- Properly structured payment payload

## Result

The donation form now properly creates donations in the backend database instead of just storing them in localStorage. This ensures that:

1. Donations are properly tracked in the system
2. Admin users can view all donations through the admin panel
3. Users can see their donation history in their cabinet
4. Certificates are properly generated and associated with donations
5. Payment status is accurately tracked

The integration maintains backward compatibility by still storing donations in localStorage for immediate display in the user interface.