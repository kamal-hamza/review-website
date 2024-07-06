from . import views
from django.urls import path

urlpatterns = [
    path('login/', views.login.as_view(), name='login'),
    path('signup/', views.signup.as_view(), name='signup'),
    path('create-product/', views.createProduct.as_view(), name='create-product'),
    path('search/', views.search.as_view(), name='search'),
]