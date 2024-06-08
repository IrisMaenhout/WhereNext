import React from 'react';
import styles from './minimalPlaceCard.module.css';
import SavePlaceBtn from '../../../global/btns/savePlaceBtn/SavePlaceBtn';

function MinimalPlaceCard({handleClick, googlePlaceId, tripId, coverImage, googlePlaceData}) {

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    return (
        <div className={styles.topCard} onClick={handleClick}>
            <div className={styles.left}>
                <div className={styles.saveBtn} onClick={(e) => e.stopPropagation()}>
                    <SavePlaceBtn 
                        placeId={googlePlaceId}
                        tripId={tripId} 
                        position={'left'}
                    />
                </div>
                {coverImage !== "" && <img src={coverImage} alt={googlePlaceData.displayName.text} />}
                        
            </div>
    
            <div className={styles.right}>
                <h3>{googlePlaceData.displayName.text}</h3>
                    
                <div className={styles.location}>
                    <i className="fi fi-rs-marker"></i>
                    <p>{googlePlaceData.formattedAddress}</p>
                </div>
    
                <div className={styles.categories}>
                    {googlePlaceData.types.length > 0 &&
                        (googlePlaceData.types.length > 2 ? (
                            <>
                                <p className={styles.category}>{capitalizeFirstLetter(googlePlaceData.types[0].replace('_', ' '))}</p>
                                    {/* <p className={styles.category}>{capitalizeFirstLetter(googlePlaceData.types[1].replace('_', ' '))}</p> */}
                                <p className={styles.moreCategories}>+ {googlePlaceData.types.length - 1}</p>
                            </>
                        ) : (
                            googlePlaceData.types.map((type, index) => (
                                <p key={index} className={styles.category}>{capitalizeFirstLetter(type.replace('_', ' '))}</p>
                            ))
                        ))
                    }
                </div>
            </div>
                    
        </div>
    );
}

export default MinimalPlaceCard;