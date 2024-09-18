import { useParams } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProductView.module.css'
import "bootstrap/dist/css/bootstrap.min.css"
import { Form, Button, ButtonGroup, Modal, Card } from 'react-bootstrap';
import { Star, StarFill, Check, X, ArrowReturnLeft } from 'react-bootstrap-icons';
import ReviewForm from '../ReviewForm/ReviewForm';
import Navigationbar from '../NavigationBar/NavigationBar';
import ReviewCard from '../ReviewCard/ReviewCard';

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
        title: String,
        isRecommended: boolean,
        comment: String,
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
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getProduct();
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
            window.location.reload();
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
        <div>
            <Navigationbar />
            <div className={styles.product_view_div}>
                <div className={styles.product_div}>
                    <h1 className={styles.product_title}>{product.title}</h1>
                    <p className={styles.product_description}>{product.description}</p>
                </div>
                {
                    currentUserReview
                    ?
                    (
                        <div>
                            <h1 className={styles.heading}>Your Review</h1>
                            <hr></hr>
                                <ReviewCard review={currentUserReview} />
                                <Button variant="primary" className={`${styles.button} ${styles.delete_review_button}`} onClick={handleDeleteReview}>Delete Review</Button>
                        </div>
                    )
                    :
                    (
                        <div className={styles.modal_div}>
                            <Button variant="primary" className={styles.form_button} onClick={() => setShowModal(true)}>Submit a Review</Button>
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Review Form</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className={styles.form_div}>
                                        <ReviewForm />
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>
                    )
                }
                <div className={styles.div_space}>
                    <h1 className={styles.heading}>Other Reviews</h1>
                    <hr></hr>
                    {
                        reviews.map(review => (
                            <ReviewCard review={review} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default ProductView;
