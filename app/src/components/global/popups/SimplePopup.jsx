import React from 'react';
import styles from './popup.module.css';

function SimplePopup({children, classNames}) {
    return (
        <div className={styles.fixedContainer}>
       
            <div className={`${styles.popup} ${classNames}`}>
                {children}
            </div>

        </div>
    );
}

export default SimplePopup;