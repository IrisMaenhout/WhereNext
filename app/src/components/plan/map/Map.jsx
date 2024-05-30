import React, { useContext, useEffect } from 'react';
import styles from './map.module.css';
import { APIProvider, AdvancedMarker, Map as GoogleMap, Pin } from '@vis.gl/react-google-maps';
import { PlacesContext } from '../../../context/LocationsContext';
import MarkerTypes from './markerTypes/MarkerTypes';
import { SelectedPlaceContext } from '../../../context/SelectedPlaceContext';
import { useNavigate } from 'react-router-dom';

function Map(props) {
    const coordinates = { lat: 0, lng: 0 };
    const { selectedPlaceId, setSelectedPlaceId } = useContext(SelectedPlaceContext);
    const { places } = useContext(PlacesContext);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("Updated places in map:", places);
    }, [places]);


    function handleMarkerClick(placeId) {
        setSelectedPlaceId(placeId);
        // Navigate to detail page of selected location
        navigate(`/place/${placeId}`);
    }

    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} language='en'>
            <div className={styles.mapContainer}>
                <GoogleMap
                    defaultCenter={{ lat: 40.7, lng: -74 }}
                    defaultZoom={12}
                    minZoom={4}
                    mapId={process.env.REACT_APP_SIMPLE_MAP_STYLE_ID}
                    gestureHandling={'greedy'}
                >
                    {places.map(place => (
                        <AdvancedMarker
                            key={`location-${place.id}-marker`}
                            position={{ lat: place.location.latitude, lng: place.location.longitude }}
                            onClick={() => handleMarkerClick(place.id)}
                        >
                            <div width={24} height={24}>
                                {selectedPlaceId === place.id ? (
                                    <Pin
                                        background={'#0f9d58'}
                                        borderColor={'#006425'}
                                        glyphColor={'#60d98f'}
                                    />
                                ) : (
                                    <MarkerTypes place={place} page={"suggestions"} />
                                )}
                            </div>
                        </AdvancedMarker>
                    ))}
                </GoogleMap>
            </div>
        </APIProvider>
    );
}

export default Map;
