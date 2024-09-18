import { ButtonGroup, Button } from "react-bootstrap";
import { Check, X, Star, StarFill } from "react-bootstrap-icons";
import styles from "./ReviewCard.module.css";

interface Review {
    id: number,
    username: String,
    title: String,
    isRecommended: boolean,
    comment: String,
    rating: number,
    created_at: String,
    user: number
}

interface ReviewCardProps {
    review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className={styles.review_div}>
            <div className={styles.review}>
                <div className={styles.review_body}>
                    <div className={styles.review_left}>
                        <h1 className={styles.review_main}>{review.username}</h1>
                        {/* Add date here */}
                        {
                            review.isRecommended ? (
                                <Check className={styles.review_sub} id={styles.review_icon} data-testid="review-icon-check" />
                            ) : (
                                <X className={styles.review_sub} id={styles.review_icon} data-testid="review-icon-x" />
                            )
                        }
                    </div>
                    <div className={styles.review_right}>
                        <div>
                            <ButtonGroup>
                                {
                                    [...Array(5)].map((_, index) => {
                                        index += 1;
                                        return index <= review.rating ? (
                                            <StarFill key={index} className={`${styles.star} text-muted`} data-testid="star-fill" />
                                        ) : (
                                            <Star key={index} className={`${styles.star} text-muted`} data-testid="star" />
                                        );
                                    })
                                }
                            </ButtonGroup>
                        </div>
                        <h1 className={styles.review_main}>{review.title}</h1>
                        <h1 className={styles.review_sub}>{review.comment}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewCard;