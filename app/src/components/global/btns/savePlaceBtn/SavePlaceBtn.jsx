import React, { useContext, useEffect, useState } from 'react';
import styles from './savePlaceBtn.module.css';
import { LoggedInUserContext } from '../../../../context/LoggedInUserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { nanoid } from "nanoid";

function SavePlaceBtn({placeId, tripId, position, isAccomodation}) {

    const loggedInUser = useContext(LoggedInUserContext);
    const [isContainerSaveToPagesBtnsActive, setIsContainerSaveToPagesBtnsActive] = useState(false);
    const navigate = useNavigate();
    const urlLocation = useLocation();

    const [savedPlanPages, setSavedPlanPages] = useState({
        bucketList: false,
        itinerary: false,
        accomodations: false
    });

    const [locationInDB, setLocationInDB] = useState(false);
    const [isClicked, setIsClicked] = useState(false);


    const uploadChangesInDb = async (updatedSavedPlanPages) => {
        try {
            
          const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${placeId}/edit/${tripId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'authorization': loggedInUser._id
            },
            body: JSON.stringify({
                savedLocation: updatedSavedPlanPages
            }),
          });
    
          if (!response.ok) {
            console.log(response);
            throw new Error(response.statusText);
          }
    
        //   const data = await response.json();
        //   console.log(data);
        } catch (error) {
            throw new Error(error);
          // setError(error.message);
        }
    };

    const createLocationInDb = async (updatedSavedPlanPages) => {
        try {
        const type = isAccomodation ? "accomodation" : "activity";
          const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${placeId}/addToTrip/${tripId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization': loggedInUser._id
            },
            body: JSON.stringify({
                type: type,
                savedLocation: updatedSavedPlanPages,
                isBooked: false
            }),
          });
    
          if (!response.ok) {
            console.log(response);
            throw new Error(response.statusText);
          }
    
          const data = await response.json();
        //   console.log(data);
          setLocationInDB(data.savedLocation ? true : false);
        } catch (error) {
            throw new Error(error);
        }
    };

    const getPlace = async () => {
        try {
            
          const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${placeId}/inTrip/${tripId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'authorization': loggedInUser._id
            }
          });
    
          if (!response.ok) {
            console.log(response);
            setLocationInDB(false);
          }
    
          const data = await response.json();
        //   console.log('get',data);
          setLocationInDB(data.savedLocation ? true : false);
          setSavedPlanPages(data.savedLocation || {
            bucketList: false,
            itinerary: false,
            accomodations: false
        });
        } catch (error) {
            // throw new Error(error);
          // setError(error.message);
        }
    };

    useEffect(()=>{
       getPlace(); 
    }, []);


    // const toggleSaveState = (key) => {
    //     setSavedPlanPages((prevState) => {
    //         const updatedState = { ...prevState, [key]: !prevState[key] };

    //         if (locationInDB) {
    //             uploadChangesInDb(updatedState);
    //         } else {
    //             createLocationInDb(updatedState);
    //         }

    //         return updatedState;
    //     });
    // };


    const toggleSaveState = (key) => {
        setSavedPlanPages((prevState) => ({
            ...prevState,
            [key]: !prevState[key]
        }));
        setIsClicked(true);
    };


    useEffect(() => {
        if(isClicked){
            if (locationInDB) {
                uploadChangesInDb(savedPlanPages);
            } else {
                createLocationInDb(savedPlanPages);
            }

            setIsClicked(false);
        }
        
    }, [savedPlanPages, locationInDB]);

    useEffect(()=>{
        navigate(urlLocation, { state: nanoid() }); 
    }, [savedPlanPages]);


    return (
        <>
        <button 
            className={styles.saveBtn} 
            onClick={(e)=>{
                e.stopPropagation();
                setIsContainerSaveToPagesBtnsActive((prev)=> !prev)
            }}
        >
            

            {
                savedPlanPages.bucketList || savedPlanPages.itinerary || savedPlanPages.accomodations ?
                <i className="fa-solid fa-bookmark"></i>

                : 

                <i className="fa-regular fa-bookmark"></i>
            }

        </button>


        {
            isContainerSaveToPagesBtnsActive &&

            <div className={`${styles.containerSaveToPagesBtns} ${position === "left" ? styles.left : styles.right}`}>
                <div className={styles.page}>
                    <div>
                        <i className="fi fi-rr-heart"></i>
                        <p>Bucketlist</p>
                    </div>

                    <button onClick={() => toggleSaveState('bucketList')}>
                        {
                            savedPlanPages.bucketList ?
                            <i className={`fi fi-ss-check-circle ${styles.addedBtn}`}></i>

                            :
                            <i className={`fi fi-rr-add ${styles.addBtn}`}></i>

                        }
                    </button>
                </div>
                <div className={styles.page}>
                    <div>
                        <i className="fi fi-sr-track"></i>
                        <p>Itinerary</p>
                    </div>

                    <button onClick={() => toggleSaveState('itinerary')}>
                        {
                            savedPlanPages.itinerary ?
                            <i className={`fi fi-ss-check-circle ${styles.addedBtn}`}></i>

                            :
                            <i className={`fi fi-rr-add ${styles.addBtn}`}></i>

                        }
                    </button>
                </div>
                <div className={styles.page}>
                    <div>
                        <i className="fi fi-rr-bed"></i>
                        <p>Accommodations</p>
                    </div>

                    <button onClick={() => toggleSaveState('accomodations')}>
                        {
                            savedPlanPages.accomodations ?
                            <i className={`fi fi-ss-check-circle ${styles.addedBtn}`}></i>

                            :
                            <i className={`fi fi-rr-add ${styles.addBtn}`}></i>

                        }
                    </button>
                </div>
            </div>
        }
        
        </>
    );
}

export default SavePlaceBtn;