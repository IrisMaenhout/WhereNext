import React from 'react';
import { Link } from 'react-router-dom';
import styles from './placeDetailTabs.module.css';

function PlaceDetailTabs(props) {
    return (
        <div className={styles.tabs}>
            <Link to="" className={styles.activeTab}>Overview</Link>
            <Link to="">Visiting info</Link>
            <Link to="">Reviews</Link>
        </div>
    );
}

export default PlaceDetailTabs;