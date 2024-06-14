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
import FilterBtn from '../global/btns/filterBtn/FilterBtn';

function TripOverview(props) {
    const loggedInUser = useContext(LoggedInUserContext);
    const [trips, setTrips] = useState([]);
    const [currentTrips, setCurrentTrips] = useState([]);
    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);
    const [selectedYear, setSelectedYear] = useState('All');
    

    

    


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



    return (
        <>
        <div className={styles.container}>
            <Header isPlaningPages={false} isTripsOverviewPage={true} />

            <div className="contentWrapperTripsOverview">
                <CalendarSidebar trips={trips}/>
                <div className={styles.main}>
                    <div className={styles.currentTrips}>
                        <h2><i className={`fi fi-tr-live-alt ${styles.liveIcon}`}></i>Current trip</h2>
                        {currentTrips.length > 0 ? (
                            currentTrips.map((trip, i) => (
                                <TripCard key={`currentTrip-${i}`} tripData={trip} isCurrentlyHappening={true} className={styles.currentTripCard}/>
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
                            {/* <button onClick={() => handleYearFilter('All')}>All</button> */}
                            <FilterBtn handleClick={() => handleYearFilter('All')} title={'All'} isSelected={selectedYear === 'All'}/>
                            {[...new Set(pastTrips.map(trip => new Date(trip.startDate).getFullYear()))].map(year => (
                                // <button key={year} onClick={() => handleYearFilter(year)}>{year} </button>
                                <FilterBtn key={year} handleClick={() => handleYearFilter(year)} title={year} isSelected={selectedYear === year}/>
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
        
        
        
        </>
    );
}

export default TripOverview;
