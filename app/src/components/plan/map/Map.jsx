import React, { useContext, useEffect, useState } from 'react';
import styles from './map.module.css';
import { APIProvider, AdvancedMarker, Map as GoogleMap } from '@vis.gl/react-google-maps';
import { PlacesContext } from '../../../context/LocationsContext';
import MarkerTypes from './markerTypes/MarkerTypes';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { useHistory } from '../../../liveblocks.config';

function Map(props) {
    const { places, setPlaces } = useContext(PlacesContext);
    const loggedInUser = useContext(LoggedInUserContext);
    const { googlePlaceId, tripId } = useParams();
    const navigate = useNavigate();

    const [cityCenter, setCityCenter] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [mapKey, setMapKey] = useState(0);
    const [loading, setLoading] = useState(true);

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [searchBarValue, setSearchBarValue] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState(undefined);
    const [mapType, setMaptype] = useState('simple');

    const urlLocation = useLocation();


    const getTripCityLocation = async () => {
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

            const geographyResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${data.cities[0]}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
            const geographyData = await geographyResponse.json();

            if (geographyData.results.length > 0) {
                const location = geographyData.results[0].geometry.location;
                setCityCenter({ lat: location.lat, lng: location.lng });
                setMapCenter({ lat: location.lat, lng: location.lng });
                setMapKey(prevKey => prevKey + 1); // Force re-render
            } else {
                console.error('No results found for the specified city.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTripCityLocation();
    }, []);

    function handleMarkerClick(placeId) {
        navigate(`/trip/${tripId}/place/${placeId}/overview`);
    }

    function handleSearchInputChange(e) {
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
            setSearchSuggestions(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        if (searchBarValue !== '') {
            searchLocationBar();
        }
    }, [searchBarValue]);

    useEffect(() => {
        if (googlePlaceId) {
            fetchPlaceDetails(googlePlaceId, true);
        }
    }, [googlePlaceId]);

    const fetchPlaceDetails = async (placeId, placeDetail) => {
        const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=displayName,id,formattedAddress,photos,primaryType,types,location,rating,userRatingCount,currentOpeningHours,regularOpeningHours,internationalPhoneNumber,websiteUri,editorialSummary,goodForGroups,reservable,reviews&languageCode=en&key=${apiKey}`);
        const data = await response.json();
        const location = data.location;
        const newCenter = { lat: location.latitude, lng: location.longitude };
        if (placeDetail) {
            setPlaces([data]);
            setMapCenter(newCenter);
            setMapKey(prevKey => prevKey + 1);
        } else {
            setMapCenter(newCenter);
            setMapKey(prevKey => prevKey + 1); // Force rerender by changing the key
        }
    };

    const handleSuggestionSelect = async (suggestionId, suggestionTypes) => {
        if (suggestionTypes.includes('country') || suggestionTypes.includes('locality') || suggestionTypes.includes('political') || suggestionTypes.includes('geocode')) {
            await fetchPlaceDetails(suggestionId, false);
        } else {
            navigate(`/trip/${tripId}/place/${suggestionId}/overview`);
            await fetchPlaceDetails(suggestionId, true);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.mapComponent}>
            <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} language='en'>
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
                        {
                        urlLocation.pathname.includes('/itinerary') &&
                        places.length !== 0 && (places.map((place, i) => (
                            <AdvancedMarker
                                key={`location-${i}-marker`}
                                position={{ lat: place.location.latitude, lng: place.location.longitude }}
                                onClick={() => handleMarkerClick(place.id)}
                            >
                                <div width={24} height={24}>
                                    <MarkerTypes place={place} page={"itinerary"} />
                                </div>
                            </AdvancedMarker>)
                        ))}

                        {
                        urlLocation.pathname.includes('/bucket-list') &&
                        places.length !== 0 && (places.map((place, i) => (
                            <AdvancedMarker
                                key={`location-${i}-marker`}
                                position={{ lat: place.location.latitude, lng: place.location.longitude }}
                                onClick={() => handleMarkerClick(place.id)}
                            >
                                <div width={24} height={24}>
                                    <MarkerTypes place={place} page={"bucketList"} />
                                </div>
                            </AdvancedMarker>)
                        ))}

                        {
                        urlLocation.pathname.includes('/accomodations') &&
                        places.length !== 0 && (places.map((place, i) => (
                            <AdvancedMarker
                                key={`location-${i}-marker`}
                                position={{ lat: place.location.latitude, lng: place.location.longitude }}
                                onClick={() => handleMarkerClick(place.id)}
                            >
                                <div width={24} height={24}>
                                    <MarkerTypes place={place} page={"accomodations"} />
                                </div>
                            </AdvancedMarker>)
                        ))}

                        {
                        (urlLocation.pathname.includes('/suggestions') || (urlLocation.pathname.includes('/overview') || urlLocation.pathname.includes('/visiting-info') || urlLocation.pathname.includes('/reviews'))) &&
                        places.length !== 0 && (places.map((place, i) => (
                            <AdvancedMarker
                                key={`location-${i}-marker`}
                                position={{ lat: place.location.latitude, lng: place.location.longitude }}
                                onClick={() => handleMarkerClick(place.id)}
                            >
                                <div width={24} height={24}>
                                    <MarkerTypes place={place} page={"suggestions"} />
                                </div>
                            </AdvancedMarker>)
                        ))}
                    </GoogleMap>
                </div>
            </APIProvider>
        </div>
    );
}

export default Map;
