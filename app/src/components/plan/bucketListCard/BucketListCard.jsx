import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './bucketListCard.module.css';
import SavePlaceBtn from '../../global/btns/savePlaceBtn/SavePlaceBtn';

function BucketListCard(googlePlaceData, locationApiData) {
    const navigate = useNavigate();

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function handleClick() {
        navigate(`/place/${googlePlaceData.id}`);
    }

    const fullStars = Math.floor(googlePlaceData.rating);
    const emptyStars = 5 - fullStars;

    const [coverImage, setCoverImage] = useState('');


    const getPictureUrl = async () => {
        try {
            const response = await fetch(`https://places.googleapis.com/v1/${googlePlaceData.photos[0].name}/media?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&maxHeightPx=800&maxWidthPx=800`);
            
            if (response.ok) {
                setCoverImage(response.url);
            } else {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (googlePlaceData.photos.length > 0) {
            getPictureUrl();
        }
    }, []);

    return (
        <>
        <div onClick={handleClick} className={`${styles.card} ${styles.suggestionsCard}`}>
            <div className={styles.topCard}>
                <div className={styles.left}>
                    <div className={styles.saveBtn} onClick={(e) => e.stopPropagation()}>
                        <SavePlaceBtn />
                    </div>
                    <img src={coverImage} alt={googlePlaceData.displayName.text} />
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
                                    <p className={styles.category}>{capitalizeFirstLetter(googlePlaceData.types[1].replace('_', ' '))}</p>
                                    <p className={styles.moreCategories}>+ {googlePlaceData.types.length - 2}</p>
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

            <div className={styles.averageGroupInterestPercentage}>
                <p>Average group interest</p>
                <b className={styles.percentage}>83%</b>
            </div>

            <div className={styles.groupInterestGraph}>
                
            </div>

            <div className={styles.myInterestStars}>
                <p>My rating:</p>

                    <div className={styles.stars}>
                        {
                            [...Array(fullStars)].map((_, i) => (
                                <i key={`place-full-star-${googlePlaceData.id}-${i}`} className={`fa-solid fa-star ${styles.colored}`}></i>
                            ))}
                                
                            {[...Array(emptyStars)].map((_, i) => (
                                    <i key={`place-empty-star-${googlePlaceData.id}-${i}`} className="fa-regular fa-star"></i>
                                ))
                        }
                    </div>
            
                </div>
        </div>

        </>
    );
}

export default BucketListCard;