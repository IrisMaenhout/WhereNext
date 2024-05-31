import React, { useContext, useEffect, useState } from 'react';
import styles from './itinerary.module.css';
import PrimaryLinkBtn from '../../global/btns/primary/link/PrimaryLinkBtn';
import PlaceCard from '../placeCard/PlaceCard';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { useLocation } from 'react-router-dom';
import SecondaryBtn from '../../global/btns/secondary/btn/SecondaryBtn';
import {DndContext} from '@dnd-kit/core';

function Itinerary(props) {
    const { state } = useLocation();
    const [itineraryPlaces, setItineraryPlaces] = useState([]);
    const loggedInUser = useContext(LoggedInUserContext);
    const tripId = "6654e2621cbe496564c8192d";
    const [forceRerenderCardComponent, setForceRenderCardComponent] = useState(state ? state : 0);
    const [locationsFetched, setLocationsFetched] = useState([]);
    

    // Rerender component when an item get removed from the itinerary
    useEffect(() => {
      // run side-effect
      function rerenderComponent(params) {
        setForceRenderCardComponent(state);
      }
      const timeout = setTimeout(rerenderComponent, 100);
      
      return () => clearTimeout(timeout);
    }, [state]);

    // getItinerary

    const getAccomodations = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/getItinerary/inTrip/${tripId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id,
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setItineraryPlaces(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAccomodations();
    }, [forceRerenderCardComponent]);


    function openDirectionsInGoogleMaps(origin, destination) {
        console.log('fetchedLoc', locationsFetched);
        console.log(origin, destination);
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition((position) => {
        //         const originCoords = `${position.coords.latitude},${position.coords.longitude}`;
        //         const destinationCoords = `${destinationLocation.latitude},${destinationLocation.longitude}`;
        //         // const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationCoords}`;
        //         const url = `https://www.google.com/maps/dir/${originCoords}/${destinationCoords}`
        //         window.open(url, '_blank');
        //     });
        // } else {
        //     alert('Geolocation is not supported by this browser.');
        // }
        

        const originCoords = `${origin.latitude},${origin.longitude}`;
        const destinationCoords = `${destination.latitude},${destination.longitude}`;
        // const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationCoords}`;
        const url = `https://www.google.com/maps/dir/${originCoords}/${destinationCoords}`
        window.open(url, '_blank');
    }


    const handleLocationFetched = (index, location) => {
        setLocationsFetched(prevLocations => {
            const newLocations = [...prevLocations];
            newLocations[index] = location;
            return newLocations;
        });
    };



    return (
        <DndContext>
        <div className={styles.itinerary}>
            <div className={styles.flexContainer}>
                <h1>Itinerary</h1>
                <PrimaryLinkBtn url={`${window.location.href}/suggestions`}>
                  Add
                </PrimaryLinkBtn>
            </div>

            <div className={styles.content}>
                {itineraryPlaces.length > 0 ?  itineraryPlaces.map((item, index) => (
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

                        {
                            !(itineraryPlaces.length === index + 1) &&

                            <div className={styles.directions}>
                                <i className={`fi fi-br-walking ${styles.transportMethod}`}></i>
                                <span>6 min · 0.28 km</span>
                                {/* <button className={styles.directionsBtn}>Directions</button> */}
                                <SecondaryBtn onClick={() => openDirectionsInGoogleMaps(locationsFetched[index], locationsFetched[index + 1])}>
                                    Directions
                                </SecondaryBtn>
                            </div>
                        }
                        
                        
                    </div>
                )) : <p>Here you can access your planed activities and restaurants.<br/>Right now there is nothing in the itinerary.</p>}
            </div>
        </div>
        </DndContext>
    );
}

export default Itinerary;