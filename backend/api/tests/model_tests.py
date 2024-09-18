import pytest
from django.contrib.auth import get_user_model
from api.models import Product

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

@pytest.mark.django_db
class TestProductModel:

    def test_create_product(self):
        test = Product.objects.create(title='title', description='description')
        assert test.title == 'title'
        assert test.description == 'description'

    def test_create_product_without_description(self):
        test = Product.objects.create(title='title')
        assert test.title == 'title'
        assert test.description == 'No Description'
    
    def test_delete_product(self):
        test = Product.objects.create(title='title', description='description')
        title = test.title
        test.delete()
        with pytest.raises(Product.DoesNotExist):
            Product.objects.get(title=title)
    
    def filter_product_by_title(self):
        test = Product.objects.create(title='title', description='description')
        filteredTest = Product.objects.filter(title='title')
        assert filteredTest is not None
        assert test == filteredTest
    
    def filter_product_by_description(self):
        test = Product.objects.create(title='title', description='description')
        filteredTest = Product.objects.filter(description='description')
        assert filteredTest is not None
        assert test == filteredTest