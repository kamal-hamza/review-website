import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import { Button } from 'react-bootstrap';

function Home() {
    return (
        <div className={styles.home_div}>
            <div className={styles.text_div}>
                <div className={styles.title_div}>
                    <h2 className={styles.title}>A website made to review EVERYTHING!</h2>
                </div>
                <div className={styles.desc_div}>
                    <h3 className={styles.desc}>Share your experiences and explore genuine reviews on products, services, places, and more, all in one place.</h3>
                </div>
            </div>
            <div>
                <div className={styles.button_div}>
                    <Link to="/signup"><Button className={styles.button} variant="primary">Signup</Button></Link>
                </div>
                <div className={styles.button_div}>
                    <Link to="/login"><Button className={styles.button} variant="primary">Login</Button></Link>
                </div>
            </div>
        </div>
    );
}

export default Home;