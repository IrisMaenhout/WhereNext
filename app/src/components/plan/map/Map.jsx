import React from 'react';
// import GoogleMapReact from 'google-map-react';
import styles from './map.module.css';

function Map(props) {
    const coordinates = { lat: 0, lng: 0};


    return (
        <div className={styles.mapContainer}>
            {/* <GoogleMapReact
                bootstrapURLKeys={{ key: ''}}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                mapId={''}
                margin={[50, 50, 50, 50]}
                options={''}
                onChange={''}
                onChildClick={''}
            
            > */}

            {/* </GoogleMapReact> */}
        </div>
    );
}

export default Map;