import React from 'react';
import styles from '../primaryBtn.module.css';
import { Link } from 'react-router-dom';

function PrimaryLinkBtn({style, children, url}) {
    return (
        <Link to={url} className={`${styles.primaryBtn} ${style}`}>
            {children}
        </Link>
    );
}

export default PrimaryLinkBtn;