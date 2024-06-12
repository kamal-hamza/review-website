import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

class TestLogin:

    @pytest.mark.django_db
    def test_login_get(self, api_client):
        url = reverse('login')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.django_db
    def test_login_post_success(self, api_client):
        user = User.objects.create_user(email='test@example.com', username='testuser', password='12345')
        url = reverse('login')
        data = {
                'email': 'test@example.com',
                'password': '12345'
            }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'token' in response.data

    @pytest.mark.django_db
    def test_login_post_failure(self, api_client):
        url = reverse('login')
        data = {
                'email': 'wronguser@test.com',
                'password': 'wrongpassword'
            }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'error' in response.data
        assert response.data['error'] == 'Invalid Credentials'

class TestSignup:
    
    @pytest.mark.django_db
    def test_signup_get(self, api_client):
        url = reverse('signup')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.django_db
    def test_signup_post_success(self, api_client):
        url = reverse('signup')
        data = {
            'email': 'test@example.com',
            'username': 'test',
            'password': 'testpassword'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'token' in response.data

    @pytest.mark.django_db
    def test_signup_post_failure(self, api_client):
        url = reverse('signup')
        data = {
            'email': 'testexample.com',
            'username': 'test',
            'password': 'test'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'error' in response.data