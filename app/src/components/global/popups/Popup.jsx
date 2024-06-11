import React from 'react';
import styles from './popup.module.css';

function Popup({children, title, handleClose, classNames}) {
    return (
        <div className={styles.fixedContainer}>
            {/* <div className={styles.overlay}></div> */}
            {/* <div className={styles.popupContainer}> */}
                <div className={`${styles.popup} ${classNames}`}>
                    <div className={styles.top}>
                        <h2>{title}</h2>
                        <button onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                    
                    {children}
                </div>
            {/* </div> */}
            
            
        </div>
    );
}

export default Popup;