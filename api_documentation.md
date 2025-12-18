# Tree Donation Platform - API Documentation

## Base URL

The base URL for all API endpoints is `http://127.0.0.1:5000`.

## Authentication

Most endpoints require authentication using a JSON Web Token (JWT). To authenticate, you need to include an `Authorization` header with the value `Bearer {your_token}` in your requests.

To get a token, you need to use the `/api/auth/login` endpoint.

---

## 1. User Authentication & Management

### Register a new user

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

- **Success Response (200 OK):**

```json
{
  "message": "New user created!"
}
```

- **Error Response (400 Bad Request):**

If any of the required fields are missing.

### Login

- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Authentication:** Basic Auth. The username and password must be sent as a base64 encoded string in the `Authorization` header.
- **Success Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Error Response (401 Unauthorized):**

If the credentials are invalid.

### Get user profile

- **Method:** `GET`
- **URL:** `/api/users/me`
- **Description:** Retrieves the profile of the currently authenticated user.
- **Authentication:** Bearer Token
- **Success Response (200 OK):**

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

### Update user profile

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

- **Success Response (200 OK):**

```json
{
  "message": "User updated successfully"
}
```

---

## 2. Donation Flow Endpoints

### Get all locations

- **Method:** `GET`
- **URL:** `/api/locations`
- **Description:** Get all available planting locations.
- **Authentication:** None
- **Success Response (200 OK):**

```json
[
  {
    "id": "loc_nursery_001",
    "name": "Forest of Central Asia",
    "description": "Питомник в Шортандинском районе",
    "area_hectares": 83,
    "coordinates": "51.2345, 70.1234",
    "image_url": "/images/forest-central-asia-aerial.jpg",
    "status": "active",
    "capacity_trees": 5000,
    "planted_trees": 3250
  }
]
```

### Get location details

- **Method:** `GET`
- **URL:** `/api/locations/{id}`
- **Description:** Get details of a specific location.
- **Authentication:** None
- **Success Response (200 OK):**

```json
{
  "id": "loc_nursery_001",
  "name": "Forest of Central Asia",
  "description": "Питомник в Шортандинском районе",
  "area_hectares": 83,
  "coordinates": "51.2345, 70.1234",
  "image_url": "/images/forest-central-asia-aerial.jpg",
  "status": "active",
  "capacity_trees": 5000,
  "planted_trees": 3250,
  "features": ["Доступно круглый год", "Быстрый старт", "Идеально для частных лиц"]
}
```

- **Error Response (404 Not Found):**

If the location with the specified ID does not exist.

### Get all packages

- **Method:** `GET`
- **URL:** `/api/packages`
- **Description:** Get all available donation packages.
- **Authentication:** None
- **Success Response (200 OK):**

```json
[
  {
    "id": "pkg_single",
    "name": "1 дерево",
    "tree_count": 1,
    "price": 2500,
    "description": "Идеально для начала",
    "popular": false
  }
]
```

### Get packages by location

- **Method:** `GET`
- **URL:** `/api/packages/by-location/{locationId}`
- **Description:** Get packages for a specific location.
- **Authentication:** None
- **Success Response (200 OK):**

Returns a list of all packages (currently not filtered by location).

### Create a new donation

- **Method:** `POST`
- **URL:** `/api/donations`
- **Description:** Creates a new donation record.
- **Authentication:** Bearer Token
- **Request Body:**

```json
{
  "location_id": "loc_nursery_001",
  "package_id": "pkg_small",
  "tree_count": 10,
  "amount": 22500,
  "donor_info": {
    "full_name": "Асем Нурланова",
    "email": "asem@example.com",
    "phone": "+77012345678",
    "company_name": "",
    "message": "В честь моего сына",
    "subscribe_updates": true
  }
}
```

- **Success Response (201 Created):**

```json
{
  "id": "don_2024_001",
  "status": "pending_payment"
}
```

### Process payment

- **Method:** `POST`
- **URL:** `/api/donations/{id}/payment`
- **Description:** Processes the payment for a donation and creates a certificate.
- **Authentication:** Bearer Token
- **Success Response (200 OK):**

```json
{
  "success": true,
  "donation_id": "don_2024_001",
  "status": "completed",
  "certificate_id": "cert_2024_001",
  "updated_at": "2024-06-12T10:35:00Z"
}
```

### Get donation status

- **Method:** `GET`
- **URL:** `/api/donations/{id}/status`
- **Description:** Retrieves the status of a donation.
- **Authentication:** Bearer Token
- **Success Response (200 OK):**

```json
{
  "id": "don_2024_001",
  "status": "completed",
  "payment_status": "processed",
  "certificate_status": "generated",
  "certificate_id": "cert_2024_001"
}
```

---

## 3. User Cabinet Endpoints

