import React, { useEffect, useState } from 'react';
import styles from './placeCard.module.css';
import SavePlaceBtn from '../../global/btns/savePlaceBtn/SavePlaceBtn';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';


function PlaceCard({ place, isSuggestion, tripId }) {
    const navigate = useNavigate();

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function handleClick() {
        navigate(`/place/${place.id}`);
    }

    const fullStars = Math.floor(place.rating);
    const halfStars = place.rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    const [coverImage, setCoverImage] = useState('');


    const getPictureUrl = async () => {
        try {
            const response = await fetch(`https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&maxHeightPx=800&maxWidthPx=800`);
            
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
        if (place.photos.length > 0) {
            getPictureUrl();
        }
    }, []);
    

    return (
        <>
        <div onClick={handleClick} className={`${styles.card} ${styles.suggestionsCard}`}>
            <div className={styles.topCard}>
                <div className={styles.saveBtn} onClick={(e) => e.stopPropagation()}>
                    <SavePlaceBtn placeId={place.id} tripId={tripId} position={"right"}/>
                </div>
                <img src={coverImage} alt={place.displayName.text} />
            </div>

            <div className={styles.cardContent}>
                <h3>{place.displayName.text}</h3>
                {!isSuggestion && <p className={styles.time}>10:00 - 14:00</p>}

                {/* <div className={styles.priceRange}>
                    {(place.priceLevel && place.priceLevel === "PRICE_LEVEL_INEXPENSIVE") &&
                        <p data-tooltip-id={`price-place-${place.id}`} data-tooltip-content={`Pricing: cheap`}>€</p>
                    }
                    {(place.priceLevel && place.priceLevel === "PRICE_LEVEL_MODERATE") &&
                        <p data-tooltip-id={`price-place-${place.id}`} data-tooltip-content={`Pricing: moderate`}>€€</p>
                    }
                    {(place.priceLevel && place.priceLevel === "PRICE_LEVEL_EXPENSIVE") &&
                        <p data-tooltip-id={`price-place-${place.id}`} data-tooltip-content={`Pricing: expensive`}>€€€</p>
                    }
                    
                </div> */}
               
                <div className={styles.rating}>
                    <div className={styles.stars} data-tooltip-id={`rating-place-${place.id}`} data-tooltip-content={`Rating: ${place.rating}`}>
                        {[...Array(fullStars)].map((_, i) => (
                            <i key={`place-full-star-${place.id}-${i}`} className={`fa-solid fa-star ${styles.colored}`}></i>
                        ))}
                        {halfStars === 1 && (
                            <>
                                <div className={styles.halfColoredStar}>
                                    <i className={`fa-solid fa-star-half ${styles.colored}`}></i>
                                    <i className={`fa-regular fa-star-half ${styles.notColoredHalf}`}></i>
                                </div>
                                <div className={styles.notColoredStars}>
                                    {[...Array(emptyStars)].map((_, i) => (
                                        <i key={`place-empty-star-${place.id}-${i}`} className="fa-regular fa-star"></i>
                                    ))}
                                </div>
                            </>
                        )}
                        {halfStars === 0 && (
                            [...Array(emptyStars)].map((_, i) => (
                                <i key={`place-empty-star-${place.id}-${i}`} className="fa-regular fa-star"></i>
                            ))
                        )}
                    </div>
                    <p>({place.userRatingCount})</p>
                </div>

                

                <div className={styles.location}>
                    <i className="fi fi-rs-marker"></i>
                    <p>{place.formattedAddress}</p>
                </div>

                <div className={styles.categories}>
                    {place.types.length > 0 &&
                        (place.types.length > 2 ? (
                            <>
                                <p className={styles.category}>{capitalizeFirstLetter(place.types[0].replace('_', ' '))}</p>
                                <p className={styles.category}>{capitalizeFirstLetter(place.types[1].replace('_', ' '))}</p>
                                <p className={styles.moreCategories}>+ {place.types.length - 2}</p>
                            </>
                        ) : (
                            place.types.map((type, index) => (
                                <p key={index} className={styles.category}>{capitalizeFirstLetter(type.replace('_', ' '))}</p>
                            ))
                        ))
                    }
                </div>
            </div>
        </div>

        <Tooltip id={`rating-place-${place.id}`}/>
        <Tooltip id={`price-place-${place.id}`}/>
        </>
    );
}

export default PlaceCard;
