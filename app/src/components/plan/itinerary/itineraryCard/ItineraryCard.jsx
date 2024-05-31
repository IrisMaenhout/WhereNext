import React from 'react';
import styles from '../itinerary.module.css';
// import PlaceCard from '../placeCard/PlaceCard';
import PlaceCard from '../../placeCard/PlaceCard';
import SecondaryBtn from '../../../global/btns/secondary/btn/SecondaryBtn';

function ItineraryCard({ item, index, locationsFetched, loggedInUser, handleLocationFetched, openDirectionsInGoogleMaps, itineraryPlaces }) {
    return (
        <div key={`itineraryLocation-${item._id}`} className={styles.itineraryItem}>
            <div className={styles.stepMarker}>
                <span className={styles.stepNumber}>{index + 1}</span>
            </div>
            <PlaceCard 
                locationApiData={item} 
                userId={loggedInUser._id} 
                isSuggestion={false} 
                isItinerary={true}
                onLocationFetched={(location) => handleLocationFetched(index, location)}
            />
            <div className={styles.addAlternative}>
                <button className={styles.addAlternativeBtn}>Add alternative</button>
            </div>

            {!(itineraryPlaces.length === index + 1) && (
                <div className={styles.directions}>
                    <i className={`fi fi-br-walking ${styles.transportMethod}`}></i>
                    <span>6 min · 0.28 km</span>
                    <SecondaryBtn onClick={() => openDirectionsInGoogleMaps(locationsFetched[index], locationsFetched[index + 1])}>
                        Directions
                    </SecondaryBtn>
                </div>
            )}
        </div>
    );
}

export default ItineraryCard;
