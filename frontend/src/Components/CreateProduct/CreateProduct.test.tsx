import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { act } from "react";
import axios from "axios";
import { render } from "@testing-library/react";
import CreateProduct from "./CreateProduct";

function renderCreateProduct() {
    act(() => {
        render(<CreateProduct />);
    })
}

beforeEach(() => {
    localStorage.setItem('authToken', 'testToken');
});

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('component renders correctly', () => {
    renderCreateProduct();
    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
});

test('form submission is correct', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });
    renderCreateProduct();
    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByText(/create/i));
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/create-product/',
            { title: 'Test Title', description: 'Test Description' },
            { headers: { 'Authorization': 'Token testToken' } },
        );
    });
});