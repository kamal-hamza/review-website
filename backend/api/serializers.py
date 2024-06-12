from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _


User = get_user_model()

class loginSerializer(serializers.Serializer):
    email = serializers.EmailField(label=_("email"))
    password = serializers.CharField(
        label = _("password"),
        style = {'input type': 'password'},
        trim_whitespace = False,
        write_only = True
    )

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email and password:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')
        else:
            return data

class signupSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = '__all__'

    def save(self):
        email = self.validated_data.get('email')
        username = self.validated_data.get('username')
        password = make_password(self.validated_data.get('password'))
        user = User.objects.create(email=email, username=username, password=password)
        user.save()
        return user
