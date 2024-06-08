import React, { useContext, useEffect, useState } from 'react';
import BucketListCard from './bucketListCard/BucketListCard';

import { useLocation } from 'react-router-dom';
import PrimaryLinkBtn from '../../global/btns/primary/link/PrimaryLinkBtn';
import styles from './bucketList.module.css';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { PlacesContext } from '../../../context/LocationsContext';
import { Tooltip } from 'react-tooltip';
// import { LoggedInUserContext } from '../../../context/LoggedInUserContext';

function BucketList(props) {

    // const { loggedInUserData } = useContext(useLoggedInUserContext);

    const loggedInUser = useContext(LoggedInUserContext);
    const { places, setPlaces } = useContext(PlacesContext);
    const [ isCardViewSimple, setIsCardViewSimple ] = useState(true);

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

      const toggleCardView = () => {
        setIsCardViewSimple((isSimple)=> !isSimple);
      }


    return (
        <>
        <div>
            <div className={styles.flexContainer}>
                <h1>Bucketlist</h1>

                <div className={styles.topBtns}>
                  <button 
                    onClick={toggleCardView}
                    data-tooltip-id={`toggle-${!isCardViewSimple ? 'simple': 'voting'}-view-btn`}
                    data-tooltip-content={!isCardViewSimple ? 'Simple list': 'List for voting'}
                    className={styles.toggleCardView}
                  >
                    {
                      isCardViewSimple ?
                      <i className="fi fi-ss-people-poll"></i>
                      :
                      <i className="fi fi-rr-list"></i>
                    }
                  </button>
                  <PrimaryLinkBtn url={`${window.location.href}/suggestions`}>
                    Add
                  </PrimaryLinkBtn>
                </div>
                
            </div>

            <div className={`gridBucketListSidebar ${isCardViewSimple? 'gridSimpleCards' : 'gridVotingCards'}`}>
            { 
              bucketListItems.length > 0 &&
              bucketListItems.map((item)=> (
                  <BucketListCard key={`bucket-list-item-${item._id}`} locationApiData={item} userId={loggedInUser._id} setPlaces={setPlaces} isCardViewSimple={isCardViewSimple}/>
              ))
            }
            </div>
        </div>

      <Tooltip id={`toggle-${!isCardViewSimple ? 'simple': 'voting'}-view-btn`} border='1px solid #B0BDC7' style={{backgroundColor: '#EDF2FC', color: '#6C7886'}} place='bottom'/>
      </>
    );
}

export default BucketList;