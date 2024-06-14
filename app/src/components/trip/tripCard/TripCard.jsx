import React, { useContext, useEffect, useState } from 'react';
import styles from './tripCard.module.css';
import Popup from '../../global/popups/Popup';
import TripSettingsBtn from '../../global/btns/tripSettingsBtn/TripSettingsBtn';
import ShareTrip from '../shareTrip/ShareTrip';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';

function TripCard({ isCurrentlyHappening, tripData, className }) {
    const [countryImage, setCountryImage] = useState(null);
    const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
    const loggedInUser = useContext(LoggedInUserContext);

    const DAY_UNIT_IN_MILLISECONDS = 24 * 3600 * 1000;

    const diffInMilliseconds = new Date(tripData.startDate).getTime() - new Date(tripData.endDate).getTime();
    const diffInDays = diffInMilliseconds / DAY_UNIT_IN_MILLISECONDS;

    const [membersData, setMembersData] = useState([]);

    const getMembers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripData._id}/members`, {
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
            setMembersData(data);

        } catch (error) {
            console.error(error);
        }
    };


    const getCountryImage = async () => {
        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=${tripData.country.name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.REACT_APP_PEXEL_API_KEY
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
        getMembers();
    }, [tripData]);

    return (
        <>
        <div className={`${styles.card} ${className}`}>
            <div className={styles.topInfo}>
                <div className={styles.travelCompanions}>
                {
                    membersData.map((member, i) => {
                        if(i < 3){
                            return (
                                <>
                                    <img 
                                        key={`avatar-${i}`}
                                        src={member.image}
                                        alt={`avatar-${member.firstname}-${member.lastname}`}
                                        className={styles.avatar} 
                                        data-tooltip-id={`member-${member.firstname}-${member.lastname}`}
                                        data-tooltip-content={`${member.firstname} ${member.lastname}`} 
                                    />
                                                    
                                    <Tooltip 
                                        key={`tooltip-${i}`}
                                        id={`member-${member.firstname}-${member.lastname}`} 
                                        border='1px solid #B0BDC7' 
                                        style={{backgroundColor: '#EDF2FC', color: '#6C7886', zIndex: 200}} 
                                        place='bottom'
                                        opacity={1}
                                    />
                                </>
                                                    
                            )
                        }else{
                            return <React.Fragment key={`empty-${i}`}></React.Fragment>
                        }
                    })
                }
                {membersData.length > 3 && <p>{membersData.length - 3}</p>}
                </div>

                <div className={styles.settingBtns}>
                    <button className={styles.shareBtn} onClick={()=> {
                        setIsSharePopupOpen(true);
                    }}><i className={`fa-regular fa-share-from-square ${styles.shareBtn}`}></i>Share</button>
                    
                    <TripSettingsBtn tripId={tripData._id} isInSideBar={false} position={''}>
                        <i className="fa-solid fa-ellipsis"></i>
                    </TripSettingsBtn>
                </div>
            </div>
            <Link to={`/trip/${tripData._id}/plan/bucket-list`}>
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
                        <p><b>{ Math.abs(diffInDays)}</b> days</p>
                    </div>
                </div>
            </Link>
            
        </div>

            {
                isSharePopupOpen &&

                <ShareTrip 
                    handleClose={()=> {
                    setIsSharePopupOpen(false);
                    }}
                    tripId={tripData._id}
                    tripData={tripData}
                    
                />
            }
        </>
    );
}

export default TripCard;
