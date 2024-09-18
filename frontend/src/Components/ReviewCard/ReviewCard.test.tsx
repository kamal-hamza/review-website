import { render, screen } from "@testing-library/react";
import ReviewCard from "./ReviewCard";
import { MemoryRouter } from "react-router-dom"; // Only needed if you have routing dependencies

// Sample review data for testing
const mockReview = {
  id: 1,
  username: "Test User",
  title: "Great Product",
  isRecommended: true,
  comment: "I really enjoyed using this product. Highly recommended!",
  rating: 4,
  created_at: "2023-09-01",
  user: 1
};

describe("ReviewCard Component", () => {
  const renderReviewCard = (review = mockReview) => {
    render(
      <MemoryRouter>
        <ReviewCard review={review} />
      </MemoryRouter>
    );
  };

  test("renders review username and title correctly", () => {
    renderReviewCard();

    expect(screen.getByText(mockReview.username)).toBeInTheDocument();
    expect(screen.getByText(mockReview.title)).toBeInTheDocument();
  });

  test("renders the correct number of filled stars for the rating", () => {
    renderReviewCard();

    const filledStars = screen.getAllByTestId("star-fill"); // Test-id for filled stars
    expect(filledStars).toHaveLength(mockReview.rating);

    const unfilledStars = screen.getAllByTestId("star"); // Test-id for empty stars
    expect(unfilledStars).toHaveLength(5 - mockReview.rating); // 5 stars total
  });

  test("shows the Check icon when the product is recommended", () => {
    renderReviewCard();

    const checkIcon = screen.getByTestId("review-icon-check"); // Add data-testid in JSX
    expect(checkIcon).toBeInTheDocument();
  });

  test("shows the X icon when the product is not recommended", () => {
    const notRecommendedReview = { ...mockReview, isRecommended: false };
    renderReviewCard(notRecommendedReview);

    const xIcon = screen.getByTestId("review-icon-x"); // Add data-testid in JSX
    expect(xIcon).toBeInTheDocument();
  });

  test("renders the review comment correctly", () => {
    renderReviewCard();

    expect(screen.getByText(mockReview.comment)).toBeInTheDocument();
  });
});