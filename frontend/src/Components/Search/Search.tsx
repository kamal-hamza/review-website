import React, { useState, useEffect, ReactEventHandler } from 'react';
import axios from 'axios';
import styles from './Search.module.css'
import { Link } from 'react-router-dom';
import { Alert, Dropdown, Form } from 'react-bootstrap';

function Search() {
    
    interface Product {
        id: number,
        title: string,
        description: string
    }

    const [results, setResults] = useState<Product[]>([]);
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        variant: ""
    });
    const [formData, setFormData] = useState({
        search: "",
    });

    const [showDropdown, setShowDropdown] = useState(false);

    const handleFocus = () => {
        setShowDropdown(true);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const formElement = document.querySelector('.form');
            if (formElement && !formElement.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    async function fetchResults(query: string) {
        try {
            const response = await axios.get(`http://127.0.0.1:8000//search/?search=${query}`);
            if (response.status === 200) {
                setResults(response.data);
            }
            else if (response.status === 204) {
                setResults([]);
            }
        } catch (error) {
            setAlert({
                show: true,
                message: "An error occured while fetching results",
                variant: "warning"
            });
        }
    }

    useEffect(() => {
        fetchResults(formData.search);
    }, [formData.search]);

    return (
        <div className={styles.search_div}>
            <div className={styles.title_div}>
                <h1 className={styles.title}>Search for a Product</h1>
            </div>
            {
                alert.show
                &&
                (
                    <div className={styles.alert_div}>
                        <Alert className={styles.alert} key={alert.variant} variant={alert.variant} dismissible onClose={(e) => {setAlert({ ...alert, show: false })}}>{alert.message}</Alert>
                    </div>
                )
            }
            <div className={styles.form_div}>
                <Form className='form'>
                    <Form.Group className='mb-3'>
                        <Form.Control type='text' placeholder='search' className={styles.form_item} name='search' id='search' value={formData.search} onChange={(e) => {setFormData({ ...formData, search: e.target.value })}} onFocus={handleFocus} />
                        {
                            showDropdown
                            &&
                            (
                                <Dropdown show={showDropdown}>
                                    <Dropdown.Menu className={styles.dropdown_div}>
                                        {results.map(result => (
                                            <Dropdown.Item as="div" key={result.id} className={styles.dropdown_item} role='button' tabIndex={0}>
                                                <Link to={`/products/${result.id}`} className={styles.link}>
                                                    {result.title}
                                                </Link>
                                            </Dropdown.Item>
                                        ))}
                                        {
                                            results.length < 4
                                            &&
                                            (
                                                <Dropdown.Item as="div" key={null} className={styles.dropdown_item} role='button' tabIndex={0}>
                                                    <Link to="/create-product" className={styles.link}>+ Add Product</Link>
                                                </Dropdown.Item>
                                            )
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            )
                        }
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default Search;