import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import styles from './Signup.module.css';

function Signup() {

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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const url = 'http://127.0.0.1:8000/signup/'
            const response = await axios.post(url, {
                email: formData.email,
                username: formData.username,
                password: formData.password
            });
            if (response.status === 200) {
                const tokenKey: String = response.data.token
                if (tokenKey != null) {
                    localStorage.setItem('authToken', response.data.token)
                    setAlert({
                        show: true,
                        message: "Signup Successful!",
                        variant: "success"
                    });
                }
            }
            else {
                console.log(response.status)
            }
        } catch (error: any) {
            if (error instanceof AxiosError) {
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
        <div className={styles.signupDiv}>
            <div id={styles.title}>
                <h1>Signup</h1>
                { alert.show && <Alert variant={alert.variant} onClose={() => setAlert({ show: false, message:"", variant:""})} dismissible>{alert.message}</Alert> }
            </div>
            <div className="alertDiv">

            </div>
            <Form onSubmit={handleSubmit} id={styles.form}>
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                    <Form.Control type="email" className='input' placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
                    <Form.Control type="text" className='input' placeholder="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control type="password" className='input' placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </FloatingLabel>
                <div id={styles.formButtonDiv}>
                    <Button type='submit' className='input' id={styles.formButton}>Sign Up</Button>
                </div>
            </Form>
            <div>
                <p>Already have an account? <Link to={'/login'}>Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;