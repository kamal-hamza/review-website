import axios from "axios";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductView from "./ProductView";
import userEvent from "@testing-library/user-event";


test('component renders correctly', () => {
    render(
        <BrowserRouter>
            <ProductView />
        </BrowserRouter>
    )
    expect(screen.getByText(/Other Reviews/i)).toBeInTheDocument()
});

test('clicking on the submit a review button opens the modal', () => {
    render(
        <BrowserRouter>
        <ProductView />
        </BrowserRouter>
    )
    const button  = screen.getByRole('button', {name: /submit a review/i})
    fireEvent.click(button)
    expect(screen.getByText(/review form/i)).toBeInTheDocument()
})