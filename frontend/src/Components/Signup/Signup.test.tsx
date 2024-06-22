import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";

jest.mock('axios', () => ({
    post: jest.fn(),
}));

function renderSignup() {
    act(() => {
        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>
        )
    })
}

test('signup renders correctly', ()=> {
    // render the component
    renderSignup();
    // get an element with certain text
    const signUpElements = screen.getAllByText(/signup/i);
    signUpElements.forEach(element => {
        // check to see if component is in the DOM
        expect(element).toBeInTheDocument();
    });
});

test('submitting form calls handleSubmit function', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: 'some data' });
    renderSignup();

    // get the correct elements
    const email = screen.getByPlaceholderText(/email address/i);
    const username = screen.getByPlaceholderText(/username/i);
    const password = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole('button', {name: 'Sign Up'});

    // clear value fields
    await userEvent.clear(email);
    await userEvent.clear(username);
    await userEvent.clear(password);

    // type correct info
    await userEvent.type(email, 'test@example.com');
    await userEvent.type(username, 'testuser');
    await userEvent.type(password, 'testpassword');
    fireEvent.click(button);
    
    // expect axios request
    expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/signup/', {
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpassword'
    });
});

test('submitting wrong form does not call handleSubmit function', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: 'some data' });
    renderSignup();

    // get the correct elements
    const email = screen.getByPlaceholderText(/email address/i);
    const username = screen.getByPlaceholderText(/username/i);
    const password = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole('button', {name: 'Sign Up'});

    // clear value fields
    await userEvent.clear(email);
    await userEvent.clear(username);
    await userEvent.clear(password);

    // type correct info
    await userEvent.type(email, 'testexample.com');
    await userEvent.type(username, 'testuser');
    await userEvent.type(password, 'testpassword');
    fireEvent.click(button);
    
    // expect axios request
    expect(axios.post).not.toHaveBeenCalledWith('http://127.0.0.1:8000/signup/', {
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpassword'
    });
});