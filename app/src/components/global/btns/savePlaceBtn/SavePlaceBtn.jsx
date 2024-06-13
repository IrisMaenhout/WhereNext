import React, { useContext, useEffect, useState } from 'react';
import styles from './savePlaceBtn.module.css';
import { LoggedInUserContext } from '../../../../context/LoggedInUserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { nanoid } from "nanoid";
import Popup from '../../popups/Popup';
import PrimaryBtn from '../primary/btn/PrimaryBtn';

function SavePlaceBtn({ placeId, tripId, position, isAccomodation }) {
    const loggedInUser = useContext(LoggedInUserContext);
    const [isContainerSaveToPagesBtnsActive, setIsContainerSaveToPagesBtnsActive] = useState(false);
    const navigate = useNavigate();
    const urlLocation = useLocation();
    const [isItineraryPopupVisible, setIsItineraryPopupVisible] = useState(false);

    const [savedPlanPages, setSavedPlanPages] = useState({
        bucketList: false,
        itinerary: false,
        accomodations: false
    });

    const [locationInDB, setLocationInDB] = useState(false);
    const [datesArray, setDatesArray] = useState([]);
    const [popupFormData, setPopupFormData] = useState({
        date: null,
        startTime: null,
        endTime: null
    });

    const [isClicked, setIsClicked] = useState(false);

    const uploadChangesInDb = async () => {
        try {
            const payload = {
                savedLocation: savedPlanPages,
                ...popupFormData
            };

            console.log(payload);

            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${placeId}/edit/${tripId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.log(response);
                throw new Error(response.statusText);
            }

            const data = await response.json();
            console.log('update', data);
        } catch (error) {
            console.error(error);
        }
    };

    const createLocationInDb = async () => {
        try {
            const type = isAccomodation ? "accomodation" : "activity";
            const payload = {
                type: type,
                savedLocation: savedPlanPages,
                ...popupFormData,
                isBooked: false
            };

            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${placeId}/addToTrip/${tripId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.log(response);
                throw new Error(response.statusText);
            }

            const data = await response.json();
            console.log('upload', data);
            setLocationInDB(data.savedLocation ? true : false);
        } catch (error) {
            console.error(error);
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

            if (!response.ok || response.status === 404) {
                setLocationInDB(false);
                setDatesArray([]);
                return;
            }

            const data = await response.json();
            setLocationInDB(data.savedLocation ? true : false);
            setSavedPlanPages(data.savedLocation || {
                bucketList: false,
                itinerary: false,
                accomodations: false
            });

            setPopupFormData((prev)=>(
                {
                    ...prev,
                    date: data.date? data.date.split('T')[0] : [],
                }
            ));
        } catch (error) {
            console.error(error);
            setDatesArray([]);
        }
    };

    const getTripDates = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id
                }
            });

            if (!response.ok || response.status === 404) {
                return;
            }

            const data = await response.json();
            setDatesArray(data.datesArray || []);

            setPopupFormData(prevFormData => ({
                ...prevFormData,
                date: popupFormData.date ? popupFormData.date : data.datesArray[0]
            }));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getTripDates();
        getPlace();
    }, []);

    const toggleSaveState = (key) => {
        if (key === "itinerary" && !savedPlanPages.itinerary) {
            setIsItineraryPopupVisible(true);
        } else {
            setSavedPlanPages(prevState => ({
                ...prevState,
                [key]: !prevState[key]
            }));
            setIsClicked(true);
        }
    };

    useEffect(() => {
        if (isClicked) {
            if (locationInDB) {
                uploadChangesInDb();
            } else {
                createLocationInDb();
            }
            setIsClicked(false);
        }
    }, [savedPlanPages, popupFormData, locationInDB, isClicked]);

    useEffect(() => {
        navigate(urlLocation, { state: nanoid() });
    }, [savedPlanPages]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPopupFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handlePopupFormSubmit = () => {
        setSavedPlanPages(prevState => ({
            ...prevState,
            itinerary: true
        }));
        setIsClicked(true);
        setIsItineraryPopupVisible(false);
    };

    return (
        <>
            <button
                className={styles.saveBtn}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsContainerSaveToPagesBtnsActive(prev => !prev)
                }}
            >
                {savedPlanPages.bucketList || savedPlanPages.itinerary || savedPlanPages.accomodations ?
                    <i className="fa-solid fa-bookmark"></i>
                    :
                    <i className="fa-regular fa-bookmark"></i>
                }
            </button>

            {isContainerSaveToPagesBtnsActive &&
                <div className={`${styles.containerSaveToPagesBtns} ${position === "left" ? styles.left : styles.right}`}>
                    <div className={styles.page}>
                        <div>
                            <i className="fi fi-rr-heart"></i>
                            <p>Bucketlist</p>
                        </div>
                        <button onClick={() => toggleSaveState('bucketList')}>
                            {savedPlanPages.bucketList ?
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
                            {savedPlanPages.itinerary ?
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
                            {savedPlanPages.accomodations ?
                                <i className={`fi fi-ss-check-circle ${styles.addedBtn}`}></i>
                                :
                                <i className={`fi fi-rr-add ${styles.addBtn}`}></i>
                            }
                        </button>
                    </div>
                </div>
            }

            {isItineraryPopupVisible && (
                <Popup title={'When do you want to go to this place?'} handleClose={()=> setIsItineraryPopupVisible(false)}>
                    <div className={styles.popUpInputs}>
                        <div>
                            <label htmlFor="dates-select">Date</label>
                            <select name="date" id="dates-select" onChange={handleChange} value={popupFormData.date || ""}>
                                {datesArray.length > 0 ? (
                                    datesArray.map((date, i) => (
                                        <option value={date.split('T')[0]} key={`date-select-${date}`}>Day {i + 1}: {date.split('T')[0]}</option>
                                    ))
                                ) : (
                                    <option value={null}>No dates available</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="start-time">Start time (optional)</label>
                            <input type="time" name="startTime" id="start-time" onChange={handleChange} value={popupFormData.startTime || ""} />
                        </div>
                        <div>
                            <label htmlFor="end-time">End time (optional)</label>
                            <input type="time" name="endTime" id="end-time" onChange={handleChange} value={popupFormData.endTime || ""} />
                        </div>

                        <PrimaryBtn style={styles.primaryBtnPopup} onClick={handlePopupFormSubmit}>
                            Save this place in the itinerary list
                        </PrimaryBtn>
                    </div>
                </Popup>
            )}
        </>
    );
}

export default SavePlaceBtn;
