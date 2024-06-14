import React, { useContext, useEffect, useState } from 'react';
import styles from './planHeader.module.css';
import { Link, useParams } from 'react-router-dom';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import WorldFlags from 'react-world-flags';
import { europeanCountries } from '../../../consts/countries';
import ShareTrip from '../../trip/shareTrip/ShareTrip';
import { Tooltip } from 'react-tooltip';

function PlanHeader(props) {
    const {tripId} = useParams();
    const loggedInUser = useContext(LoggedInUserContext);
    const [tripData, setTripData] = useState();
    const [tripDates, setTripDates] = useState({
        startDate: '',
        endDate: ''
    });

    const [country, setCountry] = useState(null);
    const [membersData, setMembersData] = useState([]);
    const [isSharePopupOpen, setIsSharePopupOpen] = useState();

    const getTripData = async () => {
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
            setTripData(data);

            const tripStartDate = new Date(data.startDate).toDateString().split(' ')
            const tripEndDate = new Date(data.endDate).toDateString().split(' ')
            
            const tripStartDateString = `${tripStartDate[2]} ${tripStartDate[1]}`;
            const tripEndDateString = `${tripEndDate[2]} ${tripEndDate[1]}`;

            setTripDates({
                startDate: tripStartDateString,
                endDate: tripEndDateString 
            })

            const countryObj = europeanCountries.find(country => country.label === data.country.name);
            setCountry(countryObj)


        } catch (error) {
            console.error(error);
        }
    };


    const getMembers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripId}/members`, {
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



    useEffect(()=> {
        getTripData();
        getMembers();
    }, [])

    return (
        <header>
            <div className={`${styles.container} ${styles.wraper}`}>
                {
                    tripData &&
                    <>
                        <div className={styles.left}>

                            {/* Small logo */}
                            
                            {country && 
                                <WorldFlags code={country.value} style={{ width: '40px', marginRight: '10px' }} />
                            }

                            <div>
                                <h3>{tripData.tripName}</h3>
                                <p>{tripDates.startDate} - {tripDates.endDate}</p>
                            </div>
                            </div>

                            <div className={styles.right}>


                            {/* Desktop nav links */}
                            <div className={styles.members}>
                                <div className={`${styles.membersAvatars} ${styles.membersDesktop}`}>
                                    {
                                        membersData.map((member, i) => {
                                            if(i < 3){
                                                return (
                                                    <>
                                                        <img 
                                                            key={`avatar-${i}`}
                                                            src={member.image}
                                                            alt={`avatar-${member.firstname}-${member.lastname}`}
                                                            data-tooltip-id={`member-${member.firstname}-${member.lastname}`}
                                                            data-tooltip-content={`${member.firstname} ${member.lastname}`} 
                                                        />
                                                    
                                                        <Tooltip 
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
                                </div>

                                {membersData.length > 3 && <p>{membersData.length - 3}</p>}

                            </div>
                                    

                            <button className={styles.addUserBtn} onClick={() => setIsSharePopupOpen(true)}>
                                <i className="fi fi-rr-user-add"></i>
                            </button>


                                    {/* Mobile nav links */}
                                    {/* <button className={styles.navElementMobile}>
                                        <i className="fi fi-rr-user-add"></i>
                                    </button>

                                    <Link className={styles.navElementMobile}>
                                        <i className="fi fi-rr-settings"></i>
                                    </Link> */}



                            {/* Avatar for both mobile and desktop */}
                            {/* <Link to={"../account"}>
                                <img className={styles.avatar} src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww" alt="avatar" />
                            </Link> */}
                            </div>
                            
                            {
                                isSharePopupOpen &&

                                <ShareTrip 
                                    handleClose={()=> setIsSharePopupOpen(false)} tripId={tripId} 
                                    tripData={tripData}
                                />
                            }
                            
                    
                    
                    </>
                }
                
            
            </div>
        </header>
    );
}

export default PlanHeader;