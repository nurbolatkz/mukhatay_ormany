// test-api.js
// Simple script to test API endpoints directly

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    // Test login
    const credentials = btoa('test@example.com:password123');
    const loginResponse = await fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.token) {
      console.log('Testing user profile endpoint...');
      
      // Test getting user profile
      const profileResponse = await fetch('http://127.0.0.1:5000/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile status:', profileResponse.status);
      const profileData = await profileResponse.json();
      console.log('Profile response:', profileData);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testLogin();