### Get user's donations

- **Method:** `GET`
- **URL:** `/api/users/me/donations`
- **Description:** Retrieves the donation history of the currently authenticated user.
- **Authentication:** Bearer Token
- **Success Response (200 OK):**

```json
[
  {
    "id": "don_2024_001",
    "date": "2024-06-12T10:30:00Z",
    "location": "Forest of Central Asia",
    "trees": 10,
    "amount": 22500,
    "status": "completed",
    "certificate_id": "cert_2024_001"
  }
]
```

### Get user's certificates

- **Method:** `GET`
- **URL:** `/api/users/me/certificates`
- **Description:** Retrieves the certificates of the currently authenticated user.
- **Authentication:** Bearer Token
- **Success Response (200 OK):**

```json
[
  {
    "id": "cert_2024_001",
    "donation_id": "don_2024_001",
    "trees": 10,
    "location": "Forest of Central Asia",
    "date": "2024-06-12T10:35:00Z",
    "pdf_url": "/certificates/cert_2024_001.pdf"
  }
]
```

### Download certificate

- **Method:** `GET`
- **URL:** `/api/users/me/certificates/{id}/download`
- **Description:** Downloads a certificate in PDF format.
- **Authentication:** Bearer Token
- **Success Response (200 OK):**

This endpoint will return a PDF file.

---

## 4. Admin Panel Endpoints

**Note:** All admin endpoints require a user with the `admin` role.

### Get all donations

- **Method:** `GET`
- **URL:** `/api/admin/donations`
- **Description:** Retrieves all donations.
- **Authentication:** Bearer Token (admin)
- **Success Response (200 OK):**

```json
{
  "donations": [
    {
      "id": "don_2024_001",
      "donor_name": "Асем Нурланова",
      "email": "asem@example.com",
      "location": "Forest of Central Asia",
      "trees": 10,
      "amount": 22500,
      "status": "completed",
      "date": "2024-06-12T10:30:00Z"
    }
  ]
}
```

### Update donation

- **Method:** `PUT`
- **URL:** `/api/admin/donations/{id}`
- **Description:** Updates the status of a donation.
- **Authentication:** Bearer Token (admin)
- **Request Body:**

```json
{
  "status": "processing"
}
```

- **Success Response (200 OK):**

```json
{
  "message": "Donation updated successfully"
}
```

### Get all users

- **Method:** `GET`
- **URL:** `/api/admin/users`
- **Description:** Retrieves all users.
- **Authentication:** Bearer Token (admin)
- **Success Response (200 OK):**

```json
{
  "users": [
    {
      "id": "usr_001",
      "name": "Асем Нурланова",
      "email": "asem@example.com",
      "donations_count": 5,
      "trees_planted": 127,
      "total_amount": 285000,
      "status": "active",
      "joined_date": "2024-02-01T08:00:00Z"
    }
  ]
}
```

### Get all certificates

- **Method:** `GET`
- **URL:** `/api/admin/certificates`
- **Description:** Retrieves all certificates.
- **Authentication:** Bearer Token (admin)
- **Success Response (200 OK):**

```json
{
  "certificates": [
    {
      "id": "cert_2024_001",
      "donation_id": "don_2024_001",
      "donor_name": "Асем Нурланова",
      "trees": 10,
      "status": "generated",
      "created_date": "2024-06-12T10:35:00Z"
    }
  ]
}
```

### Create a certificate

- **Method:** `POST`
- **URL:** `/api/admin/certificates`
- **Description:** Manually creates a certificate for a donation.
- **Authentication:** Bearer Token (admin)
- **Request Body:**

```json
{
  "donation_id": "don_2024_001"
}
```

- **Success Response (200 OK):**

```json
{
  "success": true,
  "certificate": {
    "id": "cert_2024_001",
    "donation_id": "don_2024_001",
    "donor_name": "Асем Нурланова",
    "trees": 10,
    "status": "generated",
    "created_date": "2024-06-12T10:35:00Z",
    "pdf_url": "/certificates/cert_2024_001.pdf"
  }
}
```

---

## 5. Reporting & Analytics (Admin)

### Get donations summary

- **Method:** `GET`
- **URL:** `/api/admin/reports/donations-summary`
- **Description:** Retrieves a summary of all donations.
- **Authentication:** Bearer Token (admin)
- **Success Response (200 OK):**

```json
{
  "total_donations": 480,
  "processing_count": 12,
  "pending_count": 5,
  "total_revenue": 13500000,
  "trees_planted": 42500,
  "by_location": {
    "Forest of Central Asia": {
      "donations": 200,
      "trees": 15000,
      "revenue": 5000000
    },
    "Mukhatay Ormany": {
      "donations": 280,
      "trees": 27500,
      "revenue": 8500000
    }
  }
}
```
