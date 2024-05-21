import React from 'react';
import { Link } from 'react-router-dom';
import styles from './subnav.module.css';

function Subnav(props) {
    return (
        <nav className={styles.subnav}>
            <Link to={''}>Bucketlist</Link>
            <Link to={''}>Itinerary</Link>
            <Link to={''}>Bucketlist</Link>
        </nav>
    );
}

export default Subnav;