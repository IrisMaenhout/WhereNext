import React from 'react';
import PlaceDetailTabs from '../../../global/btns/tabs/placeDetailTabs/PlaceDetailTabs';
import styles from './reviews.module.css';
import { Tooltip } from 'react-tooltip';
import PlaceDetailHeader from '../placeDetailHeader/PlaceDetailHeader';

function Reviews({googlePlaceData, googlePlaceId, tripId, handleGoBackArrowFunc}) {
   
    
    return (
        <div>
       
        
            <PlaceDetailHeader
                handleGoBackArrowFunc={handleGoBackArrowFunc} 
                googlePlaceData={googlePlaceData}
                googlePlaceId={googlePlaceId}
                tripId={tripId}
            />

            <PlaceDetailTabs selected={'reviews'}/>
            

            {
                googlePlaceData.reviews.map((review, i)=> {

                    const fullStars = Math.floor(review.rating);
                    const halfStars = review.rating % 1 !== 0 ? 1 : 0;
                    const emptyStars = 5 - fullStars - halfStars;
                    
                    return (
                    <div key={review.name} className={styles.reviewCard}>
                        <a href={review.authorAttribution.uri} target='_blank' rel="noreferrer" className="user">
                            <img src={review.authorAttribution.photoUri} alt="avatar" />
                            <p>{review.authorAttribution.displayName}</p>
                        </a>

                        <div className={styles.rating}>
                            <div className={styles.stars} data-tooltip-id={`rating-review-${review.name}`} data-tooltip-content={`Rating: ${review.rating}`}>
                                {[...Array(fullStars)].map((_, i) => (
                                    <i key={`place-full-star-${review.name}-${i}`} className={`fa-solid fa-star ${styles.colored}`}></i>
                                ))}
                                {halfStars === 1 && (
                                    <>
                                        <div className={styles.halfColoredStar}>
                                            <i className={`fa-solid fa-star-half ${styles.colored}`}></i>
                                            <i className={`fa-regular fa-star-half ${styles.notColoredHalf}`}></i>
                                        </div>
                                        <div className={styles.notColoredStars}>
                                            {[...Array(emptyStars)].map((_, i) => (
                                                <i key={`place-empty-star-${review.name}`} className="fa-regular fa-star"></i>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {halfStars === 0 && (
                                    [...Array(emptyStars)].map((_, i) => (
                                        <i key={`place-empty-star-${review.rating}`} className="fa-regular fa-star"></i>
                                    ))
                                )}
                            </div>
                            <p>{review.relativePublishTimeDescription}</p>
                        </div>

                        <p>{review.text.text}</p>

                    
                        <Tooltip id={`rating-review-${review.name}`} />
                    </div>)
                })
            }
        </div>
    );
}

export default Reviews;