import { render, screen } from "@testing-library/react";
import { act } from "react";
import ProductView from "./ProductView";

function renderProductView() {
    act(() => {
        render(<ProductView />);
    })
}

test('component renders correctly', () => {
    renderProductView();
    expect(screen.getByText(/reviews:/i)).toBeInTheDocument();
});