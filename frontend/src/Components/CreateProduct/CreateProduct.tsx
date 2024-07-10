import { useState } from 'react';
import styles from './CreateProduct.module.css'
import axios from 'axios';

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
        try {
            const url = "http://127.0.0.1:8000/create-product/";
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
                            variant: "info"
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
                            variant: "info",
                        })
                    }
                    else {
                        setAlert({
                            show: true,
                            message: error.response.data,
                            variant: "info",
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
        <div className={styles.createProductDiv}>
            <div id={styles.titleDiv}>
                <h1 id={styles.title}>Add Product</h1>
            </div>
            {
                alert.show
                &&
                (
                    <div className={styles.alertDiv}>
                        <div id={alert.variant} className={styles.alert}>
                                <div className={styles.alertText}>
                                    <span>{alert.message}</span>
                                </div>
                                <div className={styles.closeBtn}>
                                    <span  onClick={() => setAlert({ ...alert, show: false })}>&times;</span>
                                </div>
                        </div> 
                    </div>
                )
            }
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formItem}>
                        <input type='text' placeholder='Title' className={styles.input} name='title' id='title' value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}></input>
                    </div>
                    <div className={styles.formItem}>
                        <input type='text' placeholder='Description' className={styles.input} name='description' id='description' value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></input>
                    </div>
                    <div className={styles.formItem}>
                        <button className={styles.button} type='submit' name='submit' id='submit'>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateProduct;