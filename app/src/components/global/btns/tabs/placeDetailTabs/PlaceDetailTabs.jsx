import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import styles from './placeDetailTabs.module.css';
import { LoggedInUserContext } from '../../../../../context/LoggedInUserContext';

function PlaceDetailTabs({selected}) {
    const location = useLocation();
    const { googlePlaceId, tripId} = useParams();

    const loggedInUser = useContext(LoggedInUserContext);
    const [isInDb, setIsInDb] = useState(undefined);

    const getPlace = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${googlePlaceId}/inTrip/${tripId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id
                }
            });

            if (!response.ok || response.status === 404) {
                setIsInDb(false);
                return;
            }

            setIsInDb(true);
            
        } catch (error) {
            console.error(error);
            setIsInDb(false);
        }
    };

    useEffect(()=>{
        getPlace();
    }, [])
    


    return (
        <div className={styles.tabs}>

            <Link to={`${location.pathname.substring(0, location.pathname.lastIndexOf('/'))}/overview`} className={selected === 'overview' && styles.activeTab}>Overview</Link>

            {isInDb && 
                <Link to={`${location.pathname.substring(0, location.pathname.lastIndexOf('/'))}/visiting-info`} className={selected === 'visiting-info' && styles.activeTab}>Visiting info</Link>
            }
            
            <Link to={`${location.pathname.substring(0, location.pathname.lastIndexOf('/'))}/reviews`} className={selected === 'reviews' && styles.activeTab}>Reviews</Link>
        </div>

    );
}

export default PlaceDetailTabs;