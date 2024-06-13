import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import styles from './itinerary.module.css';
import PrimaryLinkBtn from '../../global/btns/primary/link/PrimaryLinkBtn';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { useLocation, useParams } from 'react-router-dom';
import ItineraryCard from './itineraryCard/ItineraryCard';
import debounce from 'lodash/debounce'; // Make sure to install lodash with `npm install lodash`
import { PlacesContext } from '../../../context/LocationsContext';
import FilterBtn from '../../global/btns/filterBtn/FilterBtn';

function Itinerary(props) {
    const { tripId } = useParams();
    const { state } = useLocation();
    const { places, setPlaces } = useContext(PlacesContext);
    const [itineraryPlaces, setItineraryPlaces] = useState([]);
    const loggedInUser = useContext(LoggedInUserContext);
    // const tripId = "6654e2621cbe496564c8192d";
    const [forceRerenderCardComponent, setForceRenderCardComponent] = useState(state ? state : 0);
    const [locationsFetched, setLocationsFetched] = useState([]);
    const [newDraggedOrder, setNewDraggedOrder] = useState([]);
    const parentContainer = useRef();
    const [itineraryElementWidth, setItineraryElementWidth] = useState(0);
    const [isSimpleCardView, setIsSimpleCardView] = useState(false);

    const [tripDayDates, setTripDates] = useState([]);
    const [dayFilter, setDayFilter] = useState(tripDayDates[0] || '');
    // const [dates, setDates] = useState([tripDayDates[0]]);

    const updateWidth = useCallback(
        debounce((width) => {
            setItineraryElementWidth(width);
        }, 100),
        []
    );

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.width !== itineraryElementWidth) {
                    updateWidth(entry.contentRect.width);
                }
            }
        });

        if (parentContainer.current) {
            observer.observe(parentContainer.current);
        }

        return () => {
            if (parentContainer.current) {
                observer.unobserve(parentContainer.current);
            }
            updateWidth.cancel();
        };
    }, [itineraryElementWidth, updateWidth]);

    useEffect(() => {
        function rerenderComponent() {
            setForceRenderCardComponent(state);
        }
        const timeout = setTimeout(rerenderComponent, 100);
        return () => clearTimeout(timeout);
    }, [state]);


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
            console.log('TIP_DATA', data);
            setTripDates(data.datesArray || []);

        } catch (error) {
            console.error(error);
        }
    };


    const getItinerary = async () => {
        console.log('sfjknjknjk dnfkn dfnk s', tripDayDates)
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/getItinerary/inTrip/${tripId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id,
                },
                body: JSON.stringify({
                    dates: tripDayDates
                })
            });

            if (!response.ok) {
                setItineraryPlaces([]);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setItineraryPlaces(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateOrderDB = async (googleLocationId, order, date, time) => {
        console.log('date', date);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${googleLocationId}/edit/${tripId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id,
                },
                body: JSON.stringify({
                    order: order,
                    date: date,
                    time: time
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

   

    useEffect(() => {
        getTripDates();
        
    }, [forceRerenderCardComponent]);


    useEffect(()=> {
        if(tripDayDates.length > 0){
            getItinerary();
        }
    }, [tripDayDates, forceRerenderCardComponent]);

    useEffect(() => {
        if (newDraggedOrder.length > 0) {
            console.log("newOrder", newDraggedOrder);
            newDraggedOrder.forEach((item, index) => {
                updateOrderDB(item.googleLocationId, index, item.date, item.time);
            });

            setItineraryPlaces(newDraggedOrder);
            setForceRenderCardComponent(prev => prev + 1);
        }
    }, [newDraggedOrder]);

    const handleLocationFetched = (index, location) => {
        setLocationsFetched(prevLocations => {
            const newLocations = [...prevLocations];
            newLocations[index] = location;
            return newLocations;
        });

        // Maybe rerender page
    };

    function openDirectionsInGoogleMaps(origin, destination) {
        console.log('fetchedLoc', locationsFetched);
        console.log(origin, destination);
        const originCoords = `${origin.latitude},${origin.longitude}`;
        const destinationCoords = `${destination.latitude},${destination.longitude}`;
        const url = `https://www.google.com/maps/dir/${originCoords}/${destinationCoords}`;
        window.open(url, '_blank');
    }

    const moveCard = (index, direction) => {
        const newOrder = [...itineraryPlaces];
        if (direction === 'up' && index > 0) {
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        } else if (direction === 'down' && index < newOrder.length - 1) {
            [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
        }
        setNewDraggedOrder(newOrder);
    };

    const handleDayChange = (index, newDate) => {
        const updatedItinerary = [...itineraryPlaces];
        updatedItinerary[index].date = newDate;
        setNewDraggedOrder(updatedItinerary);
    };

    const handleTimeChange = (index, newTime) => {
        const updatedItinerary = [...itineraryPlaces];
        updatedItinerary[index].time = newTime;
        setNewDraggedOrder(updatedItinerary);
    };

    const handleDayFilterClick = (date) => {
        setDayFilter(date);

        console.log('HIIIIIIIIIIIIIII');
        console.log('DAY', date, dayFilter)
    }


    return (
        <div className={styles.itinerary} ref={parentContainer}>
            <div className={styles.flexContainer}>
                <h1>Itinerary</h1>

                <div className={styles.topBtns}>
                    <button 
                        onClick={()=> setIsSimpleCardView(prev => !prev)}
                        className={styles.toggleCardView}
                    >
                        {
                        isSimpleCardView ?
                        <i className="fi fi-br-list-timeline"></i>
                        :
                        <i className="fi fi-rr-list"></i>
                        }
                    </button>
                    <PrimaryLinkBtn url={`${window.location.href}/suggestions`}>
                        Add
                    </PrimaryLinkBtn>
                </div>
            </div>

            {itineraryElementWidth > 500 ?
                // For when you display the itinerary on full screen
                <div className={styles.itineraryFlex}>
                    {tripDayDates.map((date, i) => (
                        <div key={`kanbanBoardDay-${date}`} className={styles.kanbanBoardDay}>
                            {itineraryPlaces.filter(item => item.date === date).length > 0 && (
                                itineraryPlaces.filter(item => item.date === date).map((item, index) => (
                                    <ItineraryCard
                                        key={`big-sidbar-${item._id}`}
                                        item={item}
                                        index={index}
                                        locationsFetched={locationsFetched}
                                        loggedInUser={loggedInUser}
                                        handleLocationFetched={handleLocationFetched}
                                        openDirectionsInGoogleMaps={openDirectionsInGoogleMaps}
                                        itineraryPlaces={itineraryPlaces}
                                        setPlaces={setPlaces}
                                        isSimpleCardView={isSimpleCardView}
                                        moveCard={moveCard}
                                        tripDayDates={tripDayDates}
                                        handleDayChange={handleDayChange}
                                        handleTimeChange={handleTimeChange}
                                    />
                                ))
                            )}
                        </div>
                    ))}
                </div>
                :
                <>
                    <div className={styles.filterDays}>
                        {tripDayDates.map((date, i) => (
                            <FilterBtn key={`dayFilter-${i}`} title={`Day ${i + 1}`} handleClick={() => handleDayFilterClick(date)}/>

                        ))}
                    </div>
                    
                    <div className={styles.content}>
                    {
                        itineraryPlaces.filter(item => item.date === dayFilter).length > 0 ? (
                            itineraryPlaces.filter(item => item.date === dayFilter).map((item, index) => (
                            <React.Fragment key={`small-sidbar-${item._id}`}>
                                <ItineraryCard
                                    item={item}
                                    index={index}
                                    locationsFetched={locationsFetched}
                                    loggedInUser={loggedInUser}
                                    handleLocationFetched={handleLocationFetched}
                                    openDirectionsInGoogleMaps={openDirectionsInGoogleMaps}
                                    itineraryPlaces={itineraryPlaces}
                                    setPlaces={setPlaces}
                                    isSimpleCardView={isSimpleCardView}
                                    moveCard={moveCard}
                                    tripDayDates={tripDayDates}
                                    handleDayChange={handleDayChange}
                                    handleTimeChange={handleTimeChange}
                                />
                            </React.Fragment>
                        ))) : (
                            <p>There are no places saved for this day.</p>
                        )}
                            
                    </div>
                </>
            }
        </div>
    );
}

export default Itinerary;
