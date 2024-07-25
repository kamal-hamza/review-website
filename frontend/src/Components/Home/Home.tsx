import styles from './Home.module.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className={styles.homeDiv}>
            <h2>A website made to review EVERYTHING!</h2>
            <div className={styles.formDiv}>
                <Link to="login" className={styles.formButton}>Login</Link>
                <div className={styles.formItem}>
                    <button className={styles.formButton}>Signup</button>
                </div>
            </div>
        </div>
    );
}

export default Home;