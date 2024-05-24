import React, { useContext, useEffect, useState } from 'react';
// import GoogleMapReact from 'google-map-react';
import styles from './map.module.css';
import { APIProvider, AdvancedMarker, Map as GoogleMap, Pin } from '@vis.gl/react-google-maps';
import { PlacesContext } from '../../../context/locationsContext';
import BookMarker from './markers/BookMarker';
import TreeMarker from './markers/TreeMarker';
import WalkingMarker from './markers/WalkingMarker';
import ZooMarker from './markers/ZooMarker';
import TouristAttractions from './markers/TouristAttractions';

function Map(props) {
    const coordinates = { lat: 0, lng: 0};

    // const [userLocation, setUserLocation] = useState({
    //     lat: 0,
    //     lng: 0
    // });

    // const getUserLocation = () => {
    //     navigator.geolocation.getCurrentPosition((pos)=>{
    //         console.log(pos);
    //         setUserLocation({ 
    //             lat: pos.coords.latitude, 
    //             lng: pos.coords.longitude
    //         })
    //     })
    // }

    // useEffect(()=>{
    //     getUserLocation();
    // }, []);

    const { places } = useContext(PlacesContext);

    useEffect(() => {
        console.log("Updated places in map:", places);
        // Logic to update the map with new places goes here
    }, [places]);


    return (
        // <div className={styles.mapContainer}>
        //     <GoogleMapReact
        //         bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY}}
        //         defaultCenter={coordinates}
        //         center={coordinates}
        //         defaultZoom={14}
        //         options={{disableDefaultUI: true, mapId: '1b8dba27fec812bf'}}
        //         mapId={'1b8dba27fec812bf'}
        //         margin={[50, 50, 50, 50]}
        
        //         onChange={''}
        //         onChildClick={''}
            
        //     >

        //     </GoogleMapReact>

        //     {/* Website can't be opend or opens very slowly when I use the method beneath */}

            

        // </div>

        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} language='en'>
            <div className={styles.mapContainer}>
            <GoogleMap 
                defaultCenter={{lat: 40.7, lng: -74}} 
                defaultZoom={12}
                minZoom={4}
                
                mapId={process.env.REACT_APP_SIMPLE_MAP_STYLE_ID}
                // defaultZoom={3}
                gestureHandling={'greedy'}
                
            >

                {
                    places.map(place => (
                        <AdvancedMarker key={`location-${place.id}-marker`} position={{lat: place.location.latitude, lng: place.location.longitude}}>
                            {/* <Pin
                                background={'#0f9d58'}
                                borderColor={'#006425'}
                                glyphColor={'#60d98f'}
                            /> */}
                            
                            <div width={24} height={24}>
                                {(place.primaryType === "park" || place.primaryType === "national_park") &&
                                    <TreeMarker color={'#850440'} strokeColor={'#FFFFFF'}/>
                                }

                                {(place.primaryType === "library") &&
                                    <BookMarker color={'#850440'}/>
                                }


                                {(place.primaryType === "hiking_area") &&
                                    <WalkingMarker color={'#850440'}/>
                                }

                                {(place.primaryType === "zoo") &&
                                    <ZooMarker color={'#850440'}/>
                                }

                                {(place.primaryType === "tourist_attraction" || place.primaryType === "visitor_center") &&
                                    <TouristAttractions color={'#850440'}/>
                                }

                                
                                {/* <BookMarker color={'#850440'}/> */}
                            </div>
                        </AdvancedMarker>
                    ))
                }
                {/* <AdvancedMarker position={userLocation}>
                <Pin
                    background={'#0f9d58'}
                    borderColor={'#006425'}
                    glyphColor={'#60d98f'}
                />
                </AdvancedMarker> */}
            </GoogleMap>
            </div>
            
        </APIProvider>
    );
}

export default Map;