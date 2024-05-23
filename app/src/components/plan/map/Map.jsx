import React, { useEffect, useState } from 'react';
// import GoogleMapReact from 'google-map-react';
import styles from './map.module.css';
import { APIProvider, AdvancedMarker, Map as GoogleMap, Pin } from '@vis.gl/react-google-maps';

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