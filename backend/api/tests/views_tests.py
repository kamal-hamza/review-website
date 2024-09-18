import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from api.models import Product
from rest_framework.authtoken.models import Token

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.get_or_create(email='test@user.com', username='test', password='test1234')

@pytest.fixture
def token(user):
    return Token.objects.get_or_create(user=user[0])

@pytest.fixture
def data():
    return {
        'title': 'testProduct',
        'description': 'testDescription'
    }
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
        assert response.status_code == status.HTTP_409_CONFLICT
        assert 'error' in response.data

class TestCreateProduct:

    @pytest.mark.django_db
    def test_get_products(self, api_client):
        url = reverse('product-list')
        print(url)
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        
    @pytest.mark.django_db
    def test_create_product_valid(self, api_client, token, data):
        url = reverse('product-list')
        headers = { 'Authorization': f'Token {token[0]}' }
        response = api_client.post(url, data, headers=headers)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'success' in response.data

    @pytest.mark.django_db
    def test_create_product_without_description(self, api_client, token):
        url = reverse('product-list')
        headers = { 'Authorization': f'Token {token[0]}' }
        data = {
            'title': 'testproduct',
        }
        response = api_client.post(url, data, headers=headers)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'success' in response.data

    @pytest.mark.django_db
    def test_create_product_without_token(self, api_client, data):
        url = reverse('product-list')
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.django_db
    def test_create_product_with_invalid_token(self, api_client, data):
        url = reverse('product-list')
        headers = { 'Authorization': f'Token InvalidToken' }
        response = api_client.post(url, data, headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

class TestSearch:

    @pytest.mark.django_db
    def test_search_with_no_results(self, api_client):
        url = reverse('search')
        url += "?search=dygqsjndbjqasdasd"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert response.data is None

    @pytest.mark.django_db
    def test_search_with_results(self, api_client):
        Product.objects.create(title="test product", description="test description")
        url = reverse('search')
        print(url)
        url += "?search=test"
        print(url)
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data is not None