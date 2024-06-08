import { useEffect, useState } from 'react';
import axios from 'axios';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FloatingLabel } from 'react-bootstrap';

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    async function submitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const response = await axios.post('127.0.0.1:8000/login', {
                email: formData.email,
                password: formData.password
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Form onSubmit={submitForm}>
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                    <Form.Control type="email" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </FloatingLabel>
                <Button type='submit' id='button'>Login</Button>
            </Form>
        </div>
    );

}

export default Login;