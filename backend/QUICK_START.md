# Ioka Integration - Quick Start

## Setup (5 minutes)

### 1. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure environment
```bash
# Copy example file
cp .env.example .env

# Edit .env and add your Ioka credentials
nano .env
```

Required values in `.env`:
```env
IOKA_API_KEY=test_sk_***           # From Ioka dashboard
IOKA_BASE_URL=https://stage-api.ioka.kz
IOKA_WEBHOOK_SECRET=your_secret    # Generate a random string
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### 3. Run database migration
```bash
flask db upgrade
```

### 4. Test integration
```bash
python test_ioka.py
```

## API Quick Reference

### Create Payment
```bash
# Authenticated user
curl -X POST http://localhost:5000/api/donations/{id}/payment \
  -H "Authorization: Bearer {token}"

# Guest
curl -X POST http://localhost:5000/api/guest-donations/{id}/payment
```

Response:
```json
{
  "success": true,
  "checkout_url": "https://checkout.ioka.kz/...",
  "order_id": "ord_xxxxx"
}
```

### Webhook (handled automatically)
```
POST /api/webhooks/ioka
X-Ioka-Signature: {signature}
```

## Donation Status Flow

```
pending → awaiting_payment → completed
              ↓
           failed/cancelled
```

## Test Cards

- **Success**: 4242 4242 4242 4242
- **Fail**: 4000 0000 0000 0002

## Troubleshooting

**Problem**: "Ioka service not available"
- Check if `IOKA_API_KEY` is set in `.env`
- Verify `.env` file exists in backend directory

**Problem**: Webhook not received
- Use ngrok for local testing: `ngrok http 5000`
- Update webhook URL in Ioka dashboard

**Problem**: Payment fails
- Check API key is valid
- Verify stage/production URL matches your key
- Check application logs for errors

## Production Checklist

- [ ] Get production API keys from Ioka
- [ ] Update `IOKA_BASE_URL` to `https://api.ioka.kz`
- [ ] Set production `BACKEND_URL`
- [ ] Configure webhook in Ioka dashboard
- [ ] Run database migration
- [ ] Test with real payment
- [ ] Monitor webhook logs

## Support

- Full docs: `IOKA_INTEGRATION.md`
- Russian guide: `IOKA_SETUP_RU.md`
- Ioka docs: https://ioka.kz/docs
