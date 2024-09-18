import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock('axios');  // This will mock the entire axios module

describe("ReviewForm Component", () => {
  const mockParams = { id: "1" };

  beforeEach(() => {
    // Mocking localStorage
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'authToken') return 'testToken';
      if (key === 'userID') return '1';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={[`/products/${mockParams.id}/review`]}>
        <Routes>
          <Route path="/products/:id/review" element={<ReviewForm />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test("renders the form elements correctly", () => {
    renderWithRouter();

    expect(screen.getByPlaceholderText(/review title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/product review/i)).toBeInTheDocument();
    expect(screen.getByText(/would you recommend this product to a friend/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit review/i })).toBeInTheDocument();
  });

  test("allows the user to select a star rating", () => {
    renderWithRouter();

    const starButton = screen.getByTestId("star-button-3");
    fireEvent.click(starButton);

    expect(starButton).toHaveClass("text-warning");
  });

  test("updates form data when typing", () => {
    renderWithRouter();

    const titleInput = screen.getByPlaceholderText(/review title/i);
    fireEvent.change(titleInput, { target: { value: "Great product!" } });

    expect(titleInput).toHaveValue("Great product!");

    const commentInput = screen.getByPlaceholderText(/product review/i);
    fireEvent.change(commentInput, { target: { value: "I really enjoyed this product." } });

    expect(commentInput).toHaveValue("I really enjoyed this product.");
  });

  test("submits the form successfully", async () => {
    // Mock axios.post to resolve successfully
    (axios.post as jest.Mock).mockResolvedValueOnce({
      status: 201
    });

    renderWithRouter();

    const starButton = screen.getByTestId("star-button-5");
    fireEvent.click(starButton);

    const titleInput = screen.getByPlaceholderText(/review title/i);
    fireEvent.change(titleInput, { target: { value: "Amazing product!" } });

    const commentInput = screen.getByPlaceholderText(/product review/i);
    fireEvent.change(commentInput, { target: { value: "Highly recommended!" } });

    const yesRadio = screen.getByLabelText(/yes/i);
    fireEvent.click(yesRadio);

    const submitButton = screen.getByRole("button", { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/reviews/",
        {
          product: mockParams.id,
          user: "1",
          comment: "Highly recommended!",
          rating: 5,
          isRecommended: true,
          title: "Amazing product!",
        },
        {
          headers: {
            Authorization: "Token testToken",
          },
        }
      );
    });
  });

  test("handles form submission failure", async () => {
    // Mock axios.post to reject the promise
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Submission failed"));

    renderWithRouter();

    const submitButton = screen.getByRole("button", { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });
});