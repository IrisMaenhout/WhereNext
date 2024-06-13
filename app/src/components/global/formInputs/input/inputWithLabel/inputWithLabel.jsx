import React from 'react';
import styles from './inputWithLabel.module.css';

function InputWithLabel({name, labelText, value, handleChange}) {
    return (
        <div>
            <label className={styles.label} htmlFor={name}>{labelText}</label>
            <input type="text" value={value} id={name} name={name} className={styles.input} onChange={handleChange}/>
        </div>
    );
}

export default InputWithLabel;