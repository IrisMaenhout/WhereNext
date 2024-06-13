import React, { useContext, useState } from 'react';
import styles from '../itinerary.module.css';
import PlaceCard from '../../placeCard/PlaceCard';
import SecondaryBtn from '../../../global/btns/secondary/btn/SecondaryBtn';
import BucketListCard from '../../bucketList/bucketListCard/BucketListCard';
import { PlacesContext } from '../../../../context/LocationsContext';

function ItineraryCard({ item, index, locationsFetched, loggedInUser, handleLocationFetched, openDirectionsInGoogleMaps, itineraryPlaces, isSimpleCardView, moveCard, tripDayDates, handleDayChange, handleTimeChange }) {
    const { setPlaces } = useContext(PlacesContext);

    const handleClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div className={styles.itineraryItem}>
            <div className={styles.stepMarker}>
                <span className={styles.stepNumber}>{index + 1}</span>
            </div>

            <div className={styles.rearangeOrderContainer}>
                <div>
                    <select value={item.date} onChange={(e) => handleDayChange(index, e.target.value)}>
                        {tripDayDates.map(date => (
                            <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>
                        ))}
                    </select>
                    <input type="time" value={item.time || ''} onChange={(e) => handleTimeChange(index, e.target.value)} />
                </div>
                
                <div>
                    <button onClick={() => moveCard(index, 'up')} disabled={index === 0}><i className="fa-solid fa-angle-up"></i></button>
                    <button onClick={() => moveCard(index, 'down')} disabled={index === itineraryPlaces.length - 1}><i className="fa-solid fa-angle-down"></i></button>
                </div>

            </div>
            {isSimpleCardView ?
                <BucketListCard 
                    isCardViewSimple={true}
                    locationApiData={item}
                    userId={loggedInUser._id}
                    isItinerary={true}
                    setPlaces={setPlaces}
                />
                :
                <PlaceCard 
                    locationApiData={item} 
                    userId={loggedInUser._id} 
                    isSuggestion={false} 
                    isItinerary={true}
                    onLocationFetched={(location) => handleLocationFetched(index, location)}
                    setPlaces={setPlaces}
                />
            }
            
            <div className={styles.addAlternative}>
                <button className={styles.addAlternativeBtn} onClick={handleClick}>Add alternative</button>
            </div>
            {!(itineraryPlaces.length === index + 1) && (
                <div className={styles.directions}>
                    <i className={`fi fi-br-walking ${styles.transportMethod}`}></i>
                    <span>6 min · 0.28 km</span>
                    <SecondaryBtn onClick={(event) => { handleClick(event); openDirectionsInGoogleMaps(locationsFetched[index], locationsFetched[index + 1]); }}>
                        Directions
                    </SecondaryBtn>
                </div>
            )}
        </div>
    );
}

export default ItineraryCard;
