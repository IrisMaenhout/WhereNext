import React from 'react';
import styles from '../secondarybtn.module.css';

function SecondaryBtn({children, style, onClick}) {
    return (
        <button className={`${styles.secondaryBtn} ${style}`} onClick={onClick}>
            {children}
        </button>
    )
    
}

export default SecondaryBtn;