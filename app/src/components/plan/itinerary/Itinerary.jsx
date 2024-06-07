import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import styles from './itinerary.module.css';
import PrimaryLinkBtn from '../../global/btns/primary/link/PrimaryLinkBtn';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { useLocation } from 'react-router-dom';
import { DndContext, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ItineraryCard from './itineraryCard/ItineraryCard';
import debounce from 'lodash/debounce'; // Make sure to install lodash with `npm install lodash`
import DropBox from './dropbox/DropBox';

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

    const tripDayDates = ["2025-06-20T00:00:00.000Z", "2025-06-21T00:00:00.000Z", "2025-06-22T00:00:00.000Z", "2025-06-23T00:00:00.000Z"];
    const [dates, setDates] = useState([tripDayDates[0]]);

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
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/getItinerary/inTrip/${tripId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id,
                },
                body: JSON.stringify({
                    dates: dates
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

    const updateOrderDB = async (googleLocationId, order, date) => {
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
                    date: date
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
        console.log("WAY_V")
        if (itineraryElementWidth > 500) {
            setDates(tripDayDates);
        } else {
            setDates([tripDayDates[0]]);
        }
    }, [itineraryElementWidth]);

    useEffect(() => {
        getItinerary();
    }, [forceRerenderCardComponent, dates]);

    useEffect(() => {
        if (newDraggedOrder.length > 0) {
            console.log("newOrder", newDraggedOrder);
            newDraggedOrder.forEach((item, index) => {
                updateOrderDB(item.googleLocationId, index, item.date);
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

        console.log('over', over);
        console.log('Active', active);

        const activeItem = itineraryPlaces.find(item => item._id === active.id);
        const overItem = itineraryPlaces.find(item => item._id === over.id);

        console.log('overItem', overItem);
        const newDate = overItem ? overItem.date : tripDayDates[over.id.split('-')[1]];
        console.log('dateCheck', newDate);

        if (activeItem.date !== newDate) {
            console.log("ENHYPHEN");
            activeItem.date = newDate;

            const updatedItems = itineraryPlaces
                .filter(item => item.date === newDate)
                .sort((a, b) => a.order - b.order);

            const newIndex = updatedItems.findIndex(item => item._id === over.id);

            setNewDraggedOrder(() => {
                const oldIndex = updatedItems.findIndex(item => item._id === active.id);
                const newItems = arrayMove(updatedItems, oldIndex, newIndex);
                console.log("put new items order", newItems);
                return newItems;
            });

            setItineraryPlaces(prev => prev.map(item => {
                if (item._id === activeItem._id) {
                    return { ...item, date: newDate };
                }
                return item;
            }));

            await updateOrderDB(activeItem.googleLocationId, newIndex, newDate);
        } else if (active.id !== over.id) {
            console.log("THE BOYZ");
            // const oldIndex = itineraryPlaces.findIndex(item => item._id === active.id);
            // const newIndex = itineraryPlaces.findIndex(item => item._id === over.id);
            // console.log('Indewxxx',newIndex, oldIndex)
            // setNewDraggedOrder(() => {
            //     const newItems = arrayMove(itineraryPlaces, oldIndex, newIndex);
            //     console.log("put new items order", newItems);
            //     return newItems;
            // });

            // setItineraryPlaces(prev => {
            //     const updatedItems = arrayMove(prev, oldIndex, newIndex);
            //     return updatedItems;
            // });

            // await updateOrderDB(activeItem.googleLocationId, newIndex, activeItem.date);


            const oldIndex = itineraryPlaces.findIndex(item => item._id === active.id);
            const newIndex = itineraryPlaces.findIndex(item => item._id === over.id);

            const reorderedItems = arrayMove(
                itineraryPlaces.filter(item => item?.date === activeItem.date),
                oldIndex,
                newIndex
            );
            console.log('comploa', reorderedItems);

            const otherItems = itineraryPlaces.filter(item => item.date !== activeItem.date);
            console.log('bana', );
            const newItems = [...otherItems, ...reorderedItems];

            setNewDraggedOrder(() => newItems);

            setItineraryPlaces(newItems);

            await updateOrderDB(activeItem.googleLocationId, newIndex, activeItem.date);
        }
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
                                {tripDayDates.map((date, i) => (
                                    <div key={`kanbanBoardDropZone-${date}`} className={styles.dropAreaDay}>
                                        <DropBox
                                            dropBoxId={`dropbox-${i}`}
                                            index={i}
                                            itineraryPlaces={itineraryPlaces}
                                            date={date}
                                        >
                                            {itineraryPlaces.filter(item => item.date === date).length > 0 && (
                                                itineraryPlaces.filter(item => item.date === date).map((item, index) => (
                                                    <ItineraryCard
                                                        item={item}
                                                        index={index}
                                                        locationsFetched={locationsFetched}
                                                        loggedInUser={loggedInUser}
                                                        handleLocationFetched={handleLocationFetched}
                                                        openDirectionsInGoogleMaps={openDirectionsInGoogleMaps}
                                                        itineraryPlaces={itineraryPlaces}
                                                    />
                                                )))
                                            }
                                        </DropBox>
                                    </div>
                                ))}
                            </div>
                        </>
                        :
                        <>
                            <div className={styles.filterDays}>
                                {tripDayDates.map((date, i) => (
                                    <button key={`dayFilter-${i}`} onClick={() => setDates([date])}>Day {i + 1}</button>
                                ))}
                            </div>
                            <SortableContext items={itineraryPlaces.map(item => item._id)} strategy={verticalListSortingStrategy}>
                                <div className={styles.content}>
                                    {itineraryPlaces.length > 0 ? itineraryPlaces.map((item, index) => (
                                        <React.Fragment key={item._id}>
                                            <ItineraryCard
                                                item={item}
                                                index={index}
                                                locationsFetched={locationsFetched}
                                                loggedInUser={loggedInUser}
                                                handleLocationFetched={handleLocationFetched}
                                                openDirectionsInGoogleMaps={openDirectionsInGoogleMaps}
                                                itineraryPlaces={itineraryPlaces}
                                            />
                                        </React.Fragment>
                                    )) : <p>There are no planned activities for this day.</p>}
                                </div>
                            </SortableContext>
                        </>
                }
            </div>
        </DndContext>
    );
}

export default Itinerary;
