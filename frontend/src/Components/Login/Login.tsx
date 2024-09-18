import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css'
import { Alert, Form, Button } from 'react-bootstrap';
import { ArrowReturnLeft } from 'react-bootstrap-icons';

function Login() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
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
        if (formData.email === "" || formData.password === "") {
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
        // if (formData.password.length < 6) {
        //     setAlert({
        //         show: true,
        //         message: "Password must be at least 6 characters long.",
        //         variant: "warning"
        //     })
        //     return
        // }
        try {
            const url = 'http://127.0.0.1:8000/login/'
            const response = await axios.post(url, {
                email: formData.email,
                password: formData.password
            });
            if (response.status === 200) {
                localStorage.setItem('authToken', response.data.token)
                localStorage.setItem('userID', response.data.id)
                setAlert({
                    show: true,
                    message: "Login Successful!",
                    variant: "success"
                });
                navigate("/search");
            }
            else {
                console.log(response.status)
            }
        } catch (error: any) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    setAlert({
                        show: true,
                        message: "Invalid Credentials",
                        variant: "warning"
                    });
                }
                else if (error.response?.status === 400) {
                    setAlert({
                        show: true,
                        message: "Bad Request. Please submit form again",
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
        <div className={styles.login_div}>
            
            <div className={styles.title_div}>
                <h1 className={styles.title}>Login</h1>
            </div>
            {
                alert.show
                &&
                (
                    <div className={styles.alert_div}>
                        <Alert key={alert.variant} variant={alert.variant} dismissible onClose={(e) => {setAlert({ ...alert, show: false })}}>{alert.message}</Alert>
                    </div>
                )
            }
            <div className={styles.form_div}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3' controlId='formEmail'>
                        <Form.Control type='email' placeholder='test@example.com' className={styles.form_item} value={formData.email} onChange={(e) => {setFormData({ ...formData, email: e.target.value })}}/>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formPassword'>
                        <Form.Control type='password' placeholder='password' className={styles.form_item} value={formData.password} onChange={(e) => {setFormData({ ...formData, password: e.target.value })}} />
                    </Form.Group>
                    <Button type='submit' className={styles.form_button} variant='primary'>Login <ArrowReturnLeft></ArrowReturnLeft></Button>
                </Form>
            </div>
            <div className={styles.link_div}>
                <p className={styles.link_text}>Don't have an account? <Link className={styles.link} to="/signup">Signup</Link></p>
            </div>
        </div>
    );

}

export default Login;