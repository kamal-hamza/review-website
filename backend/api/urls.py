from . import views
from django.urls import path

urlpatterns = [
    path('login/', views.login.as_view(), name='login'),
    path('signup/', views.signup.as_view(), name='signup'),
    path('products/', views.addProduct.as_view(), name='product'),
]