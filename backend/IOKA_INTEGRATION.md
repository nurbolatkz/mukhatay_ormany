# Ioka Payment Integration Documentation

## Overview
Integration of Ioka payment gateway for processing tree donation payments in the Mukhatay Ormany project.

## Configuration

### Environment Variables
Add the following to your `.env` file (see `.env.example`):

```env
IOKA_API_KEY=test_***
IOKA_BASE_URL=https://stage-api.ioka.kz
IOKA_WEBHOOK_SECRET=your_webhook_secret_here
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

**Production URLs:**
- Stage API: `https://stage-api.ioka.kz`
- Production API: `https://api.ioka.kz`

### Dependencies
Added to `requirements.txt`:
- `requests==2.31.0` - HTTP client for API calls
- `python-dotenv==1.0.0` - Environment variable management

## Architecture

### Files Structure
```
backend/
├── ioka_service.py         # Ioka API integration service
├── app.py                   # Updated with payment endpoints
├── .env.example             # Configuration template
└── migrations/
    └── versions/
        └── add_payment_order_id.py  # Database migration
```

### Database Changes
**Donation Model:**
- Added `payment_order_id` field to track Ioka payment orders

## API Endpoints

### 1. Create Payment for Authenticated User
**Endpoint:** `POST /api/donations/{donation_id}/payment`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "checkout_url": "https://checkout.ioka.kz/...",
  "order_id": "ord_xxxxx",
  "donation_id": "donation_uuid",
  "status": "awaiting_payment"
}
```

### 2. Create Payment for Guest Donation
**Endpoint:** `POST /api/guest-donations/{donation_id}/payment`

**Response:**
```json
{
  "success": true,
  "checkout_url": "https://checkout.ioka.kz/...",
  "order_id": "ord_xxxxx",
  "donation_id": "donation_uuid",
  "status": "awaiting_payment"
}
```

### 3. Webhook Endpoint
**Endpoint:** `POST /api/webhooks/ioka`

**Headers:**
```
X-Ioka-Signature: {signature}
Content-Type: application/json
```

**Payload:**
```json
{
  "event": "payment.succeeded",
  "object": {
    "id": "ord_xxxxx",
    "external_id": "donation_uuid",
    "amount": 5000,
    "currency": "KZT",
    "status": "succeeded"
  }
}
```

**Supported Events:**
- `payment.succeeded` - Payment successful, donation marked as completed
- `payment.failed` - Payment failed
- `payment.cancelled` - Payment cancelled

## Payment Flow

### Authenticated User Flow
1. User creates donation → status: `pending`
2. User initiates payment → Ioka order created → status: `awaiting_payment`
3. User redirected to Ioka checkout page
4. User completes payment
5. Ioka sends webhook → status: `completed` + certificate generated
6. User redirected back to app with success status

### Guest User Flow
Same as authenticated flow, but no JWT token required for guest donation endpoints.

## Ioka Service Methods

### `create_payment_order()`
Creates a new payment order in Ioka.

**Parameters:**
- `amount` (int): Amount in KZT
- `description` (str): Payment description
- `donation_id` (str): Unique donation ID
- `customer_email` (str, optional): Customer email
- `customer_name` (str, optional): Customer name

**Returns:**
```python
{
    'success': True,
    'order_id': 'ord_xxxxx',
    'checkout_url': 'https://checkout.ioka.kz/...',
    'status': 'pending',
    'amount': 5000,
    'currency': 'KZT'
}
```

### `get_payment_status()`
Retrieves payment status from Ioka.

**Parameters:**
- `order_id` (str): Ioka order ID

### `verify_webhook_signature()`
Verifies webhook signature for security.

**Parameters:**
- `payload` (bytes): Raw request body
- `signature` (str): Signature from X-Ioka-Signature header

### `refund_payment()`
Initiates a refund for a payment.

**Parameters:**
- `order_id` (str): Ioka order ID
- `amount` (int, optional): Amount to refund (full if not specified)

## Security

### Webhook Signature Verification
All webhook requests are verified using HMAC-SHA256:
```python
expected_signature = hmac.new(
    webhook_secret.encode('utf-8'),
    payload,
    hashlib.sha256
).hexdigest()
```

### Environment Variables
Never commit `.env` file or API keys to version control. Use `.env.example` as template.

## Error Handling

### Payment Creation Errors
- Invalid API key → 401 Unauthorized
- Network errors → 500 Internal Server Error
- Invalid parameters → 400 Bad Request

### Webhook Errors
- Invalid signature → 401 Unauthorized
- Missing donation → 404 Not Found
- Processing errors → 500 Internal Server Error

## Testing

### Test Mode
Use `IOKA_BASE_URL=https://stage-api.ioka.kz` for testing.

### Test Cards (Ioka Stage)
- **Success:** 4242 4242 4242 4242
- **Failure:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### Webhook Testing
Use tools like ngrok to expose local server for webhook testing:
```bash
ngrok http 5000
# Update BACKEND_URL to ngrok URL in Ioka dashboard
```

## Deployment

### Database Migration
Run migration to add `payment_order_id` field:
```bash
cd backend
flask db upgrade
```

### Environment Setup
1. Create `.env` file from `.env.example`
2. Add production Ioka API key
3. Set production URLs
4. Configure webhook URL in Ioka dashboard

### Webhook Configuration
In Ioka dashboard, set webhook URL to:
```
https://your-domain.com/api/webhooks/ioka
```

## Monitoring

### Logs
- Payment creation: Logged in application logs
- Webhook events: Printed to console
- Errors: Captured with stack traces

### Payment Status
Check donation status:
- `pending` - Donation created, payment not initiated
- `awaiting_payment` - Payment order created, waiting for payment
- `completed` - Payment successful
- `failed` - Payment failed
- `cancelled` - Payment cancelled

## Fallback Mode

If Ioka is not configured or unavailable (`IOKA_ENABLED=False`), payment endpoints fall back to marking donations as completed without actual payment processing. This allows development and testing without Ioka credentials.

## Support

- **Ioka Documentation:** https://ioka.kz/docs
- **Ioka Support:** support@ioka.kz
- **API Status:** https://status.ioka.kz

## Future Enhancements

1. **Payment Status Polling:** Check payment status if webhook fails
2. **Retry Logic:** Automatic retry for failed webhook processing
3. **Admin Dashboard:** View payment orders and statuses
4. **Email Notifications:** Send payment confirmations
5. **Refund Interface:** Admin interface for processing refunds
6. **Multi-currency Support:** Support for USD, EUR, etc.
7. **Recurring Payments:** Subscription-based tree planting
