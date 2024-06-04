import pytest
from api.forms import loginForm

class TestLoginForm:

    def test_valid_form_submission(self):
        form_data = {'email': 'test@example.com', 'password': 'mysecretpassword'}
        form = loginForm(data=form_data)
        assert form.is_valid()

    def test_invalid_email_format(self):
        form_data = {'email': 'invalid-email', 'password': 'mysecretpassword'}
        form = loginForm(data=form_data)
        assert not form.is_valid()

    def test_empty_email_field(self):
        form_data = {'password': 'mysecretpassword'}
        form = loginForm(data=form_data)
        assert not form.is_valid()

    def test_empty_password_field(self):
        form_data = {'email': 'test@example.com'}
        form = loginForm(data=form_data)
        assert not form.is_valid()
