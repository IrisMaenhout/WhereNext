import React from 'react';
import styles from './filterBtn.module.css';

function FilterBtn({title, handleClick, isSelected}) {
    return (
        <button onClick={handleClick} className={`${styles.filterBtn} ${isSelected ? styles.selected : ''}`}>
            {title}
        </button>
    );
}

export default FilterBtn;