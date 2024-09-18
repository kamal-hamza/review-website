from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import APIView
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework import status, viewsets
from .serializers import loginSerializer, signupSerializer, productSerializer, reviewSerializer
from .models import Product, Review
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

class login(APIView):
    
    def get(self, request):
        data = User.objects.all()
        serializer = loginSerializer(data, context={'request':request}, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = loginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                print("Logged in user:", user)
                return Response({'token': token.key, "id": user.id }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class signup(APIView):

    def get(self, request):
        data = User.objects.all()
        serializer = signupSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = signupSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                user = User.objects.get(email=serializer.validated_data['email'])
                token = Token.objects.create(user=user)
                return Response({'token': token.key, "id": user.id }, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'error': 'An error occured during signup'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            errors = serializer.errors
            if 'email' in errors:
                return Response({'error': errors['email'][0]}, status=status.HTTP_409_CONFLICT)
            else:
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            
            
class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all()
    serializer_class = productSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = productSerializer(data=request.data)
        if serializer.is_valid():
            try:
                token = request.auth.key if request.auth else None
                if token is not None:
                    user_token = Token.objects.get(key=token)
                    current_user = user_token.user
                    serializer.save()
                    return Response({'success': 'product created successfully'}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            except Token.DoesNotExist:
                return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(e)
                return Response({'error': 'An error occured during product creation'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            errors = serializer.errors
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({'success': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        

class search(ListAPIView):

    queryset = Product.objects.all()
    serializer_class = productSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title']

    def list(self, request, *args, **kwargs):
        search_param = request.query_params.get('search', None)
        if search_param == "":
            return Response(status=status.HTTP_204_NO_CONTENT)
        queryset = self.filter_queryset(self.get_queryset())
        if not queryset.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class getProduct(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        id = request.data.get('id')
        try:
            token = request.auth.key if request.auth else None
            if token is not None:
                user_token = Token.objects.get(key=token)
                current_user = user_token.user
                products = Product.objects.get(id=id)
                reviews = Review.objects.filter(product=products.id)
                product_serializer = productSerializer(products)
                review_serializer = reviewSerializer(reviews, many=True)
                print(review_serializer.data)
                return Response({ 'product': product_serializer.data, 'reviews': review_serializer.data }, status=status.HTTP_200_OK)
            else:
                return Response({ 'error': 'No token was provided' }, status=status.HTTP_401_UNAUTHORIZED)
        except KeyError as e:
            return Response({ 'error': e }, status=status.HTTP_400_BAD_REQUEST)
        
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = reviewSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                token = request.auth.key if request.auth else None
                if token is not None:
                    user_token = Token.objects.get(key=token)
                    current_user = user_token.user
                    serializer.save(user=current_user)
                    return Response({'success': 'Review created successfully'}, status=status.HTTP_201_CREATED)
            except Token.DoesNotExist:
                return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(e)
                return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({'success': 'Review deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
