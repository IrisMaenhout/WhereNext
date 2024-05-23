import React from 'react';
import { Link } from 'react-router-dom';
import styles from './subnav.module.css';

function Subnav(props) {
    return (
        <nav className={styles.subnav}>
            <Link to={''}><i className="fi fi-rr-heart"></i>Bucketlist</Link>
            <Link to={''}><i className="fi fi-sr-track"></i>Itinerary</Link>
            <Link to={''}><i className="fi fi-rr-bed"></i>Accommodations</Link>
        </nav>
    );
}

export default Subnav;