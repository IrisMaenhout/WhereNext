import React from 'react';
import styles from './notFound404.module.css'; // Import the CSS module

function NotFound404() {
    return (
        <div className={styles.container}>
            <h1 className={styles.errorCode}>404</h1>
            <p className={styles.message}>Oops, this page does not exist or you need access from the owners of this page to view it.</p>
        </div>
    );
}

export default NotFound404;
