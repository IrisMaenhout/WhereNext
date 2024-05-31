import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from './accomodations.module.css';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import PlaceCard from '../placeCard/PlaceCard';
import { useLocation } from 'react-router-dom';
import PrimaryBtn from '../../global/btns/primary/btn/PrimaryBtn';
import PrimaryLinkBtn from '../../global/btns/primary/link/PrimaryLinkBtn';

function Accomodations(props) {
    const { state } = useLocation();
    const loggedInUser = useContext(LoggedInUserContext);
    const tripId = "6654e2621cbe496564c8192d";
    const [accomodations, setAccomodations] = useState([]);
    const [forceRerenderCardComponent, setForceRenderCardComponent] = useState(state ? state : 0);

    // const urlLocation = useLocation();
 


    

    useEffect(() => {
      // run side-effect
      function rerenderComponent(params) {
        setForceRenderCardComponent(state);
      }
      const timeout = setTimeout(rerenderComponent, 100);
      
      return () => clearTimeout(timeout);
    }, [state]);

    const getAccomodations = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/getAccomodations/inTrip/${tripId}`, {
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
            setAccomodations(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAccomodations();
    }, [forceRerenderCardComponent]);

    return (
        <div className={styles.suggestions}>
            <div className={styles.flexContainer}>
                <h1>Accomodations</h1>
                <PrimaryLinkBtn url={`${window.location.href}/suggestions`}>
                  Add
                </PrimaryLinkBtn>
            </div>
            <div className='gridPlanSidebar'>
                {accomodations.length > 0 ? accomodations.map((item) => (
                    <PlaceCard 
                        key={`accomodations-${item._id}`} 
                        locationApiData={item} 
                        userId={loggedInUser._id} 
                        isSuggestion={false} 
                    />
                )) : <p>Here you can access your saved accomodations. Now there are no saved accomodations.</p>}
            </div>
        </div>
    );
}

export default Accomodations;
