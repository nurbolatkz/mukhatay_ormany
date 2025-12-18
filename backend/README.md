# Flask Backend for Tree Donation Platform

This is a Flask backend implementation for the Tree Donation Platform that handles user authentication and management as specified in the API documentation.

## Setup Instructions

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - On Windows:
   ```bash
   venv\Scripts\activate
   ```
   - On macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

4. Install the required packages:
```bash
pip install -r requirements.txt
```

### Running the Server

1. Make sure you're in the backend directory and your virtual environment is activated.

2. Run the Flask application:
```bash
python app.py
```

3. The server will start on `http://localhost:5000`

## API Endpoints Implemented

### User Authentication & Management

1. **Register a new user**
   - **Method:** `POST`
   - **URL:** `/api/auth/register`
   - **Description:** Creates a new user account.
   - **Authentication:** None
   - **Request Body:**
     ```json
     {
       "full_name": "Асем Нурланова",
       "email": "asem@example.com",
       "password": "secure_password_123",
       "phone": "+77012345678"
     }
     ```

2. **Login**
   - **Method:** `POST`
   - **URL:** `/api/auth/login`
   - **Description:** Authenticates a user and returns a JWT token.
   - **Authentication:** Basic Auth
   - **Request:** Send username and password as Basic Auth credentials
   - **Response:**
     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
     ```

3. **Get user profile**
   - **Method:** `GET`
   - **URL:** `/api/users/me`
   - **Description:** Retrieves the profile of the currently authenticated user.
   - **Authentication:** Bearer Token
   - **Response:**
     ```json
     {
       "id": "usr_001",
       "full_name": "Асем Нурланова",
       "email": "asem@example.com",
       "phone": "+77012345678",
       "company_name": "",
       "created_at": "2024-02-01T08:00:00Z",
       "last_login": "2024-06-12T10:00:00Z"
     }
     ```

4. **Update user profile**
   - **Method:** `PUT`
   - **URL:** `/api/users/me`
   - **Description:** Updates the profile of the currently authenticated user.
   - **Authentication:** Bearer Token
   - **Request Body:**
     ```json
     {
       "full_name": "Асем Нурланова",
       "phone": "+77012345678",
       "company_name": "Green Solutions LLC"
     }
     ```

## Frontend Integration

The frontend components in the Next.js application use the `services/api.js` module to communicate with this backend. The API service handles:

- Base URL configuration
- Authentication token management
- Request/response handling
- Error handling

## Testing

You can test the endpoints using tools like Postman or curl:

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Authorization: Basic dGVzdEBleGFtcGxlLmNvbTpwYXNzd29yZDEyMw==" \
  -H "Content-Type: application/json"
```

### Get user profile
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Development Notes

- The secret key in `app.py` should be changed for production
- Passwords are hashed using SHA256 (in production, use a more secure method like bcrypt)
- JWT tokens expire after 24 hours
- CORS is enabled for all origins (restrict in production)
- A test user is created on startup for development: test@example.com / password123