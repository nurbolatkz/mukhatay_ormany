import unittest
import json
import base64
from app import app, db, User

class AuthTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register(self):
        response = self.app.post(
            '/api/auth/register',
            data=json.dumps(dict(
                full_name='Test User',
                email='test@example.com',
                password='password',
                phone='1234567890'
            )),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)

    def test_login(self):
        # First, register a user
        self.app.post(
            '/api/auth/register',
            data=json.dumps(dict(
                full_name='Test User',
                email='test@example.com',
                password='password',
                phone='1234567890'
            )),
            content_type='application/json'
        )
        # Then, login
        auth_string = base64.b64encode(b'test@example.com:password').decode('utf-8')
        response = self.app.post(
            '/api/auth/login',
            headers={'Authorization': f'Basic {auth_string}'}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue('token' in data)

if __name__ == '__main__':
    unittest.main()
