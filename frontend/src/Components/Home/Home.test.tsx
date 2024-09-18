import { render, screen } from "@testing-library/react";
import { act } from "react";
import { BrowserRouter } from "react-router-dom";
import Home from "./Home";

test('component renders correctly', () => {
    render(
        <BrowserRouter>
            <Home />
        </BrowserRouter>
    )
    expect(screen.getByText(/a website made to review everything/i)).toBeInTheDocument()
})