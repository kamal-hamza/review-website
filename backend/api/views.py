from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.contrib.auth import login
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework import status

from .forms import loginForm
from .serializers import loginAuthSerializer

User = get_user_model()

@api_view(['POST'])
def loginAuth(request):
    if request.method == 'POST':
        serializer = loginAuthSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                token, created = Token.objects.get_or_create(user=user)
                login(request, user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
