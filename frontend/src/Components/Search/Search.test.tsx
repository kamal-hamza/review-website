import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { act } from "react";
import Search from "./Search";
import axios from "axios";

function renderSearch() {
    act(() => {
        render(<Search />);
    });
}

jest.mock('axios');

test('component renders correctly', () => {
    renderSearch();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/search for a product/i)).toBeInTheDocument();
});

test('search function is called when change is detected in form field', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: [] });
    renderSearch();
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'the' } });
    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
            "http://127.0.0.1:8000//search/?search=the",
        );
    });
});

test('shows and hides alert', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));
    renderSearch();
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'test' } });
    await waitFor(() => {
        expect(screen.getByText(/An error occured while fetching results/i)).toBeInTheDocument();
    });
    const closeBtn = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeBtn)
    expect(screen.queryByText(/An error occured while fetching results/i)).not.toBeInTheDocument();
});