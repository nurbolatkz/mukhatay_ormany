# Guest Donation Feature Implementation

## Overview
This document describes the implementation of the guest donation feature that allows users to donate without registering, then link those donations to their account when they register/login with the same email.

## Backend Changes

### 1. Database Schema Updates
- Added an `email` column to the `donation` table to store donor email addresses for guest donations
- Created migration file `2_add_email_to_donations.py` to add this column

### 2. New API Endpoints
- `/api/guest-donations` (POST) - Create a guest donation without authentication
- `/api/guest-donations/<donation_id>/payment` (POST) - Process payment for guest donations

### 3. Modified Existing Endpoints
- Updated `/api/donations` to also store the user's email in the email column for consistency
- Updated `/api/users/me/donations` to automatically link guest donations when fetching user donations
- Updated `/api/auth/register` to link guest donations on user registration
- Updated `/api/auth/login` to link guest donations on user login

### 4. Logic Implementation
- When a guest makes a donation, it's stored with `user_id=NULL` and the donor's email in the `email` column
- When a user registers or logs in, the system finds all donations with `email=<user_email>` and `user_id=NULL` and updates them to set `user_id=<user_id>`
- When a user views their donation history, all donations with their `user_id` are returned, including those linked from guest donations

## Frontend Changes

### 1. API Service Updates
- Modified `createDonation()` method to accept an `isGuest` parameter and use the appropriate endpoint
- Modified `processPayment()` method to accept an `isGuest` parameter and use the appropriate endpoint

### 2. Payment Step Component
- Updated to detect if a user is authenticated and use the appropriate API endpoints
- For authenticated users, uses existing endpoints
- For guest users, uses new guest donation endpoints

## Data Flow

### Guest Donation Flow
1. User visits donation page without logging in
2. User fills donation form and proceeds to payment
3. Frontend detects user is not authenticated
4. Frontend calls `/api/guest-donations` to create donation record
5. Frontend calls `/api/guest-donations/<id>/payment` to process payment
6. Donation is saved with `user_id=NULL` and donor's email in `email` column
7. User is redirected to login page with email pre-filled

### User Registration/Login Flow
1. User registers or logs in with email
2. Backend checks for any donations with `email=<user_email>` and `user_id=NULL`
3. Backend updates those donations to set `user_id=<user_id>`
4. User can now see all their donations in their cabinet/history

### User Cabinet/History View
1. User visits cabinet/history page
2. Frontend calls `/api/users/me/donations`
3. Backend first links any remaining guest donations for this user
4. Backend returns all donations where `user_id=<user_id>`

## Security Considerations
- Guest donations can only be processed through the guest payment endpoint
- Regular payment endpoint validates user ownership
- Guest payment endpoint ensures the donation is actually a guest donation (user_id is NULL)

## Testing
To test this feature:
1. Make a donation as a guest (without logging in)
2. Register with the same email used for the guest donation
3. Log in and verify the guest donation appears in the donation history
4. Make another donation as an authenticated user
5. Verify both donations appear in the history