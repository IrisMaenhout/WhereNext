import React, { useEffect, useState } from 'react';
import styles from './tripCard.module.css';
import Popup from '../../global/popups/Popup';
import TripSettingsBtn from '../../global/btns/tripSettingsBtn/TripSettingsBtn';

function TripCard({ isCurrentlyHappening, tripData }) {
    const [countryImage, setCountryImage] = useState(null);
    const [popupData, setPopupData] = useState({
        isOpen: false,
        content: 'share',
        errorMessage: undefined,
        succesMessage: undefined
    });

    const DAY_UNIT_IN_MILLISECONDS = 24 * 3600 * 1000;

    const diffInMilliseconds = new Date(tripData.startDate).getTime() - new Date(tripData.endDate).getTime();
    const diffInDays = diffInMilliseconds / DAY_UNIT_IN_MILLISECONDS;

   

    const getCountryImage = async () => {
        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=${tripData.country.name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': '2yNyogMFgtUewZQbO3oYHiK4cYKVMGATxE1vrupzwlzlmTR5sYhy2018'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            setCountryImage(data.photos[0]);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        getCountryImage();
    }, [tripData]);

    return (
        <>
        <div className={styles.card}>
            <div className={styles.topInfo}>
                <div className={styles.travelCompanions}>
                    <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className={styles.avatar} />
                    <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className={styles.avatar} />
                    <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className={styles.avatar} />
                </div>

                <div className={styles.settingBtns}>
                    <button className={styles.shareBtn} onClick={()=> {
                        setPopupData((prevPopupData) => (
                            {
                                ...prevPopupData,
                                isOpen: true
                            }
                        ))
                    }}><i className={`fa-regular fa-share-from-square ${styles.shareBtn}`}></i>Share</button>
                    
                    <TripSettingsBtn tripId={tripData._id}/>
                </div>
            </div>
            {countryImage !== null && (
                <img
                    src={countryImage.src.landscape}
                    alt={countryImage.alt}
                    className={`${styles.coverImg} ${isCurrentlyHappening && styles.selectedCardImg}`}
                />
            )}
            <h3>{tripData.tripName}</h3>
            <div className={styles.extraInfo}>
                <div className={styles.flex}>
                    <i className="fi fi-rs-marker"></i>
                    <p><b>{tripData.cities.length}</b> {tripData.cities.length === 1 ? 'city' : 'cities'}</p>
                </div>
                <div className={styles.flex}>
                    <i className="fi fi-rr-calendar"></i>
                    <p>{tripData.startDateString}</p>
                    <i className="fi fi-rr-arrow-right"></i>
                    <p>{tripData.endDateString}</p>
                </div>
                <div className={styles.flex}>
                    <i className="fi fi-rr-clock-five"></i>
                    <p><b>{diffInDays}</b> {diffInDays === 1 ? 'day' : 'days'}</p>
                </div>
            </div>
        </div>

            {
                popupData.isOpen &&

                <Popup title={'Share this trip:'} handleClose={()=> {
                    setPopupData((prevPopupData)=> (
                        {
                            ...prevPopupData,
                            isOpen: false
                        }
                    ))
                }}>

                    <p>Click on the link to copy the url and send this url to a friend.</p>

                    <p className={styles.shareLink} onClick={(e)=> {
                        navigator.clipboard.writeText(e.target.innerText);
                        setPopupData((prevPopupData) => (
                            {
                                ...prevPopupData,
                                succesMessage: 'Link has been copied.'
                            }
                        ))
                        }}
                    >
                        {`${process.env.REACT_APP_BASE_URL_APP}/join-trip/${tripData._id}`}
                    </p>

                    {
                        popupData.succesMessage !== undefined &&
                        <p className={styles.succesMessage}>{popupData.succesMessage}</p>
                    }
                    
                    {
                        popupData.errorMessage !== undefined &&
                        <p className={styles.errorMessage}>{popupData.errorMessage}</p>
                    }
                </Popup>
            }
        </>
    );
}

export default TripCard;
