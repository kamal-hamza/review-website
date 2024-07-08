from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import APIView
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework import status
from .serializers import loginSerializer, signupSerializer, productSerializer, reviewSerializer
from .models import product, review
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
                return Response({'token': token.key}, status=status.HTTP_200_OK)
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
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'error': 'An error occured during signup'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            errors = serializer.errors
            if 'email' in errors:
                return Response({'error': errors['email'][0]}, status=status.HTTP_409_CONFLICT)
            else:
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            
class createProduct(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        data = product.objects.all()
        serializer = productSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = productSerializer(data=request.data)
        if serializer.is_valid():
            try:
                token = request.auth.key if request.auth else None
                if token is not None:
                    print(token)
                    user_token = Token.objects.get(key=token)
                    current_user = user_token.user
                    serializer.save()
                    return Response({'success': 'product created successfully'}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
            except Token.DoesNotExist:
                return Response({'error': 'invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                print(e)
                return Response({'error': 'An error occured during product creation'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            errors = serializer.errors
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

# class search(ListAPIView):

#     queryset = product.objects.all()
#     serializer_class = productSerializer
#     filter_backends = [SearchFilter]
#     search_fields = ['title']

# class getProduct(APIView):

#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticatedOrReadOnly]

#     def get(self, request, id):
#         print(id)