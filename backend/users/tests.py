from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class UserViewTests(APITestCase):
    def setUp(self):
        self.register_url = 'http://localhost:8000/api/register'
        self.login_url = 'http://localhost:8000/api/login'
        self.user_url = 'http://localhost:8000/api/user'
        self.logout_url = 'http://localhost:8000/api/logout'

    def test_user_flow(self):
        register_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(self.register_url, register_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        login_data = {
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
