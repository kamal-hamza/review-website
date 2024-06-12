import { act } from 'react';
import userEvent from '@testing-library/user-event'
import { render, screen, fireEvent } from '@testing-library/react'
import axios from 'axios'
import Login from './Login'

jest.mock('axios', () => ({
    post: jest.fn(),
}));

function renderLogin() {
    act(() => {
        render(<Login />);
    });
}

test('Login renders correctly', () => {
    renderLogin();
    // get a component that is supposed to be rendered on screen
    const loginELements = screen.getAllByText(/login/i);
    loginELements.forEach(element => {
        // check to see if component is in the DOM
        expect(element).toBeInTheDocument();
    });
});

test('Login form calls axios request', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: 'some data' });
    renderLogin();

    // simulate submission of form
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    // check to see if axios sent a post request to the backend
    expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/login/', {
        email: 'test@example.com',
        password: 'password123'
    });
});

// test form with invalid data and error handling
test('Test invalid form credentials', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: 'some data' });
    renderLogin();

    // simulate submission of form
    await userEvent.type(screen.getByLabelText(/email address/i), 'testexample.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    // check to see if post request was not sent to the backend
    expect(axios.post).not.toHaveBeenCalledWith('http://127.0.0.1:8000/login/', {
        email: 'test@example.com',
        password: 'password123'
    });
})