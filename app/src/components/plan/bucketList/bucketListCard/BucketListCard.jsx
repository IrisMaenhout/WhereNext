import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './bucketListCard.module.css';
import { Tooltip } from 'react-tooltip';
import ReactDOMServer from 'react-dom/server';
import MinimalPlaceCard from '../../placeCard/minimalPlaceCard/MinimalPlaceCard';
import PollStatistics from '../pollStatistics/PollStatistics';

function BucketListCard({locationApiData, userId, setPlaces, isCardViewSimple, isItinerary}) {
    const [googlePlaceData, setGooglePlaceData] = useState(null);
    const [locationApiDataUpToDate, setLocationApiDataUpToDate] = useState(locationApiData);
    const [coverImage, setCoverImage] = useState('');
    const numberOfTripMembers = 6;
    
    
    const navigate = useNavigate();


    function handleClick() {
        navigate(`/trip/${locationApiData.tripId}/place/${locationApiData.googleLocationId}/overview`);
    }


    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
    const getGooglePlaceData = () => {

        fetch(`https://places.googleapis.com/v1/places/${locationApiDataUpToDate.googleLocationId}?fields=id,displayName,formattedAddress,photos,primaryType,types,location&languageCode=en&key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            setGooglePlaceData(data);
            setPlaces((place)=> [...place, data]);
        });
    };

    const getPictureUrl = async () => {
        try {
            const response = await fetch(`https://places.googleapis.com/v1/${googlePlaceData.photos[0].name}/media?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&maxHeightPx=400&maxWidthPx=400`);
            if (response.ok) {
                setCoverImage(response.url);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch data depending on googlePlacesApi
    useEffect(()=> {
        getGooglePlaceData();
    }, []);

    useEffect(()=> {
         if (googlePlaceData && googlePlaceData.photos.length > 0) {
            getPictureUrl();
        }
    }, [googlePlaceData])


    const indexOfUser = locationApiDataUpToDate.interest.findIndex(e => e.user === userId.toString());

    const fullStars = indexOfUser > -1 ? Math.floor(locationApiDataUpToDate.interest[indexOfUser].rating) : 0;
    const emptyStars = 5 - fullStars;

    async function giveRating(rating){

        try{
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${locationApiDataUpToDate.googleLocationId}/addIndividualRating/${locationApiDataUpToDate.tripId}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                'authorization': userId
                },
                body: JSON.stringify({
                    rating: rating,
                    status: 'pending'
                }),
            });
    
          const data = await response.json();
          setLocationApiDataUpToDate(data);
        } catch (error) {
            throw new Error(error);
        }
    
    }

  

    if(!googlePlaceData){
        return <></>
    }else{
        return (
            <>
            <div className={`${styles.card} ${!isItinerary && styles.bucketListCard}`}>
                <MinimalPlaceCard 
                    handleClick={handleClick}
                    googlePlaceData={googlePlaceData}
                    tripId={locationApiDataUpToDate.tripId}
                    googlePlaceId={locationApiDataUpToDate.googleLocationId}
                    coverImage={coverImage}
                />
    

                {
                    !isCardViewSimple &&
                    
                    <>

                    <PollStatistics
                        numberOfTripMembers={numberOfTripMembers}
                        locationApiData={locationApiDataUpToDate}
                    />
        
                    <div className={styles.myInterestStars}>
                        <div className={styles.flexRatingTitle}>
                            <p>My rating:</p>

                            <i 
                                className={`fi fi-rr-info ${styles.infoRatingIcon}`}
                                data-tooltip-id='voting-info' 
                                // data-tooltip-content={tooltipInfoVotingText}
                                data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                                    <>
                                    <p><b>1 star:</b> I realy don't want to go, even when everyone else is going.</p>
                                    <p><b>2 stars:</b> I don't want to go but if everyone else is going, I will too.</p>
                                    <p><b>3 stars:</b> I don't care.</p>
                                    <p><b>4 stars:</b> I want to go, but I won't when noone else wants to.</p>
                                    <p><b>5 stars:</b> I really want to go, even when no one else goes with me.</p>
                                    </>
                                )}
                            
                            >
                            </i>
                        </div>
        
                        <div className={styles.stars}>
                            {
                                [...Array(fullStars)].map((_, i) => (
                                    <button key={`place-full-star-${googlePlaceData.id}-${i}`} onClick={() => giveRating(i+1)}>
                                        <i className={`fa-solid fa-star ${styles.colored}`}></i>

                                    </button>
                                    
                                ))}
                                        
                                {[...Array(emptyStars)].map((_, i) => (
                                
                                    <button key={`place-empty-star-${googlePlaceData.id}-${i}`} onClick={() => giveRating(i+fullStars+1)}>
                                        <i className="fa-regular fa-star"></i>
                                    </button>
                                ))
                                }
                        </div>
                    
                    </div>
                    
                    </>
                }
                
            </div>

            <Tooltip id={'voting-info'} place='top-start' border='1px solid #B0BDC7' style={{backgroundColor: '#EDF2FC'}}/>
    
            </>
        );

    }
    
}

export default BucketListCard;