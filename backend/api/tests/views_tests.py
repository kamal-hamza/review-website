# users/tests/test_views.py

import pytest
from django.contrib.auth import get_user_model
from django.test import RequestFactory
from api.views import loginAuth
from django.test import Client
from django.urls import reverse

User = get_user_model()

@pytest.mark.django_db
class TestLoginAuth:

    def test_valid_login(self):
        user = User.objects.create_user(email='test@example.com', username='test', password='mysecretpassword')
        client = Client()
        login_url = reverse('loginAuth')
        response = client.post(login_url, {'email': 'test@example.com', 'password': 'mysecretpassword'})
        assert response.status_code == 200
        assert 'id' in response.json()
        assert 'email' in response.json()
        assert 'username' in response.json()

    def test_invalid_credentials(self):
        client = Client()
        login_url = reverse('loginAuth')
        response = client.post(login_url, {'email': 'test@example.com', 'password': 'wrongpassword'})
        assert response.status_code == 401
        assert 'error' in response.json()

    def test_invalid_form_data(self):
        client = Client()
        login_url = reverse('loginAuth')
        response = client.post(login_url, {'email': 'invalid-email', 'password': ''})
        assert response.status_code == 400
        assert 'error' in response.json()

    def test_invalid_request_method(self):
        client = Client()
        login_url = reverse('loginAuth')
        response = client.get(login_url)
        assert response.status_code == 405
        assert 'error' in response.json()
