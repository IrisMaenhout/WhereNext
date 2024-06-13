import React, { useState } from 'react';
import styles from './passwordInputWithLabel.module.css';

function PasswordInputWithLabel({name, value, labelText, handleChange}) {
    const [passwordShown , setPasswordShown ] = useState(false);

    function toggleVisibility(e) {
        e.preventDefault();
        setPasswordShown(prevState => !prevState);
    }
    
    return (
        <div>
            <label className={styles.label} htmlFor={name}>{labelText}</label>
            <div className={styles.passwordContainer}>
                <input type={passwordShown? "text": "password"} value={value} id={name} name={name} className={styles.input} onChange={handleChange}/>
                <button className={styles.toggleVisibilityBtn} onClick={toggleVisibility}>{passwordShown? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}</button>
            </div>
            
        </div>
    );
}

export default PasswordInputWithLabel;