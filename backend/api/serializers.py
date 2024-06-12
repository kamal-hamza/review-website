from rest_framework import serializers
from django.contrib.auth import get_user_model

user = get_user_model()

class loginAuthSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = user
        fields = ['id', 'email', 'password']