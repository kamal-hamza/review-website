from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'reviews', views.ReviewViewSet, basename='review')
router.register(r'products', views.ProductViewSet, basename='product')

urlpatterns = [
    path('login/', views.login.as_view(), name='login'),
    path('signup/', views.signup.as_view(), name='signup'),
    path('search/', views.search.as_view(), name='search'),
    path('get-product/', views.getProduct.as_view(), name='get-product'),
    path('', include(router.urls)),
]