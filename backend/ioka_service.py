"""
Ioka Payment Gateway Integration Service
Handles payment processing through Ioka API
"""

import os
import requests
import hmac
import hashlib
import json
from typing import Dict, Any, Optional
from datetime import datetime


class IokaService:
    """Service for interacting with Ioka payment gateway"""
    
    def __init__(self):
        self.api_key = os.environ.get('IOKA_API_KEY', '')
        
        self.base_url = os.environ.get('IOKA_BASE_URL', 'https://stage-api.ioka.kz')
        self.webhook_secret = os.environ.get('IOKA_WEBHOOK_SECRET', '')
        self.frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        self.backend_url = os.environ.get('BACKEND_URL', 'http://localhost:5000')
        
        if not self.api_key:
            raise ValueError("IOKA_API_KEY is not set in environment variables")
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for Ioka API requests"""
        return {
            'API-KEY': self.api_key,
            'Content-Type': 'application/json'
        }
    
    def create_payment_order(
        self,
        amount: int,
        description: str,
        donation_id: str,
        customer_email: Optional[str] = None,
        customer_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a payment order in Ioka
        
        Args:
            amount: Amount in tenge (will be converted to tiyn)
            description: Payment description
            donation_id: Unique donation ID
            customer_email: Customer email (optional)
            customer_name: Customer name (optional)
        
        Returns:
            Dictionary with payment order details including checkout_url
        """
        url = f"{self.base_url}/v2/orders"
        
        # Convert Tenge to Tiyn (1 Tenge = 100 Tiyn)
        amount_tiyn = int(amount * 100)
        
        # Prepare payment data
        payload = {
            "amount": amount_tiyn,
            "currency": "KZT",
            "capture_method": "AUTO",
            "external_id": donation_id,
            "description": description,
            "back_url": f"{self.frontend_url}/payment/success?donation_id={donation_id}",
            "success_url": f"{self.frontend_url}/payment/success?donation_id={donation_id}",
            "failure_url": f"{self.frontend_url}/donate?status=failed&donation_id={donation_id}",
            "webhook_url": f"{self.backend_url}/api/webhooks/ioka"
        }
        
        # Add customer data if provided
        if customer_email or customer_name:
            payload["customer"] = {}
            if customer_email:
                payload["customer"]["email"] = customer_email
            if customer_name:
                payload["customer"]["name"] = customer_name
        
        try:
            print(f"Creating payment to Ioka with data: {payload}")
            response = requests.post(
                url,
                headers=self._get_headers(),
                json=payload,
                timeout=10
            )
            
            if not response.ok:
                print(f"IOKA API ERROR: Status {response.status_code}")
                print(f"Response Body: {response.text}")
                
            response.raise_for_status()
            
            response_json = response.json()
            # The documentation shows the response might contain an 'order' key 
            # or the order object might be at the root level.
            data = response_json.get('order', response_json)
            
            return {
                'success': True,
                'order_id': data.get('id'),
                'checkout_url': data.get('checkout_url'),
                'status': data.get('status'),
                'amount': data.get('amount'),
                'currency': data.get('currency')
            }
            
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to create payment order'
            }
    
    def get_payment_status(self, order_id: str) -> Dict[str, Any]:
        """
        Get payment order status from Ioka
        
        Args:
            order_id: Ioka order ID
        
        Returns:
            Dictionary with payment status details
        """
        url = f"{self.base_url}/v2/orders/{order_id}"
        
        try:
            response = requests.get(
                url,
                headers=self._get_headers(),
                timeout=10
            )
            
            if not response.ok:
                print(f"IOKA GET STATUS ERROR: Status {response.status_code}")
                print(f"Response Body: {response.text}")
                
            response.raise_for_status()
            
            response_json = response.json()
            data = response_json.get('order', response_json)
            
            return {
                'success': True,
                'order_id': data.get('id'),
                'status': data.get('status'),
                'amount': data.get('amount'),
                'currency': data.get('currency'),
                'external_id': data.get('external_id'),
                'created_at': data.get('created_at'),
                'updated_at': data.get('updated_at')
            }
            
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to get payment status'
            }
    
    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """
        Verify webhook signature from Ioka
        
        Args:
            payload: Raw request body as bytes
            signature: Signature from X-Ioka-Signature header
        
        Returns:
            True if signature is valid, False otherwise
        """
        if not self.webhook_secret:
            # If no webhook secret is configured, skip verification (not recommended for production)
            return True
        
        # Calculate expected signature
        expected_signature = hmac.new(
            self.webhook_secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        # Compare signatures
        return hmac.compare_digest(expected_signature, signature)
    
    def refund_payment(self, order_id: str, amount: Optional[int] = None) -> Dict[str, Any]:
        """
        Refund a payment
        
        Args:
            order_id: Ioka order ID
            amount: Amount to refund (if None, refunds full amount)
        
        Returns:
            Dictionary with refund details
        """
        url = f"{self.base_url}/v2/orders/{order_id}/refund"
        
        payload = {}
        if amount is not None:
            payload['amount'] = amount
        
        try:
            print(f"Refunding payment to Ioka with data: {payload}")
            response = requests.post(
                url,
                headers=self._get_headers(),
                json=payload if payload else None,
                timeout=10
            )
            
            if not response.ok:
                print(f"IOKA REFUND ERROR: Status {response.status_code}")
                print(f"Response Body: {response.text}")
                
            response.raise_for_status()
            
            data = response.json()
            
            return {
                'success': True,
                'refund_id': data.get('id'),
                'status': data.get('status'),
                'amount': data.get('amount')
            }
            
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to process refund'
            }


# Singleton instance
ioka_service = IokaService()
