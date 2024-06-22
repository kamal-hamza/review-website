import pytest
from rest_framework.exceptions import ValidationError
from api.serializers import loginSerializer, signupSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

User = get_user_model()

@pytest.fixture
def test_user(db):
    user = User.objects.create(username='testuser', email='test@example', password='testpassword')
    return user

class TestLoginSerializer:

    def test_validate_success(self, test_user):
        data = {
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        serializer = loginSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data == data

    def test_validate_faliure(self, test_user):
        data = {
            'email': '',
            'password': ''
        }
        serializer = loginSerializer(data=data)
        assert not serializer.is_valid()
        assert 'email' in serializer.errors
        assert 'password' in serializer.errors

        
class TestSignupSerializer:

    def test_save(self, db):
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpassword'
        }
        serializer = signupSerializer(data=data)
        assert serializer.is_valid()
        user = serializer.save()
        assert user.username == serializer.validated_data['username']
        assert user.email == serializer.validated_data['email']
        assert check_password(serializer.validated_data['password'], user.password)

    def test_validate_failure(self, db):
        data = {
            'username': 'userwithoutemail'
        }
        serializer = signupSerializer(data=data)
        with pytest.raises(ValidationError):
            serializer.is_valid(raise_exception=True)