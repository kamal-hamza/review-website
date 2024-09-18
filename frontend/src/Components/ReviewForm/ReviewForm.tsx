import styles from "./ReviewForm.module.css"
import { Form, Button, ButtonGroup } from "react-bootstrap";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star, StarFill } from "react-bootstrap-icons";

function ReviewForm() {

    const params = useParams();

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

    const [hover, setHover] = useState(0);

    const [formData, setFormData] = useState({
        rating: 0,
        title: "",
        isRecommended: false,
        comment: ""
    });

    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const url = "http://127.0.0.1:8000/reviews/";
            const data = {
                product: params.id,
                user: localStorage.getItem('userID'),
                comment: formData.comment,
                rating: formData.rating,
                isRecommended: formData.isRecommended,
                title: formData.title
            }
            const token = localStorage.getItem('authToken');
            const headers = {
                'Authorization': "Token " + token,
            }
            const response = await axios.post(url, data, { headers: headers })
            if (response.status === 201) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId='formRating' className='mb-3'>
                <ButtonGroup>
                    {
                        [...Array(5)].map((star, index) => {
                            index += 1;
                            return (
                                <Button data-testid={`star-button-${index}`} key={index} variant='link' className={index <= (hover || formData.rating) ? "text-warning" : "text-muted"} onClick={() => setFormData({ ...formData, rating: index })} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(formData.rating)}>{
                                    index <= (hover || formData.rating) ? (<StarFill className={`${styles.star} text-muted`} />) : (<Star className={`${styles.star} text-muted`} />)
                                }</Button>
                            );
                        })
                    }
                </ButtonGroup>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formTitle'>
                <Form.Control type='text' className={styles.form_item} value={formData.title} placeholder='review title' onChange={(e) => { setFormData({ ...formData, title: e.target.value }) }} />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formRecommended'>
                <p>Would you recommend this product to a friend?</p>
                <Form.Check type='radio' name='isRecommended' label="Yes" className={`${styles.form_item} ${styles.radio_item}`} onChange={(e) => { setFormData({ ...formData, isRecommended: e.target.checked }) }} />
                <Form.Check type='radio' name='isRecommended' label="No" className={`${styles.form_item} ${styles.radio_item}`} onChange={(e) => { setFormData({ ...formData, isRecommended: !e.target.checked }) }} />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Control as="textarea" type='text' className={styles.form_item} id={styles.text_area} value={formData.comment} placeholder='product review' onChange={(e) => { setFormData({ ...formData, comment: e.target.value }) }} />
            </Form.Group>
            <Button variant="primary" type='submit' className={styles.form_button}>Submit Review</Button>
        </Form>
    );
}

export default ReviewForm;