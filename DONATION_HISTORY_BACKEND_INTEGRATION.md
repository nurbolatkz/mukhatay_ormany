# Donation History Backend Integration

## Problem
The donation history page was showing location IDs instead of location names, and there was a potential error when trying to access certificate IDs for donations that might not have certificates yet.

## Solution Implemented

### 1. Backend Fixes (`backend/app.py`)

Updated the `/api/users/me/donations` endpoint to:
- Return location names instead of location IDs
- Safely handle certificate IDs (prevent errors when no certificate exists)

**Changes made:**
```python
# Before:
'location': donation.location_id,
'certificate_id': Certificate.query.filter_by(donation_id=donation.id).first().id

# After:
# Get location name instead of ID
location = Location.query.get(donation.location_id)
location_name = location.name if location else donation.location_id

# Get certificate ID safely
certificate = Certificate.query.filter_by(donation_id=donation.id).first()
certificate_id = certificate.id if certificate else None

'location': location_name,
'certificate_id': certificate_id
```

### 2. API Service Enhancement (`services/api.js`)

Added a new method to fetch locations:
```javascript
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
```

## Result
The donation history page now correctly displays:
- Location names instead of IDs
- Proper handling of certificate data
- Real data from the backend instead of hardcoded examples

The integration is complete and working as expected.