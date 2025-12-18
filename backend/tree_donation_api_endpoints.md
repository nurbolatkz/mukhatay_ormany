# Tree Donation Platform - API Endpoints Specification

## 1. Donation Flow Endpoints

### Locations Management
- **GET /api/locations**
  - Description: Get all available planting locations
  - Authentication: None (Public)
  - Response:
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
      },
      {
        "id": "loc_karaganda_002",
        "name": "Mukhatay Ormany",
        "description": "Проект лесовосстановления в Карагандинской области",
        "area_hectares": 25000,
        "coordinates": "49.8012, 73.1089",
        "image_url": "/images/mukhatay-ormany-landscape.jpg",
        "status": "active",
        "capacity_trees": 150000,
        "planted_trees": 42500
      }
    ]
    ```

- **GET /api/locations/{id}**
  - Description: Get details of a specific location
  - Authentication: None (Public)
  - Response:
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

### Donation Packages
- **GET /api/packages**
  - Description: Get all available donation packages
  - Authentication: None (Public)
  - Response:
    ```json
    [
      {
        "id": "pkg_single",
        "name": "1 дерево",
        "tree_count": 1,
        "price": 2500,
        "description": "Идеально для начала",
        "popular": false
      },
      {
        "id": "pkg_small",
        "name": "10 деревьев",
        "tree_count": 10,
        "price": 22500,
        "description": "Небольшой пакет",
        "popular": true
      }
    ]
    ```

- **GET /api/packages/by-location/{locationId}**
  - Description: Get packages for a specific location
  - Authentication: None (Public)
  - Response:
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

### Donation Processing
- **POST /api/donations**
  - Description: Create a new donation record
  - Authentication: Required (User)
  - Request:
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
  - Response:
    ```json
    {
      "id": "don_2024_001",
      "location_id": "loc_nursery_001",
      "package_id": "pkg_small",
      "tree_count": 10,
      "amount": 22500,
      "status": "pending_payment",
      "created_at": "2024-06-12T10:30:00Z",
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

- **POST /api/donations/{id}/payment**
  - Description: Process payment for a donation
  - Authentication: Required (User)
  - Request:
    ```json
    {
      "payment_method": "kaspi",
      "transaction_id": "txn_123456789"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "donation_id": "don_2024_001",
      "status": "completed",
      "certificate_id": "cert_2024_001",
      "updated_at": "2024-06-12T10:35:00Z"
    }
    ```

- **GET /api/donations/{id}/status**
  - Description: Check donation/payment status
  - Authentication: Required (User)
  - Response:
    ```json
    {
      "id": "don_2024_001",
      "status": "completed",
      "payment_status": "processed",
      "certificate_status": "generated",
      "certificate_id": "cert_2024_001"
    }
    ```

## 2. User Authentication & Management

- **POST /api/auth/register**
  - Description: User registration
  - Authentication: None
  - Request:
    ```json
    {
      "full_name": "Асем Нурланова",
      "email": "asem@example.com",
      "password": "secure_password_123",
      "phone": "+77012345678"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "user_id": "usr_001",
      "message": "Registration successful"
    }
    ```

- **POST /api/auth/login**
  - Description: User login
  - Authentication: None
  - Request:
    ```json
    {
      "email": "asem@example.com",
      "password": "secure_password_123"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "usr_001",
        "full_name": "Асем Нурланова",
        "email": "asem@example.com",
        "role": "user"
      }
    }
    ```

- **GET /api/users/me**
  - Description: Get current user profile
  - Authentication: Required (Bearer Token)
  - Response:
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

- **PUT /api/users/me**
  - Description: Update current user profile
  - Authentication: Required (Bearer Token)
  - Request:
    ```json
    {
      "full_name": "Асем Нурланова",
      "phone": "+77012345678",
      "company_name": "Green Solutions LLC"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "message": "Profile updated successfully",
      "user": {
        "id": "usr_001",
        "full_name": "Асем Нурланова",
        "email": "asem@example.com",
        "phone": "+77012345678",
        "company_name": "Green Solutions LLC"
      }
    }
    ```

## 3. Admin Panel Endpoints

### Donations Management
- **GET /api/admin/donations**
  - Description: Get all donations with filtering/pagination
  - Authentication: Required (Admin)
  - Query Parameters: `page`, `limit`, `status`, `location_id`, `date_from`, `date_to`
  - Response:
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
      ],
      "pagination": {
        "current_page": 1,
        "total_pages": 5,
        "total_items": 480,
        "items_per_page": 20
      }
    }
    ```

- **PUT /api/admin/donations/{id}**
  - Description: Update donation status
  - Authentication: Required (Admin)
  - Request:
    ```json
    {
      "status": "processing"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "message": "Donation status updated",
      "donation": {
        "id": "don_2024_001",
        "status": "processing"
      }
    }
    ```

### Users Management
- **GET /api/admin/users**
  - Description: Get all users with filtering/pagination
  - Authentication: Required (Admin)
  - Query Parameters: `page`, `limit`, `search`, `status`
  - Response:
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
      ],
      "pagination": {
        "current_page": 1,
        "total_pages": 10,
        "total_items": 1247,
        "items_per_page": 20
      }
    }
    ```

### Certificates Management
- **GET /api/admin/certificates**
  - Description: Get all certificates with filtering/pagination
  - Authentication: Required (Admin)
  - Query Parameters: `page`, `limit`, `status`, `date_from`, `date_to`
  - Response:
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
      ],
      "pagination": {
        "current_page": 1,
        "total_pages": 5,
        "total_items": 480,
        "items_per_page": 20
      }
    }
    ```

- **POST /api/admin/certificates**
  - Description: Generate new certificate
  - Authentication: Required (Admin)
  - Request:
    ```json
    {
      "donation_id": "don_2024_001"
    }
    ```
  - Response:
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

## 4. User Cabinet Endpoints

### Donation History
- **GET /api/users/me/donations**
  - Description: Get current user's donation history
  - Authentication: Required (Bearer Token)
  - Response:
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

### Certificate Management
- **GET /api/users/me/certificates**
  - Description: Get current user's certificates
  - Authentication: Required (Bearer Token)
  - Response:
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

- **GET /api/users/me/certificates/{id}/download**
  - Description: Download certificate PDF
  - Authentication: Required (Bearer Token)
  - Response: Binary PDF file

## 5. Reporting & Analytics (Admin)

- **GET /api/admin/reports/donations-summary**
  - Description: Get donations summary statistics
  - Authentication: Required (Admin)
  - Response:
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