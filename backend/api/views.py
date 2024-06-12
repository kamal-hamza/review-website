from rest_framework.authtoken.models import Token
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import loginSerializer
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
