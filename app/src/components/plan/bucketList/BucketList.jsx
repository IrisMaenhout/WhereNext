import React, { useContext, useEffect, useState } from 'react';
import BucketListCard from './bucketListCard/BucketListCard';
import { LoggedInUserContext, useLoggedInUserContext } from '../../../context/LoggedInUserContext';
// import { LoggedInUserContext } from '../../../context/LoggedInUserContext';

function BucketList(props) {

    // const { loggedInUserData } = useContext(useLoggedInUserContext);

    const loggedInUser = useContext(LoggedInUserContext);

    // console.log('loggedInUserData', loggedInUserData);
    const tripId = "6654e2621cbe496564c8192d";

    const [bucketListItems, setBucketListItems] = useState([]);

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
      }, []);



    return (
        <div>
            
            <h1>Bucketlist</h1>

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