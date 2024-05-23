import React from 'react';
import styles from './placeRating.module.css';

function PlaceRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
    }

    if (halfStars) {
        stars.push(<i key="half" className="fa-solid fa-star-half"></i>);
        stars.push(
            <div className={styles.halfColoredStar}>
                <i className={`fa-solid fa-star-half ${styles.colored}`}></i>
                <i className={`fa-regular fa-star-half ${styles.notColoredHalf}`}></i>
            </div>
        )

        if(emptyStars > 0){
            
        }
        for (let i = 0; i < emptyStars; i++) {
            // stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);

            <div className={styles.notColoredStars}>
                <i key={`empty-${i}`} className="fa-regular fa-star"></i>
            </div>
        }

    }else{
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
        }
    }

    

    return stars;
}

export default PlaceRating;
