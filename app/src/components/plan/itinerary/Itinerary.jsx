import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import styles from './itinerary.module.css';
import PrimaryLinkBtn from '../../global/btns/primary/link/PrimaryLinkBtn';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { useLocation } from 'react-router-dom';
import { DndContext, PointerSensor, TouchSensor, closestCenter, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ItineraryCard from './itineraryCard/ItineraryCard';
import debounce from 'lodash/debounce'; // Make sure to install lodash with `npm install lodash`

function Itinerary(props) {
    const { state } = useLocation();
    const [itineraryPlaces, setItineraryPlaces] = useState([]);
    const loggedInUser = useContext(LoggedInUserContext);
    const tripId = "6654e2621cbe496564c8192d";
    const [forceRerenderCardComponent, setForceRenderCardComponent] = useState(state ? state : 0);
    const [locationsFetched, setLocationsFetched] = useState([]);
    const [newDraggedOrder, setNewDraggedOrder] = useState([]);
    const parentContainer = useRef();
    const [itineraryElementWidth, setItineraryElementWidth] = useState(0);

    const date = "2025-06-20T00:00:00.000Z";

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

    const getItinerary = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/getItinerary/inTrip/${tripId}/${date}`, {
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
            setItineraryPlaces(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateOrderDB = async (googleLocationId, order) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${googleLocationId}/edit/${tripId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id,
                },
                body: JSON.stringify({
                    order: order
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
        getItinerary();
    }, [forceRerenderCardComponent]);

    useEffect(()=>{
        if(newDraggedOrder.length > 0){
            console.log("newOrder", newDraggedOrder);
            newDraggedOrder.forEach((item, index) => {
                updateOrderDB(item.googleLocationId, index);
            });
            
            setItineraryPlaces(newDraggedOrder);
            setForceRenderCardComponent((prev)=> prev++)
        }
        
    }, [newDraggedOrder]);

    const handleLocationFetched = (index, location) => {
        setLocationsFetched(prevLocations => {
            const newLocations = [...prevLocations];
            newLocations[index] = location;
            return newLocations;
        });
    };

    function openDirectionsInGoogleMaps(origin, destination) {
        console.log('fetchedLoc', locationsFetched);
        console.log(origin, destination);
        const originCoords = `${origin.latitude},${origin.longitude}`;
        const destinationCoords = `${destination.latitude},${destination.longitude}`;
        const url = `https://www.google.com/maps/dir/${originCoords}/${destinationCoords}`;
        window.open(url, '_blank');
    }

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            setNewDraggedOrder(() => {
                const oldIndex = itineraryPlaces.findIndex(item => item._id === active.id);
                const newIndex = itineraryPlaces.findIndex(item => item._id === over.id);
                const newItems = arrayMove(itineraryPlaces, oldIndex, newIndex);
                console.log("put new items order", newItems);
                return newItems;
            });
        }
    };

    const DroppableArea = ({ id }) => {
        const { setNodeRef, isOver } = useDroppable({ id });
        const style = {
            height: '4px',
            backgroundColor: isOver ? 'blue' : 'transparent',
        };
        return <div ref={setNodeRef} style={style} />;
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
    );

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className={styles.itinerary} ref={parentContainer}>
                <div className={styles.flexContainer}>
                    <h1>Itinerary</h1>
                    <PrimaryLinkBtn url={`${window.location.href}/suggestions`}>
                        Add
                    </PrimaryLinkBtn>
                </div>

                {
                    itineraryElementWidth > 500 ?
                    // For when you display the itinerary on full screen
                    <>
                        <div className={styles.itineraryFlex}>
                            <div className={styles.dropAreaDay}>
                                <button>Day 1</button>
                                <SortableContext items={itineraryPlaces.map(item => item._id)} strategy={verticalListSortingStrategy}>
                                    <div className={styles.content}>
                                    {itineraryPlaces.length > 0 ? itineraryPlaces.map((item, index) => (
                                        <React.Fragment key={item._id}>
                                            <DroppableArea id={`drop-${item._id}`} />
                                            <ItineraryCard
                                                item={item}
                                                index={index}
                                                locationsFetched={locationsFetched}
                                                loggedInUser={loggedInUser}
                                                handleLocationFetched={handleLocationFetched}
                                                openDirectionsInGoogleMaps={openDirectionsInGoogleMaps}
                                                itineraryPlaces={itineraryPlaces}
                                            />
                                            <DroppableArea id={`drop-${item._id}`} />
                                        </React.Fragment>
                                    )) : <p>Here you can access your planned activities and restaurants.<br />Right now there is nothing in the itinerary.</p>}
                                </div>

                                </SortableContext>
                            </div>
                            <div className={styles.dropAreaDay}>
                                <button>Day 2</button>
                                <SortableContext items={itineraryPlaces.map(item => item._id)} strategy={verticalListSortingStrategy}>
                                    <div className={styles.content}>
                                    {itineraryPlaces.length > 0 ? itineraryPlaces.map((item, index) => (
                                        <React.Fragment key={item._id}>
                                            <DroppableArea id={`drop-${item._id}`} />
                                            <ItineraryCard
                                                item={item}
                                                index={index}
                                                locationsFetched={locationsFetched}
                                                loggedInUser={loggedInUser}
                                                handleLocationFetched={handleLocationFetched}
                                                openDirectionsInGoogleMaps={openDirectionsInGoogleMaps}
                                                itineraryPlaces={itineraryPlaces}
                                            />
                                            <DroppableArea id={`drop-${item._id}`} />
                                        </React.Fragment>
                                    )) : <p>Here you can access your planned activities and restaurants.<br />Right now there is nothing in the itinerary.</p>}
                                </div>

                                </SortableContext>
                            </div>
                            <div className={styles.dropAreaDay}>
                                <button>Day 3</button>
                                <SortableContext items={itineraryPlaces.map(item => item._id)} strategy={verticalListSortingStrategy}>
                                    <div className={styles.content}>
                                    {itineraryPlaces.length > 0 ? itineraryPlaces.map((item, index) => (
                                        <React.Fragment key={item._id}>
                                            <DroppableArea id={`drop-${item._id}`} />
                                            <ItineraryCard
                                                item={item}
                                                index={index}
                                                locationsFetched={locationsFetched}
                                                loggedInUser={loggedInUser}
                                                handleLocationFetched={handleLocationFetched}
                                                openDirectionsInGoogleMaps={openDirectionsInGoogleMaps}
                                                itineraryPlaces={itineraryPlaces}
                                            />
                                            <DroppableArea id={`drop-${item._id}`} />
                                        </React.Fragment>
                                    )) : <p>Here you can access your planned activities and restaurants.<br />Right now there is nothing in the itinerary.</p>}
                                </div>

                                </SortableContext>
                            </div>
                        </div>
                    </>

                    :


                    <>
                        <div className={styles.filterDays}>
                            <button>Day 1</button>
                            <button>Day 2</button>
                            <button>Day 3</button>
                        </div>

                        <SortableContext items={itineraryPlaces.map(item => item._id)} strategy={verticalListSortingStrategy}>
                            <div className={styles.content}>
                                {itineraryPlaces.length > 0 ? itineraryPlaces.map((item, index) => (
                                    <React.Fragment key={item._id}>
                                        <DroppableArea id={`drop-${item._id}`} />
                                        <ItineraryCard
                                            item={item}
                                            index={index}
                                            locationsFetched={locationsFetched}
                                            loggedInUser={loggedInUser}
                                            handleLocationFetched={handleLocationFetched}
                                            openDirectionsInGoogleMaps={openDirectionsInGoogleMaps}
                                            itineraryPlaces={itineraryPlaces}
                                        />
                                        <DroppableArea id={`drop-${item._id}`} />
                                    </React.Fragment>
                                )) : <p>Here you can access your planned activities and restaurants.<br />Right now there is nothing in the itinerary.</p>}
                            </div>
                        </SortableContext>
                    </>
                }
            </div>
        </DndContext>
    );
}

export default Itinerary;
