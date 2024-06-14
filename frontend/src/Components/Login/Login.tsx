import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import styles from './Login.module.css'

function Login() {

    const [formData, setFormData] = useState({
        email: "",
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
            const url = 'http://127.0.0.1:8000/login/'
            const response = await axios.post(url, {
                email: formData.email,
                password: formData.password
            });
            if (response.status === 200) {
                localStorage.setItem('authToken', response.data.token)
                setAlert({
                    show: true,
                    message: "Login Successful",
                    variant: "success"
                });
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
                        variant: "danger"
                    });
                }
                else if (error.response?.status === 400) {
                    setAlert({
                        show: true,
                        message: "Bad Request. Please submit form again",
                        variant: "info"
                    });
                }
            }
            else {
                console.log(error)
            }
        }
    }

    return (
        <div className={styles.loginDiv}>
            <div id={styles.title}>
                <h1>Login</h1>
                { alert.show && <Alert variant={alert.variant} onClose={() => setAlert({ show: false, message:"", variant:""})} dismissible>{alert.message}</Alert>}
            </div>
            <Form onSubmit={handleSubmit} id={styles.form}>
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                    <Form.Control type="email" className='input' placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control type="password" className='input' placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </FloatingLabel>
                <div id={styles.formButtonDiv}>
                    <Button type='submit' className='input' id={styles.formButton}>Login</Button>
                </div>
            </Form>
            <div>
                <p>Don't have an account? <Link to={'/signup'}>Signup</Link></p>
            </div>
        </div>
    );

}

export default Login;