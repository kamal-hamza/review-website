from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth import get_user_model

# Create your models here.

# custom user model
class customUserManager(BaseUserManager):
    
    def create_user(self, email, username, password, **kwargs):
        if not email:
            raise ValueError("All users must have an email")
        if not username:
            raise ValueError("All users must have a username")
        if not password:
            raise ValueError("All users must have a password")
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)
        kwargs.setdefault('is_active', True)

        if kwargs.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff set to True")
        if kwargs.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser set to True")
        if kwargs.get('is_active') is not True:
            raise ValueError("Superuser must have is_active set to True")
        
        return self.create_user(email, username, password, **kwargs)

class customUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.TextField(max_length=120)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = customUserManager()

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = [ 'username' ]

    def __str__(self):
        return self.email

 
# product database
class product(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(default="No Description")

    def __str__(self):
        return self.title

# review database
class review(models.Model):
    user = models.ForeignKey(customUser, on_delete=models.CASCADE)
    product = models.ForeignKey(product, on_delete=models.CASCADE)
    content = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_username()}'s review of {self.product.title}"