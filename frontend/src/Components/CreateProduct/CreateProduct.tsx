import { useState } from 'react';
import styles from './CreateProduct.module.css'
import axios from 'axios';
import { Alert, Form, Button } from 'react-bootstrap';
import { ArrowReturnLeft } from 'react-bootstrap-icons';

function CreateProduct() {

    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        variant: ""
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (formData.title == "" || formData.description == "") {
            setAlert({
                show: true,
                message: "Please fill ou the form",
                variant: "warning"
            })
            return
        }
        try {
            const url = "http://127.0.0.1:8000/products/";
            const token = localStorage.getItem('authToken');
            const headers = {
                'Authorization': "Token " + token,
            }
            const response = await axios.post(url, {
                title: formData.title,
                description: formData.description
            }, { headers: headers })
            if (response.status === 201) {
                setAlert({
                    show: true,
                    message: "Product created successfully",
                    variant: "success"
                });
            }
        } catch (error) {
            if (error instanceof axios.AxiosError) {
                if (error.response?.status === 400) {
                    if ("No token" in error.response) {
                        setAlert({
                            show: true,
                            message: "No token was provided",
                            variant: "warning"
                        })
                    }
                    else if ("invalid token" in error.response) {
                        setAlert({
                            show: true,
                            message: "User not logged in",
                            variant: "danger"
                        })
                    }
                    else if ("creation" in error.response) {
                        setAlert({
                            show: true,
                            message: "There was an error creating the product, please try again",
                            variant: "warning",
                        })
                    }
                    else {
                        setAlert({
                            show: true,
                            message: error.response.data,
                            variant: "warning",
                        })
                    }
                }
            }
            else {
                console.log(error);
            }
        }
    }

    return (
        <div className={styles.createProduct_div}>
            <div id={styles.title_div}>
                <h1 id={styles.title}>Add Product</h1>
            </div>
            {
                alert.show
                &&
                (
                    <div className={styles.alert_div}>
                        <Alert className={styles.alert} key={alert.variant} variant={alert.variant} dismissible>{alert.message}</Alert>
                    </div>
                )
            }
            <div className={styles.form_div}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3' controlId='formTitle'>
                        <Form.Control type='text' placeholder='Name' className={styles.form_item} value={formData.title} onChange={(e) => {setFormData({ ...formData, title: e.target.value })}} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formDescription'>
                        <Form.Control type='text' placeholder='Description' className={styles.form_item} value={formData.description} onChange={(e) => {setFormData({ ...formData, description: e.target.value })}} />
                    </Form.Group>
                    <Button type='submit' className={styles.form_button}>Submit <ArrowReturnLeft></ArrowReturnLeft></Button>
                </Form>
            </div>
        </div>
    );
}

export default CreateProduct;