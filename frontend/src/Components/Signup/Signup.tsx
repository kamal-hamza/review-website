import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';

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
        <div id={styles.signupDiv}>
            <div id={styles.titleDiv}>
                <h1 id={styles.title}>Signup</h1>
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
            <div id={styles.formDiv}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formItem}>
                        <input type='email' placeholder='Email Address' className={styles.input} name='email' id='email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}></input>
                    </div>
                    <div className={styles.formItem}>
                        <input type='text' placeholder='Username' className={styles.input} name='username' id='username' value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}></input>
                    </div>
                    <div className={styles.formItem}>
                        <input type='password' placeholder='Password' className={styles.input} name='password' id='password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}></input>
                    </div>
                    <div className={styles.formItem}>
                        <button className={styles.button} type='submit' name='submit' id='submit'>Sign Up</button>
                    </div>
                </form>
            </div>
            <div>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;