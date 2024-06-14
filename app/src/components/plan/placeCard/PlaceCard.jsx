import React, { useEffect, useState } from 'react';
import styles from './placeCard.module.css';
import SavePlaceBtn from '../../global/btns/savePlaceBtn/SavePlaceBtn';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

function PlaceCard({ place, isSuggestion, tripId, locationApiData, isItinerary, onLocationFetched, setPlaces}) {
    const navigate = useNavigate();
    const [googlePlaceData, setGooglePlaceData] = useState(place ? place : undefined);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function handleClick() {
        navigate(`/trip/${tripId}/place/${place ? place.id : locationApiData.googleLocationId}/overview`);
    }

    const fullStars = Math.floor(googlePlaceData?.rating);
    const halfStars = googlePlaceData?.rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    const [coverImage, setCoverImage] = useState('');

    const getGooglePlaceData = () => {
        fetch(`https://places.googleapis.com/v1/places/${locationApiData.googleLocationId}?fields=id,displayName,formattedAddress,photos,primaryType,types,location,rating,userRatingCount&languageCode=en&key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            setGooglePlaceData(data);
            console.log('GoogleData', data);
            
                setPlaces((prevPlacesArray) => (
                    [
                        ...prevPlacesArray,
                        data
                    ]
                ));
            
            if (data.location && onLocationFetched) {
                onLocationFetched(data.location);
            }
        });
    };

    useEffect(() => {
        if (!isSuggestion) {
            getGooglePlaceData();
        }
    }, []);

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
        if (googlePlaceData && googlePlaceData.photos?.length > 0) {
            getPictureUrl();
        }
    }, [googlePlaceData]);


    if (googlePlaceData !== undefined) {
        return (
            <>
            <div onClick={handleClick} className={`${styles.card} ${isItinerary ?'' : styles.suggestionsCard}`}>
                <div className={styles.topCard}>
                    <div className={styles.saveBtn} onClick={(e) => e.stopPropagation()}>
                        <SavePlaceBtn 
                            placeId={place ? place.id : locationApiData.googleLocationId} 
                            tripId={tripId ? tripId : locationApiData.tripId} 
                            position={"right"} 
                            isAccomodation={false}
                        />
                    </div>
                    <img src={coverImage} alt={googlePlaceData.displayName.text} />
                </div>
                <div className={styles.cardContent}>
                    <h3>{googlePlaceData.displayName.text}</h3>
                    {!isSuggestion && <p className={styles.time}>10:00 - 14:00</p>}
                    <div className={styles.rating}>
                        <div className={styles.stars} data-tooltip-id={`rating-place-${place ? place.id : locationApiData.googleLocationId}`} data-tooltip-content={`Rating: ${googlePlaceData.rating}`}>
                            {[...Array(fullStars)].map((_, i) => (
                                <i key={`place-full-star-${place ? place.id : locationApiData.googleLocationId}-${i}`} className={`fa-solid fa-star ${styles.colored}`}></i>
                            ))}
                            {halfStars === 1 && (
                                <>
                                    <div className={styles.halfColoredStar}>
                                        <i className={`fa-solid fa-star-half ${styles.colored}`}></i>
                                        <i className={`fa-regular fa-star-half ${styles.notColoredHalf}`}></i>
                                    </div>
                                    <div className={styles.notColoredStars}>
                                        {[...Array(emptyStars)].map((_, i) => (
                                            <i key={`place-empty-star-${place ? place.id : locationApiData.googleLocationId}-${i}`} className="fa-regular fa-star"></i>
                                        ))}
                                    </div>
                                </>
                            )}
                            {halfStars === 0 && (
                                [...Array(emptyStars)].map((_, i) => (
                                    <i key={`place-empty-star-${googlePlaceData.id}-${i}`} className="fa-regular fa-star"></i>
                                ))
                            )}
                        </div>
                        <p>({googlePlaceData.userRatingCount})</p>
                    </div>
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
            <Tooltip id={`rating-place-${place ? place.id : locationApiData.googleLocationId}`} border='1px solid #B0BDC7' style={{backgroundColor: '#EDF2FC', color: '#6C7886'}} place='bottom' opacity={1}/>
            {/* <Tooltip id={`price-place-${place ? place.id : locationApiData.googleLocationId}`}/> */}
            </>
        );
    } else {
        return <></>
    }
}

export default PlaceCard;
