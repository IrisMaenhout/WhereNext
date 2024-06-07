import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../placeDetails.module.css';
import SavePlaceBtn from '../../../global/btns/savePlaceBtn/SavePlaceBtn';
import { Tooltip } from 'react-tooltip';
import PlaceDetailTabs from '../../../global/btns/tabs/placeDetailTabs/PlaceDetailTabs';

function Overview({fullStars, halfStars, emptyStars, googlePlaceId, googlePlaceData, tripId, handleGoBackArrowFunc, coverImage}) {
    function splitString(str) {
        const index = str.indexOf(':');
        if (index !== -1) {
            return [str.substring(0, index + 1), str.substring(index + 1).trim()];
        }
        return [str];
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    return (
        <>
            <div className={styles.card}>
                    <div className={styles.topCard}>
                        <div className={styles.saveBtnContainer} onClick={(e) => e.stopPropagation()}>
                            <SavePlaceBtn placeId={googlePlaceId} tripId={tripId} position={"right"} />
                        </div>
                        <div className={styles.goBackArrowContainer} onClick={(e) => e.stopPropagation()}>
                            <button onClick={handleGoBackArrowFunc}><i className={`fi fi-sr-angle-left ${styles.goBackArrow}`}></i></button>
                        </div>
                        <img src={coverImage} alt={googlePlaceData.displayName.text} />
                    </div>
                    <div className={styles.cardContent}>
                        <h2>{googlePlaceData.displayName.text}</h2>
                        <div className={styles.rating}>
                            <div className={styles.stars} data-tooltip-id={`rating-place-${googlePlaceId}`} data-tooltip-content={`Rating: ${googlePlaceData.rating}`}>
                                {[...Array(fullStars)].map((_, i) => (
                                    <i key={`place-full-star-${googlePlaceId}-${i}`} className={`fa-solid fa-star ${styles.colored}`}></i>
                                ))}
                                {halfStars === 1 && (
                                    <>
                                        <div className={styles.halfColoredStar}>
                                            <i className={`fa-solid fa-star-half ${styles.colored}`}></i>
                                            <i className={`fa-regular fa-star-half ${styles.notColoredHalf}`}></i>
                                        </div>
                                        <div className={styles.notColoredStars}>
                                            {[...Array(emptyStars)].map((_, i) => (
                                                <i key={`place-empty-star-${googlePlaceId}-${i}`} className="fa-regular fa-star"></i>
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
                        <PlaceDetailTabs />
                        <div className={styles.extraInfo}>

                            <div className={styles.practicalInfo}>
                                <a href={googlePlaceData.websiteUri}>
                                    <div>
                                        <i className="fa-solid fa-route"></i>
                                    </div>
                                    
                                    <p>Route</p>
                                </a>
                                {googlePlaceData.websiteUri && <a href={googlePlaceData.websiteUri} target='_blank' rel="noreferrer">
                                    <div>
                                        <i className="fi fi-rr-globe" style={{marginBottom: "-.5rem"}}></i>
                                    </div>
                                    <p>Website</p>
                                </a>}
                                {googlePlaceData.internationalPhoneNumber && <a href={`tel:${googlePlaceData.internationalPhoneNumber}`}>
                                    <div><i className="fa-solid fa-phone"></i></div>
                                    <p>Call</p>
                                </a>}
                            </div>
                            <p>{googlePlaceData.editorialSummary ? googlePlaceData.editorialSummary.text : ""}</p>
                            {googlePlaceData.currentOpeningHours &&
                                <div className={styles.openingHoursContainer}>
                                    <h4>Openings hours</h4>
                                    <p>Currently: <b className={googlePlaceData.currentOpeningHours.openNow ? styles.open : styles.closed}>{googlePlaceData.currentOpeningHours.openNow ? "open" : "closed"}</b></p>

                                    <div className={styles.tableContainer}>
                                    <table>
                                        {googlePlaceData.currentOpeningHours.weekdayDescriptions.map((description, index) => {
                                            const [day, hours] = splitString(description);
                                            return (
                                                <tr key={index}>
                                                    <th>{day}</th>
                                                    <td>{hours}</td>
                                                </tr>
                                            );
                                        })}
                                    </table>

                                    </div>
                                
                                </div>
                            }

                            <div className={styles.categoriesContainer}>
                                <h4>Categories</h4>
                                <div className={styles.categories}>
                                    {googlePlaceData.types.length > 0 &&
                                        
                                        googlePlaceData.types.map((type, index) => (
                                            <p key={index} className={styles.category}>{capitalizeFirstLetter(type.replace('_', ' '))}</p>
                                        ))
                                    
                                    }
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <Tooltip id={`rating-place-${googlePlaceId}`} />
                <Tooltip id={`price-place-${googlePlaceId}`} />
        </>
    )
}

export default Overview;
