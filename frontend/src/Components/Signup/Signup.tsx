import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { ArrowReturnLeft } from 'react-bootstrap-icons';

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: ""
    });

    const [alert, setAlert] = useState({
        show: false,
        message: "",
        variant: ""
    });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (formData.email === "" || formData.username === "" || formData.password === "") {
            setAlert({
                show: true,
                message: "Please fill out all fields.",
                variant: "danger"
            })
            return
        }
        if (!validateEmail(formData.email)) {
            setAlert({
                show: true,
                message: "Please enter a valid email.",
                variant: "warning"
            })
            return
        }
        if (formData.password.length < 6) {
            setAlert({
                show: true,
                message: "Password must be at least 6 characters long.",
                variant: "warning"
            })
            return
        }
        try {
            const url = 'http://127.0.0.1:8000/signup/'
            const response = await axios.post(url, {
                email: formData.email,
                username: formData.username,
                password: formData.password
            });
            if (response.status === 200) {
                const tokenKey: String = response.data.token
                const userID: number = response.data.id
                if (tokenKey != null && userID != null) {
                    localStorage.setItem('authToken', response.data.token)
                    localStorage.setItem('userID', response.data.id)
                    setAlert({
                        show: true,
                        message: "Signup Successful!",
                        variant: "success"
                    });
                    navigate("/search");
                }
            }
            else {
                console.log(response.status)
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setAlert({
                        show: true,
                        message: "A user already exists with this email!",
                        variant: "warning"
                    });
                }
                else if (error.response?.status === 400) {
                    setAlert({
                        show: true,
                        message: "Bad request. Please check the submitted data.",
                        variant: "danger"
                    });
                }
            }
            else {
                console.log(error)
            }
        }
    }

    return (
        <div className={styles.signup_div}>
            <div className={styles.div_title}>
                <h1 className={styles.title}>Signup</h1>
            </div>
            {
                alert.show
                &&
                (
                    <div className={styles.alert_div}>
                        <Alert className={styles.alert} key={alert.variant} variant={alert.variant} dismissible onClose={(e) => setAlert({ ...alert, show: false })}>{alert.message}</Alert>
                    </div>
                )
            }
            <div className={styles.form_div}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId='formEmail'>
                        <Form.Control className={styles.form_item} type='email' placeholder="test@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formUser'>
                        <Form.Control className={styles.form_item} type='text' placeholder='username' value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formPassword'>
                        <Form.Control className={styles.form_item} type='password' placeholder='password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </Form.Group>
                    <Button className={styles.form_button} variant='primary' type='submit'>Signup <ArrowReturnLeft></ArrowReturnLeft></Button>
                </Form>
            </div>
            <div className={styles.link_div}>
                <p className={styles.link_text}>Already have an account? <Link className={styles.link} to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;