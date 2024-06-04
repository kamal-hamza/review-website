from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.contrib.auth import login, logout, authenticate
from django.http import JsonResponse
from .forms import loginForm

User = get_user_model()

# Create your views here.
def loginAuth(request):
    if request.method == 'POST':
        form = loginForm(data=request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, email=email, password=password)
            if user:
                userData = {
                    'id': str(user.id),
                    'email': user.email,
                    'username': user.username
                }
                login(request, user)
                return JsonResponse(userData, status=200)
            else:
                return JsonResponse({'error': 'Invalid Credentials'}, status=401)
        else:
            return JsonResponse({'error': 'Invalid form data'}, status=400)
    else:
       return JsonResponse({'error': 'Invalid request method'}, status=405) 