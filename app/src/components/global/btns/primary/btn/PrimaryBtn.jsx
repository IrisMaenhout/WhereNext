import React from 'react';
import styles from '../primaryBtn.module.css';

function PrimaryBtn({children, style, onClick}) {
    return (
        <button className={`${styles.primaryBtn} ${style}`} onClick={onClick}>
            {children}
        </button>
    )
    
}

export default PrimaryBtn;