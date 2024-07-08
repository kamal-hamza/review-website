import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Login from './Login';

jest.mock('axios', () => ({
    post: jest.fn(),
}));

function renderLogin() {
    act(() => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )
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

test('submitting form calls handleSubmit function', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: 'some data' });
    renderLogin();

    // get the correct elements
    const email = screen.getByPlaceholderText(/email address/i);
    const password = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole('button', {name: 'Login'});

    // clear value fields
    await userEvent.clear(email);
    await userEvent.clear(password);

    // type correct info
    await userEvent.type(email, 'test@example.com');
    await userEvent.type(password, 'testpassword');
    fireEvent.click(button);
    
    // expect axios request
    expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/login/', {
        email: 'test@example.com',
        password: 'testpassword'
    });
});

test('submitting wrong form does not call handleSubmit function', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: 'some data' });
    renderLogin();

    // get the correct elements
    const email = screen.getByPlaceholderText(/email address/i);
    const password = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole('button', {name: 'Login'});

    // clear value fields
    await userEvent.clear(email);
    await userEvent.clear(password);

    // type incorrect info
    await userEvent.type(email, 'testexample.com');
    await userEvent.type(password, 'testpassword');
    fireEvent.click(button);
    
    // expect axios request
    expect(axios.post).not.toHaveBeenCalledWith('http://127.0.0.1:8000/login/', {
        email: 'test@example.com',
        password: 'testpassword'
    });
});