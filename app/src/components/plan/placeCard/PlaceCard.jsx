import React, { useEffect, useState } from 'react';
import styles from './placeCard.module.css';
import SavePlaceBtn from '../../global/btns/savePlaceBtn/SavePlaceBtn';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';


function PlaceCard({ place, isSuggestion }) {
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
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/photo?photoreference=${place.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&maxheight=400&maxwidth=400`);
            
            if (response.ok) {
                const url = response.url;
                setCoverImage(url);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect(() => {
    //     if (place.photos.length > 0) {
    //         getPictureUrl();
    //     }
    // }, []);
    
    console.log(coverImage)
    // https://places.googleapis.com/v1/NAME/media?key=API_KEY&PARAMETERS

    return (
        <>
        <div onClick={handleClick} className={`${styles.card} ${styles.suggestionsCard}`}>
            <div className={styles.topCard}>
                <div className={styles.saveBtn} onClick={(e) => e.stopPropagation()}>
                    <SavePlaceBtn />
                </div>
                <img src="https://www.busreis-parijs.nl/wp-content/uploads/2014/09/Eiffeltoren-in-Parijs.jpg" alt="" />
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
