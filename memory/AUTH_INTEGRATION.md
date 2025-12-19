# Authentication Integration Guide

This guide explains how to use the authentication integration for the Tree Donation Platform frontend.

## Overview

The authentication system consists of:

1. **API Service** (`services/api.js`) - Handles all API communications
2. **Auth Context** (`contexts/auth-context.tsx`) - Manages authentication state
3. **Protected Route Component** (`components/auth/protected-route.tsx`) - Protects authenticated routes
4. **Login & Register Forms** (`components/auth/*`) - UI components for authentication
5. **Login & Register Pages** (`app/login/page.tsx`, `app/register/page.tsx`) - Authentication pages

## Setup

The authentication system is already integrated into the application through the root layout (`app/layout.tsx`). No additional setup is required.

## Using Authentication in Components

### Accessing Authentication State

To access authentication state in any component:

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";

export default function MyComponent() {
  const { user, isAuthenticated, login, logout, register } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.full_name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes

To protect a route that requires authentication, wrap it with the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

## API Endpoints Integration

### User Registration

```javascript
import apiService from "@/services/api";

// Register a new user
await apiService.register({
  full_name: "John Doe",
  email: "john@example.com",
  password: "securepassword",
  phone: "+1234567890"
});
```

### User Login

```javascript
import apiService from "@/services/api";

// Login user
const response = await apiService.login("john@example.com", "securepassword");
// Token is automatically stored in localStorage and set in the API service
```

### Get User Profile

```javascript
import apiService from "@/services/api";

// Get current user profile (requires authentication)
const userProfile = await apiService.getUserProfile();
```

## Using the Auth Hook

For easier API integration, you can use the `useApi` hook:

```tsx
"use client";

import { useApi } from "@/hooks/use-api";

export default function UserProfile() {
  const { data: user, loading, error } = useApi("/api/users/me", "GET");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h1>{user.full_name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## Authentication Flow

1. User visits `/login` or `/register`
2. User submits credentials
3. API service makes request to backend
4. Upon successful authentication, JWT token is stored in localStorage
5. Auth context updates authentication state
6. User is redirected to protected areas
7. Protected routes check authentication state
8. User can logout, which clears token and resets authentication state

## Error Handling

All API errors are caught and thrown as JavaScript errors with descriptive messages. Handle them appropriately in your components:

```tsx
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login(email, password);
    // Redirect on success
  } catch (error) {
    // Handle error (show message to user)
    console.error("Login failed:", error.message);
  }
};
```

## Customization

### Changing API Base URL

Update the `API_BASE_URL` constant in `services/api.js` to point to your backend.

### Modifying Authentication Logic

Modify the `AuthProvider` component in `contexts/auth-context.tsx` to customize authentication logic.

### Styling Components

The authentication components use Tailwind CSS classes. Modify the classes directly in the components to change their appearance.