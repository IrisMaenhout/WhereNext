import React, { useContext, useEffect, useState } from 'react';
import styles from './tripOverview.module.css';
import Header from '../global/header/Header';
import CalendarSidebar from './calendarSidebar/CalendarSidebar';
import TripCard from './tripCard/TripCard';
import { LoggedInUserContext } from '../../context/LoggedInUserContext';
import Popup from '../global/popups/Popup';
import CountrySelect from '../global/inputs/countrySelect/CountrySelect';
import PrimaryBtn from '../global/btns/primary/btn/PrimaryBtn';
import PrimaryLinkBtn from '../global/btns/primary/link/PrimaryLinkBtn';
import { useNavigate } from 'react-router-dom';

function TripOverview(props) {
    const loggedInUser = useContext(LoggedInUserContext);
    const [trips, setTrips] = useState([]);
    const [currentTrips, setCurrentTrips] = useState([]);
    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);
    const [selectedYear, setSelectedYear] = useState('All');
    const [isPopupOpen, setIsPopupOpen] = useState(true);
    const [newTripData, setNewTripData] = useState({
        title:  '',
        country: '',
        lat: null,
        lng: null,
    });

    const [formErrorMessages, setFormErrorMessages] = useState({
        title: null,
        country: null
    })

    const navigate = useNavigate();


    const handleTitleChange = (e) => {
        const title = e.target.value;
        setNewTripData({ ...newTripData, title });
        // sessionStorage.setItem('title', title);
    };

    const handleCountryChange = async (selectedOption) => {
        // const { label, lat, lng } = selectedOption;

        console.log(selectedOption)
        // setNewTripData({
        //     ...newTripData,
        //     country: label,
        //     latitude: lat,
        //     longitude: lng,
        // });
        // sessionStorage.setItem('country', label);
        // sessionStorage.setItem('latitude', lat);
        // sessionStorage.setItem('longitude', lng);
    };

    const getTrips = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/my-trips`, {
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
            setTrips(data);
            categorizeTrips(data);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
        }
    };

    const categorizeTrips = (trips) => {
        const now = new Date();
        const current = [];
        const upcoming = [];
        const past = [];

        trips.forEach(trip => {
            const startDate = new Date(trip.startDate);
            const endDate = new Date(trip.endDate);

            if (now >= startDate && now <= endDate) {
                current.push(trip);
            } else if (now < startDate) {
                upcoming.push(trip);
            } else if (now > endDate) {
                past.push(trip);
            }
        });

        setCurrentTrips(current);
        setUpcomingTrips(upcoming);
        setPastTrips(past.sort((a, b) => new Date(b.endDate) - new Date(a.endDate)));
    };

    const handleYearFilter = (year) => {
        setSelectedYear(year);
    };

    useEffect(() => {
        getTrips();
    }, []);

    const filteredPastTrips = selectedYear === 'All'
        ? pastTrips
        : pastTrips.filter(trip => new Date(trip.startDate).getFullYear() === parseInt(selectedYear));

    function submitcreateTripForm(){
        console.log('submit', newTripData);
        
        sessionStorage.setItem('newTripData', JSON.stringify(newTripData));
        navigate('/add-trip');
    }


    return (
        <>
        <div className={styles.container}>
            <Header isPlaningPages={false} isTripsOverviewPage={true} />

            <div className="contentWrapperTripsOverview">
                <CalendarSidebar trips={trips}/>
                <div className={styles.main}>
                    <div className={styles.currentTrips}>
                        <h2>Current trip</h2>
                        {currentTrips.length > 0 ? (
                            currentTrips.map((trip, i) => (
                                <TripCard key={`currentTrip-${i}`} tripData={trip} isCurrentlyHappening={true} />
                            ))
                        ) : (
                            <p>No current trips</p>
                        )}
                    </div>

                    <div className={styles.upcomingTrips}>
                        <h2>Upcoming trips</h2>
                        <div className="gridTripsOverview">
                            {upcomingTrips.length > 0 ? (
                                upcomingTrips.map((trip, i) => (
                                    <div key={`upcomingTrip-${i}`} className={styles.cardsGrid}>
                                        <TripCard tripData={trip} isCurrentlyHappening={false} />
                                    </div>
                                ))
                            ) : (
                                <p>No upcoming trips</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.pastTrips}>
                        <h2>Past trips</h2>
                        <div className={styles.yearFilter}>
                            <button onClick={() => handleYearFilter('All')}>All</button>
                            {[...new Set(pastTrips.map(trip => new Date(trip.startDate).getFullYear()))].map(year => (
                                <button key={year} onClick={() => handleYearFilter(year)}>{year} </button>
                            ))}
                        </div>
                        <div className="gridTripsOverview">
                            {filteredPastTrips.length > 0 ? (
                                filteredPastTrips.sort((a, b) => new Date(b.endDate) - new Date(a.endDate)).map((trip, i) => (
                                    <div key={`pastTrip-${i}`} className={styles.cardsGrid}>
                                        <TripCard tripData={trip} isCurrentlyHappening={false} />
                                    </div>
                                ))
                            ) : (
                                <p>No past trips</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {
            isPopupOpen &&

            <Popup title={'Where do you want to go?'} classNames={styles.popupAddTripWidth} handleClose={()=> setIsPopupOpen(false)}>
                <div className={styles.addTripPopup}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Give this trip a title"
                            className={styles.titleInput}
                            value={newTripData.title}
                            onChange={handleTitleChange}
                        />
                    </div>
                    <div>
                        <CountrySelect
                            className={styles.countrySelect}
                            // onChange={handleCountryChange}
                            setNewTripData ={setNewTripData}
                        />
                    </div>
                </div>

                <PrimaryBtn onClick={submitcreateTripForm} style={styles.primaryBtnPopup}>
                    Continue
                </PrimaryBtn>
            </Popup>

        }
        
        </>
    );
}

export default TripOverview;
