import React, { useContext, useEffect, useState } from 'react';
import styles from '../itinerary.module.css';
import PlaceCard from '../../placeCard/PlaceCard';
import SecondaryBtn from '../../../global/btns/secondary/btn/SecondaryBtn';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BucketListCard from '../../bucketList/bucketListCard/BucketListCard';
import { PlacesContext } from '../../../../context/LocationsContext';

function ItineraryCard({ item, index, locationsFetched, loggedInUser, handleLocationFetched, openDirectionsInGoogleMaps, itineraryPlaces, isSimpleCardView }) {
    const { setPlaces } = useContext(PlacesContext);

    console.log('setPlaces function:', setPlaces);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item._id,
    });


    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 0.5 : 1,
        scale: isDragging ? 0.5 : 1,
    };

    const handleClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={`itineraryLocation-${item._id}`}
            className={styles.itineraryItem}
        >
            <div className={styles.stepMarker}>
                <span className={styles.stepNumber}>{index + 1}</span>
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
