from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
import json

User = get_user_model()


class UserViewTests(APITestCase):
    def setUp(self):
        self.register_url = 'http://localhost:8000/api/register'
        self.login_url = 'http://localhost:8000/api/login'
        self.user_url = 'http://localhost:8000/api/user'
        self.logout_url = 'http://localhost:8000/api/logout'
        self.profile_update_url = '/api/user/profile/update'
        self.create_appointment_url = '/api/appointments/create'
        self.appointment_list_url = lambda user_id: f'/api/appointments/{user_id}'
        self.update_appointment_url = '/api/appointments/update/{pk}'

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
        self.therapist_data = {
            'name': 'Therapist User',
            'email': 'therapist@example.com',
            'password': 'therapistpassword',
            'is_therapist': True
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

    def test_profile_update(self):
        self.client.post(self.register_url, self.user_data)
        login_response = self.client.post(self.login_url, {'email': 'test@example.com', 'password': 'testpassword'})
        self.token = login_response.data['jwt']
        update_data = {'city': 'Updated City'}
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        response = self.client.put(self.profile_update_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['city'], 'Updated City')

    def test_create_appointment(self):
        self.client.post(self.register_url, self.user_data)
        user_login_response = self.client.post(self.login_url,
                                               {'email': 'test@example.com', 'password': 'testpassword'})
        user_token = user_login_response.data['jwt']
        user_id = User.objects.get(email='test@example.com').id

        self.client.post(self.register_url, self.therapist_data)
        therapist_login_response = self.client.post(self.login_url,
                                                    {'email': 'therapist@example.com', 'password': 'therapistpassword'})
        therapist_token = therapist_login_response.data['jwt']

        therapist_id = User.objects.get(email='therapist@example.com').id

        appointment_data = {
            'user': user_id,
            'therapist': therapist_id,
            'scheduled_time': '2024-11-10T14:00:00Z'
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + user_token)
        response = self.client.post(self.create_appointment_url, appointment_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['therapist'], therapist_id)

    def test_appointment_list(self):
        self.client.post(self.register_url, self.user_data)
        user_login_response = self.client.post(self.login_url,
                                               {'email': 'test@example.com', 'password': 'testpassword'})
        self.user_token = user_login_response.data['jwt']
        self.user_id = User.objects.get(email='test@example.com').id

        self.client.post(self.register_url, self.therapist_data)
        therapist_login_response = self.client.post(self.login_url,
                                                    {'email': 'therapist@example.com', 'password': 'therapistpassword'})
        self.therapist_id = User.objects.get(email='therapist@example.com').id
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.user_token)
        appointment_data = {
            'user': self.user_id,
            'therapist': self.therapist_id,
            'scheduled_time': '2024-10-10T14:00:00Z'
        }
        self.client.post(self.create_appointment_url, appointment_data)

        response = self.client.get(self.appointment_list_url(self.user_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['therapist_details']['id'], self.therapist_id)

    # def test_update_appointment_status(self):
    #     response = self.client.post(self.register_url, self.user_data)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     login_response = self.client.post(self.login_url, {'email': 'test@example.com', 'password': 'testpassword'})
    #     self.user_token = login_response.data['jwt']
    #     self.user_id = User.objects.get(email='test@example.com').id
    #
    #     response = self.client.post(self.register_url, self.therapist_data)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     therapist_login_response = self.client.post(self.login_url,
    #                                                 {'email': 'therapist@example.com', 'password': 'therapistpassword'})
    #     self.therapist_id = User.objects.get(email='therapist@example.com')
    #
    #     self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user_token)
    #     appointment_data = {
    #         'user': self.user_id,
    #         'therapist': self.therapist_id,
    #         'scheduled_time': '2024-10-10T14:00:00Z'
    #     }
    #     create_response = self.client.post(self.create_appointment_url, appointment_data)
    #     self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
    #     appointment_id = create_response.data['id']
    #
    #     # Update the appointment
    #     update_data = {
    #         'status': 'accepted',
    #         'user': self.user_id,
    #         'therapist_details': self.therapist_id
    #     }
    #
    #     update_appointment_url = self.update_appointment_url.format(pk=appointment_id)
    #     update_response = self.client.patch(
    #         update_appointment_url,
    #         json.dumps(update_data),
    #         content_type='application/json'
    #     )
    #     print(appointment_data)
    #     self.assertEqual(update_response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(update_response.data['status'], 'accepted')
    #
    #     # Optionally check that other fields were not inadvertently modified
    #     self.assertEqual(update_response.data['therapist'], self.therapist_id)
