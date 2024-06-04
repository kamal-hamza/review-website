from django import forms

class loginForm(forms.Form):
    email = forms.EmailField(label='email')
    password = forms.CharField(widget=forms.PasswordInput, label='password')