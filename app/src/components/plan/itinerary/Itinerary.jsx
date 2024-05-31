import React, { useContext, useEffect, useState } from 'react';
import styles from './itinerary.module.css';
import PrimaryLinkBtn from '../../global/btns/primary/link/PrimaryLinkBtn';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { useLocation } from 'react-router-dom';
import SecondaryBtn from '../../global/btns/secondary/btn/SecondaryBtn';
import { DndContext } from '@dnd-kit/core';
import ItineraryCard from './itineraryCard/ItineraryCard';

function Itinerary(props) {
    const { state } = useLocation();
    const [itineraryPlaces, setItineraryPlaces] = useState([]);
    const loggedInUser = useContext(LoggedInUserContext);
    const tripId = "6654e2621cbe496564c8192d";
    const [forceRerenderCardComponent, setForceRenderCardComponent] = useState(state ? state : 0);
    const [locationsFetched, setLocationsFetched] = useState([]);

    // Rerender component when an item get removed from the itinerary
    useEffect(() => {
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
        const originCoords = `${origin.latitude},${origin.longitude}`;
        const destinationCoords = `${destination.latitude},${destination.longitude}`;
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
                    {itineraryPlaces.length > 0 ? itineraryPlaces.map((item, index) => (
                        <ItineraryCard
                            key={item._id}
                            item={item}
                            index={index}
                            locationsFetched={locationsFetched}
                            loggedInUser={loggedInUser}
                            handleLocationFetched={handleLocationFetched}
                            openDirectionsInGoogleMaps={openDirectionsInGoogleMaps}
                            itineraryPlaces={itineraryPlaces}
                        />
                    )) : <p>Here you can access your planned activities and restaurants.<br />Right now there is nothing in the itinerary.</p>}
                </div>
            </div>
        </DndContext>
    );
}

export default Itinerary;
