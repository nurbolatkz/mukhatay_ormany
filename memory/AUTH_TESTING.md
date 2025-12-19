# Authentication Testing Guide

This guide explains how to test the authentication flow between the frontend and backend.

## Prerequisites

1. Backend server running on `http://127.0.0.1:5000`
2. Frontend server running on `http://localhost:3001`
3. Test user account (created by default in the backend):
   - Email: `test@example.com`
   - Password: `password123`

## Testing the Authentication Flow

### 1. Test Login Page
Visit `http://localhost:3001/test-login` to test the authentication flow with debugging information.

### 2. Standard Login Page
Visit `http://localhost:3001/login` to use the standard login form.

### 3. Registration Page
Visit `http://localhost:3001/register` to create a new account.

## Debugging Authentication Issues

If the redirect to the cabinet page is not working, check the browser console for debugging messages:

1. Open the browser's developer tools (F12)
2. Go to the Console tab
3. Try to log in and observe the console output

Expected flow:
1. "Attempting login with email: [email]"
2. "Login successful, response: [response]"
3. "Redirecting to /cabinet"
4. "AuthContext: Attempting login with email: [email]"
5. "AuthContext: Login successful, fetching user profile"
6. "AuthContext: User profile received: [user data]"
7. "AuthContext: User profile fetched successfully"

## Common Issues and Solutions

### 1. Redirect Not Working
- Check if the token is being stored in localStorage
- Verify that the ProtectedRoute component is correctly implemented
- Ensure the cabinet page is wrapped with ProtectedRoute

### 2. Authentication State Not Updating
- Check if the AuthContext is properly providing the authentication state
- Verify that the user profile is being fetched correctly
- Ensure the token is being set in the API service

### 3. Connection Errors
- Verify that the backend server is running on `http://127.0.0.1:5000`
- Check if there are any CORS issues
- Ensure the API_BASE_URL in the frontend matches the backend URL

## Test User Credentials

Default test user (created automatically by the backend):
- Email: `test@example.com`
- Password: `password123`

You can also register new users through the registration page.

## Language Support

All authentication pages (login, register) are now in Russian as requested:
- Login page: Русский язык
- Registration page: Русский язык
- Error messages: Русский язык
- Form labels and placeholders: Русский язык