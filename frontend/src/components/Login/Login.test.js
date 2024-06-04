import { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from './Login';

// Mock axios.post to prevent actual API calls during testing
jest.mock('axios', () => ({
  post: jest.fn()
}));

describe('Login Component', () => {
  it('renders without crashing', () => {
    render(<Login />);
  });

  it('updates formData state on input change', () => {
    const { getByPlaceholderText } = render(<Login />);
    const emailInput = getByPlaceholderText('name@example.com');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('calls submitForm on form submission', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    const emailInput = getByPlaceholderText('name@example.com');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    // Mock the form submission handler
    const mockSubmitForm = jest.fn();
    Login.prototype.submitForm = mockSubmitForm;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockSubmitForm).toHaveBeenCalled();
    });
  });

  it('makes an API call with correct data on form submission', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    const emailInput = getByPlaceholderText('name@example.com');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('127.0.0.1:8000/login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
