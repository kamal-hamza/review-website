import { useParams } from 'react-router-dom';
import styles from './ProductView.module.css';
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

function ProductView() {
    const params = useParams();
    const ref = useRef<HTMLDivElement>(null);

    interface Product {
        id: number,
        title: String,
        description: String
    }

    interface Review {
        id: number,
        username: String,
        content: String,
        rating: number,
        created_at: String,
        user: number
    }

    const [product, setProduct] = useState<Product>({
        id: 0,
        title: "",
        description: ""
    });
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentUserReview, setCurrentUserReview]  = useState<Review | null>(null);
    const [formData, setFormData] = useState({
        rating: 0,
        comment: ""
    });

    const handleRatingClick = (event: MouseEvent) => {
        const span = (event.target as HTMLSpanElement);
        const spanContainer = ref.current;
        if (spanContainer) {
            const spans = spanContainer.querySelectorAll('span');
            spans.forEach(span => {
                span.removeAttribute('data-clicked');
            });
        }
        span.setAttribute('data-clicked', 'true');
        const rating = span.getAttribute('data-rating');
        setFormData((prevFormData) => ({
            ...prevFormData,
            rating: Number(rating),
        }));
    };

    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => {
        const spanContainer = ref.current;
        if (spanContainer) {
            const spans = spanContainer.querySelectorAll('span');
            spans.forEach(span => {
                span.addEventListener('click', handleRatingClick);
            });
        }
        return () => {
            if (spanContainer) {
                const spans = spanContainer.querySelectorAll('span');
                spans.forEach(span => {
                    span.removeEventListener('click', handleRatingClick);
                });
            }
        };
    }, []);

    async function getProduct() {
        try {
            const productID = params.id;
            const url = "http://127.0.0.1:8000/get-product/";
            const token = localStorage.getItem('authToken');
            const headers = {
                'Authorization': "Token " + token,
            };
            const response = await axios.post(url, { id: productID }, { headers: headers });
            if (response.status === 200) {
                setProduct(response.data.product);
                setReviews(response.data.reviews);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const url = "http://127.0.0.1:8000/reviews/";
            const data = {
                product: params.id,
                user: localStorage.getItem('userID'),
                content: formData.comment,
                rating: formData.rating,
            }
            const token = localStorage.getItem('authToken');
            const headers = {
                'Authorization': "Token " + token,
            }
            const response = await axios.post(url, data, { headers: headers })
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteReview() {
        console.log("called");
        const reviewId = currentUserReview?.id;
        try {
            const url = `http://127.0.0.1:8000/reviews/${reviewId}/`;
            const token = localStorage.getItem('authToken');
            const headers = {
                'Authorization': "Token " + token,
                'Content-Type': 'application/json',
            };
            const response = await axios.delete(url, { headers: headers });
            console.log('Review deleted successfully:', response.data);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    }

    useEffect(() => {
        const userID = localStorage.getItem('userID');
        const userReview = reviews.find(review => String(review.user) === userID);
        if (userReview) {
            setCurrentUserReview(userReview);
        } else {
            setCurrentUserReview(null);
        }
    }, [reviews]);

    return (
        <div className={styles.productViewDiv}>
            <div className={styles.product}>
                <h1>{product.title}</h1>
                <p>{product.description}</p>
            </div>
            <hr className={styles.line}></hr>
            {
                currentUserReview
                ?
                (
                    <div className={styles.userReview}>
                        <h5>Your Review:</h5>
                        <p>{currentUserReview.username}</p>
                        <p>{currentUserReview.rating}</p>
                        <p>{currentUserReview.content}</p>
                        <button className={styles.formButton} onClick={handleDeleteReview}>Delete Review</button>
                    </div>
                )
                :
                (
                    <div className={styles.formDiv}>
                        <form onSubmit={handleFormSubmit}>
                            <div className={styles.formItem}>
                                <textarea className={styles.input} onChange={(e) => { setFormData( {...formData, comment: e.target.value} ) }}></textarea>
                            </div>
                            <div className={`${styles.formItem} ${styles.ratings}`} ref={ref}>
                                <span data-rating='5'>★</span>
                                <span data-rating='4'>★</span>
                                <span data-rating='3'>★</span>
                                <span data-rating='2'>★</span>
                                <span data-rating='1'>★</span>
                            </div>
                            <div className={styles.formItem}>
                                <button type='submit' className={styles.formButton}>Submit Review</button>
                            </div>
                        </form>
                    </div>
                )
            }
            <hr className={styles.line}></hr>
            <div className={styles.reviw}>
                <h5>Reviews:</h5>
                {
                    reviews.map(review => (
                        <div key={review.id}>
                            <p>{review.username}</p>
                            <p>{review.rating}</p>
                            <p>{review.content}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ProductView;
