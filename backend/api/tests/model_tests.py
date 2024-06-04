import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestCustomUserModel:

    def test_create_user(self):
        user = User.objects.create_user('test@example.com', 'test', 'securepassword')
        assert user.email == 'test@example.com'
        assert user.username == 'test'
        assert not user.is_staff
        assert not user.is_superuser
        assert user.is_active
        assert user.check_password('securepassword')
    
    def test_create_superuser(self):
        superuser = User.objects.create_superuser('test@super.com', 'testsuper', 'superpassword')
        assert superuser.email == 'test@super.com'
        assert superuser.username == 'testsuper'
        assert superuser.is_staff
        assert superuser.is_superuser
        assert superuser.is_active
        assert superuser.check_password('superpassword')

    def test_delete_user(self):
        user = User.objects.create_user('delete@test.com', 'delete', 'deletepassword')
        userID = user.id
        user.delete()
        with pytest.raises(User.DoesNotExist):
            User.objects.get(id=userID)
    
    def test_filter_user_by_email(self):
        user = User.objects.create_user('user@example.com', 'username', 'userpassword')
        filteredUser = User.objects.filter(email='user@example.com').first()
        assert filteredUser is not None
        assert user == filteredUser
    
    def test_filter_user_by_username(self):
        user = User.objects.create_user('user2@example.com', 'username2', 'userpassword2')
        filteredUser = User.objects.filter(username='username2').first()
        assert filteredUser is not None
        assert user == filteredUser
    
