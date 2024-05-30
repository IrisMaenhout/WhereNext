import React, { useContext, useEffect, useState } from 'react';
import styles from './accomodations.module.css';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import PlaceCard from '../placeCard/PlaceCard';

function Accomodations(props) {

    const loggedInUser = useContext(LoggedInUserContext);

    const tripId = "6654e2621cbe496564c8192d";

    const [accomodations, setAccomodations] = useState([]);

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

          console.log(data);
          setAccomodations(data);
        //   setPlaces(data.places || []);
        } catch (error) {
        //   setError(error.message);
        }
      };
    
    useEffect(() => {
        getAccomodations();
    }, []);


    return (
        <div className={styles.suggestions}>

            <div className={styles.flexContainer}>
                <h1>Accomodations</h1>
                
            </div>
            
            
            <div className='gridPlanSidebar'>

                {
                    accomodations.length > 0 ?
                    accomodations.map((item)=> (
                        <PlaceCard key={`accomodations-${item._id}`} locationApiData={item} userId={loggedInUser._id}/>
                    ))

                    : 

                    <p>Here you can access your saved accomodations. Now there are no saved accomodations.</p>
                }
            </div>

            
        </div>
    );
}

export default Accomodations;
