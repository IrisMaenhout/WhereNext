import React, { useContext, useEffect, useState } from 'react';
import BucketListCard from './bucketListCard/BucketListCard';
import { LoggedInUserContext, useLoggedInUserContext } from '../../../context/LoggedInUserContext';
import { useLocation } from 'react-router-dom';
import PrimaryLinkBtn from '../../global/btns/primary/link/PrimaryLinkBtn';
import styles from './bucketList.module.css';
// import { LoggedInUserContext } from '../../../context/LoggedInUserContext';

function BucketList(props) {

    // const { loggedInUserData } = useContext(useLoggedInUserContext);

    const loggedInUser = useContext(LoggedInUserContext);

    // console.log('loggedInUserData', loggedInUserData);
    const tripId = "6654e2621cbe496564c8192d";

    const [bucketListItems, setBucketListItems] = useState([]);

    const { state } = useLocation();
    const [forceRerenderCardComponent, setForceRenderCardComponent] = useState(state ? state : 0);


    useEffect(() => {
      // run side-effect
      function rerenderComponent(params) {
        setForceRenderCardComponent(state);
      }
      const timeout = setTimeout(rerenderComponent, 100);
      
      return () => clearTimeout(timeout);
    }, [state]);


    const getBucketListItems = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/getBucketList/inTrip/${tripId}`, {
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
          setBucketListItems(data);
        //   setPlaces(data.places || []);
        } catch (error) {
        //   setError(error.message);
        }
      };
    
      useEffect(() => {
        getBucketListItems();
      }, [forceRerenderCardComponent]);



    return (
        <div>
            <div className={styles.flexContainer}>
                <h1>Bucketlist</h1>
                <PrimaryLinkBtn url={`${window.location.href}/suggestions`}>
                  Add
                </PrimaryLinkBtn>
            </div>

            <div className='gridBucketListSidebar'>
            {
              bucketListItems.length > 0 &&
              bucketListItems.map((item)=> (
                  <BucketListCard key={`bucket-list-item-${item._id}`} locationApiData={item} userId={loggedInUser._id}/>
              ))
            }
            </div>
        </div>
    );
}

export default BucketList;