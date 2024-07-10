import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Search.module.css'
import { Link } from 'react-router-dom';

function Search() {
    
    interface Product {
        id: number,
        title: string,
        description: string
    }

    const [results, setResults] = useState<Product[]>([]);
    const [status, setStatus] = useState(0);
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        variant: ""
    });
    const [formData, setFormData] = useState({
        search: "",
    });

    async function fetchResults(query: string) {
        try {
            const response = await axios.get(`http://127.0.0.1:8000//search/?search=${query}`);
            if (response.status === 200) {
                setStatus(200);
                setResults(response.data);
            }
            else if (response.status === 204) {
                setStatus(204);
                setResults([]);
            }
        } catch (error) {
            setAlert({
                show: true,
                message: "An error occured while fetching results",
                variant: "info"
            });
        }
    }

    useEffect(() => {
        if (formData.search !== "") {
            fetchResults(formData.search);
        }
        else {
            setShowDropDown(false);
        }
    }, [formData.search]);


    useEffect(() => {
        if (results.length > 0) {
            setShowDropDown(true);
        }
        else {
            setShowDropDown(false);
        }
    }, [results]);

    return (
        <div className={styles.searchDiv}>
        <div id={styles.titleDiv}>
            <h1 id={styles.title}>Search for a Product</h1>
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
            <div className={styles.formDiv}>
                <form>
                    <div className={styles.formItem}>
                        <input type='text' placeholder='Search' className={styles.input} name='search' id='search' value={formData.search} onChange={(e) => setFormData({ ...formData, search: e.target.value })}></input>
                    </div>
                    {
                        showDropDown
                        &&
                        status === 200
                        &&
                        (
                            <div className={styles.formItem} id={styles.resultBox}>
                                <ul className={styles.input}>
                                    {results.map(result => (
                                        <li key={result.id} className={styles.items}><Link id={styles.link} to={`/products/${result.id}`}>{result.title}</Link></li>
                                    ))}
                                    {
                                        results.length < 4
                                        &&
                                        (
                                            <li key={null} className={styles.items}><Link id={styles.link} to={"/create-product"}>+ Add Product</Link></li>
                                        )
                                    }
                                </ul>
                            </div>
                        )
                    }
                </form>
            </div>
        </div>   
    );
}

export default Search;