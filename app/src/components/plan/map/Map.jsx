import React, { useContext, useEffect, useState, useRef } from 'react';
import styles from './map.module.css';
import { APIProvider, AdvancedMarker, Map as GoogleMap } from '@vis.gl/react-google-maps';
import { PlacesContext } from '../../../context/LocationsContext';
import MarkerTypes from './markerTypes/MarkerTypes';
import { useNavigate, useParams } from 'react-router-dom';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';

function Map(props) {
    const { places, setPlaces } = useContext(PlacesContext);
    const { googlePlaceId } = useParams();
    const navigate = useNavigate();
    const initialCenter = places.length === 1 ? { lat: places[0].location.latitude, lng: places[0].location.longitude } : { lat: 40.7, lng: -74 };
    const [mapCenter, setMapCenter] = useState(initialCenter);
    const [mapKey, setMapKey] = useState(0);

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [searchBarValue, setSearchBarValue] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState(undefined);
    const [mapType, setMaptype] = useState('simple');
    
    

    useEffect(() => {
        console.log("Updated places in map:", places);
    }, [places]);

    function handleMarkerClick(placeId) {
        console.log(placeId);
        navigate(`../place/${placeId}/overview`);
    }

    function handleSearchInputChange(e) {
        console.log('event', e.target.value);
        setSearchBarValue(e.target.value);
    }

    const searchLocationBar = async () => {
        try {
            const response = await fetch(`https://places.googleapis.com/v1/places:autocomplete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                },
                body: JSON.stringify({
                    "input": searchBarValue,
                    "includedRegionCodes": ["eu", "uk", "al", "mc", "ad", "am", "ba", "ge", "is", "li", "me", "no", "ch"],
                    "languageCode": "en",
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setSearchSuggestions(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (searchBarValue !== '') {
            searchLocationBar();
        }
    }, [searchBarValue]);

    useEffect(()=>{
        if(googlePlaceId){
            fetchPlaceDetails(googlePlaceId, true);
        }
    }, [googlePlaceId])

    const fetchPlaceDetails = async (placeId, placeDetail) => {
        const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=displayName,id,formattedAddress,photos,primaryType,types,location,rating,userRatingCount,currentOpeningHours,regularOpeningHours,internationalPhoneNumber,websiteUri,editorialSummary,goodForGroups,reservable,reviews&languageCode=en&key=${apiKey}`);
        const data = await response.json();
        const location = data.location;
        const newCenter = { lat: location.latitude, lng: location.longitude };
        if(placeDetail){
            setPlaces([data]);
            setMapCenter(newCenter);
            setMapKey(prevKey => prevKey + 1);
        }else{
            console.log('Place details:', data);
            setMapCenter(newCenter);
            setMapKey(prevKey => prevKey + 1); // Force rerender by changing the key
        }
        

        // if (mapRef.current) {
        //     mapRef.current.panTo(newCenter); // Use panTo method of the map instance
        // }
    };

    const handleSuggestionSelect = async (suggestionId, suggestionTypes) => {
        if (suggestionTypes.includes('country') || suggestionTypes.includes('locality') || suggestionTypes.includes('political') || suggestionTypes.includes('geocode')) {
            await fetchPlaceDetails(suggestionId, false);
        } else {
            navigate(`../../place/${suggestionId}/overview`);
            await fetchPlaceDetails(suggestionId, true);
        }
    };

    return (
        <div className={styles.mapComponent}>
            <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} language='en'>
                {/* {places.length !== 0 && */}
                    <>
                        <div className={styles.mapContainer}>
                            <div className={styles.mapTools}>
                                <div className={styles.searchbarFunctionality}>
                                    <Combobox value={searchBarValue} onChange={(value) => {
                                        if (value !== null) {
                                            handleSuggestionSelect(value.id, value.types);
                                        }
                                    }} onClose={() => setSearchBarValue('')}>
                                        <ComboboxInput
                                            aria-label="Search location"
                                            displayValue={() => searchBarValue}
                                            onChange={handleSearchInputChange}
                                            className={styles.searchBar}
                                            placeholder='Search a location...'
                                        />
                                        <ComboboxOptions className={styles.suggestionsBox}>
                                            {(searchSuggestions !== undefined && searchSuggestions.suggestions !== undefined) && searchSuggestions.suggestions.map((suggestion) => (
                                                <ComboboxOption key={suggestion.placePrediction.placeId} value={{ id: suggestion.placePrediction.placeId, types: suggestion.placePrediction.types }}>
                                                    <p className={styles.suggestionOption}>{suggestion.placePrediction.text.text}</p>
                                                </ComboboxOption>
                                            ))}
                                        </ComboboxOptions>
                                    </Combobox>
                                </div>

                            </div>


                            <GoogleMap
                                key={mapKey}
                                defaultCenter={mapCenter}
                                defaultZoom={places.length === 1 ? 15 : 12}
                                minZoom={4}
                                mapId={mapType === "simple" ? process.env.REACT_APP_SIMPLE_MAP_STYLE_ID : process.env.REACT_APP_COMPLEX_MAP_STYLE_ID}
                                gestureHandling={'greedy'}
                                reuseMaps={true}
                                disableDefaultUI={true}
                                streetViewControl={true}
                            >
                                {places.length !== 0 && (places.map((place, i) => (
                                    <AdvancedMarker
                                        key={`location-${i}-marker`}
                                        position={{ lat: place.location.latitude, lng: place.location.longitude }}
                                        onClick={() => handleMarkerClick(place.id)}
                                    >
                                        <div width={24} height={24}>
                                            <MarkerTypes place={place} page={"detail"} />
                                        </div>
                                    </AdvancedMarker>)
                                ))}
                            </GoogleMap>
                        </div>
                    </>
                {/* } */}
            </APIProvider>
        </div>
    );
}

export default Map;
