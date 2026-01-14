"""
Test script for Ioka payment integration
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_ioka_configuration():
    """Test if Ioka is properly configured"""
    print("=== Testing Ioka Configuration ===\n")
    
    api_key = os.environ.get('IOKA_API_KEY')
    base_url = os.environ.get('IOKA_BASE_URL')
    webhook_secret = os.environ.get('IOKA_WEBHOOK_SECRET')
    
    print(f"IOKA_API_KEY: {'✓ Configured' if api_key else '✗ Missing'}")
    print(f"IOKA_BASE_URL: {base_url if base_url else '✗ Missing'}")
    print(f"IOKA_WEBHOOK_SECRET: {'✓ Configured' if webhook_secret else '✗ Missing'}")
    
    if not api_key:
        print("\n⚠ Warning: IOKA_API_KEY is not configured. Payment integration will not work.")
        print("Please add IOKA_API_KEY to your .env file.")
        return False
    
    return True

def test_ioka_service():
    """Test Ioka service initialization"""
    print("\n=== Testing Ioka Service ===\n")
    
    try:
        from ioka_service import ioka_service
        print("✓ Ioka service initialized successfully")
        print(f"  Base URL: {ioka_service.base_url}")
        print(f"  Frontend URL: {ioka_service.frontend_url}")
        print(f"  Backend URL: {ioka_service.backend_url}")
        return True
    except Exception as e:
        print(f"✗ Failed to initialize Ioka service: {e}")
        return False

def test_create_payment_order():
    """Test creating a payment order (requires valid API key)"""
    print("\n=== Testing Payment Order Creation ===\n")
    
    try:
        from ioka_service import ioka_service
        
        # Test with sample data
        result = ioka_service.create_payment_order(
            amount=1000,  # 1000 KZT
            description="Test tree planting donation",
            donation_id="test_donation_123",
            customer_email="test@example.com",
            customer_name="Test User"
        )
        
        if result.get('success'):
            print("✓ Payment order created successfully")
            print(f"  Order ID: {result.get('order_id')}")
            print(f"  Checkout URL: {result.get('checkout_url')}")
            print(f"  Status: {result.get('status')}")
            return True
        else:
            print(f"✗ Failed to create payment order: {result.get('message')}")
            return False
            
    except Exception as e:
        print(f"✗ Error creating payment order: {e}")
        return False

def test_webhook_signature():
    """Test webhook signature verification"""
    print("\n=== Testing Webhook Signature Verification ===\n")
    
    try:
        from ioka_service import ioka_service
        import hmac
        import hashlib
        
        # Test payload
        test_payload = b'{"event": "payment.succeeded", "object": {"id": "test"}}'
        
        # Generate valid signature
        webhook_secret = os.environ.get('IOKA_WEBHOOK_SECRET', '')
        if webhook_secret:
            valid_signature = hmac.new(
                webhook_secret.encode('utf-8'),
                test_payload,
                hashlib.sha256
            ).hexdigest()
            
            # Test with valid signature
            is_valid = ioka_service.verify_webhook_signature(test_payload, valid_signature)
            if is_valid:
                print("✓ Valid signature verification passed")
            else:
                print("✗ Valid signature verification failed")
            
            # Test with invalid signature
            is_invalid = ioka_service.verify_webhook_signature(test_payload, "invalid_signature")
            if not is_invalid:
                print("✓ Invalid signature correctly rejected")
            else:
                print("✗ Invalid signature incorrectly accepted")
            
            return is_valid and not is_invalid
        else:
            print("⚠ Webhook secret not configured, skipping signature test")
            return True
            
    except Exception as e:
        print(f"✗ Error testing webhook signature: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 50)
    print("Ioka Integration Test Suite")
    print("=" * 50)
    
    results = []
    
    # Run tests
    results.append(("Configuration", test_ioka_configuration()))
    results.append(("Service Initialization", test_ioka_service()))
    results.append(("Webhook Signature", test_webhook_signature()))
    
    # Only test payment creation if API key is configured
    if os.environ.get('IOKA_API_KEY'):
        print("\n⚠ Note: Payment order creation test will use your Ioka API key.")
        print("This will create a test order in your Ioka account.")
        response = input("Run payment creation test? (y/n): ")
        if response.lower() == 'y':
            results.append(("Payment Order Creation", test_create_payment_order()))
    else:
        print("\n⚠ Skipping payment order creation test (API key not configured)")
    
    # Print summary
    print("\n" + "=" * 50)
    print("Test Summary")
    print("=" * 50)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{test_name}: {status}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n✓ All tests passed!")
    else:
        print(f"\n✗ {total - passed} test(s) failed")

if __name__ == '__main__':
    main()
