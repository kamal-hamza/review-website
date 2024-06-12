import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import './Login.css';

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    async function submitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const url = 'http://127.0.0.1:8000/login/'
            const response = await axios.post(url, {
                email: formData.email,
                password: formData.password
            });
            console.log(response.data.token)
            localStorage.setItem('authToken', response.data.token)
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='loginParent'>
            <div id='title'>
                <h1>Login</h1>
            </div>
            <Form onSubmit={submitForm} id='form'>
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                    <Form.Control type="email" className='input' placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control type="password" className='input' placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </FloatingLabel>
                <div id='submitDiv'>
                    <Button type='submit' className='input' id='button'>Login</Button>
                </div>
            </Form>
        </div>
    );

}

export default Login;