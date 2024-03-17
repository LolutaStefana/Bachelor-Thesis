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

        self.user_data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'testpassword',
        'country': 'Test Country',
        'city': 'Test City',
        'gender': 'Other',
        'date_of_birth': '1990-01-01',
        'description': 'A test user description'
    }

    def test_user_registration_flow(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        incomplete_data = self.user_data.copy()
        del incomplete_data['email']
        response = self.client.post(self.register_url, incomplete_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_flow(self):
        self.client.post(self.register_url, self.user_data)

        login_data = {'email': self.user_data['email'], 'password': self.user_data['password']}
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        wrong_login_data = {'email': self.user_data['email'], 'password': 'wrongpassword'}
        response = self.client.post(self.login_url, wrong_login_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_actions_flow(self):
        self.client.post(self.register_url, self.user_data)
        login_response = self.client.post(self.login_url,
                                          {'email': self.user_data['email'], 'password': self.user_data['password']})
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(self.user_url)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)
