import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
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
                localStorage.setItem('userID', response.data.id)
                setAlert({
                    show: true,
                    message: "Login Successful",
                    variant: "danger"
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
            
            <div id={styles.titleDiv}>
                <h1 id={styles.title}>Login</h1>
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
                        <input type='password' placeholder='Password' className={styles.input} name='password' id='password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}></input>
                    </div>
                    <div className={styles.formItem}>
                        <button className={styles.button} type='submit' name='submit' id='submit'>Login</button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default Login;