import React, { useContext, useEffect, useState } from 'react';
import styles from './suggestions.module.css';
import PlaceCard from '../placeCard/PlaceCard';
import filterCategories from './sugestionsFilterCategories.json';
import { PlacesContext } from '../../../context/LocationsContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useLoggedInUser from '../../../hooks/useLoginUser';
import FilterBtn from '../../global/btns/filterBtn/FilterBtn';
import FilterOptions from './filterOptions/FilterOptions';

const Suggestions = ({ page }) => {
  const { loggedInUser } = useLoggedInUser();
  const { tripId } = useParams();
  const { places, setPlaces, setError } = useContext(PlacesContext);
  const [getCurrentPlaces, setGetCurrentPlaces] = useState(false);
  const [citiesLocations, setCitiesLocations] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);


  const { state } = useLocation();
  const [forceRerenderCardComponent, setForceRenderCardComponent] = useState(state ? state : 0);

  const navigate = useNavigate();

  // Refresh component when a location gets saved to the database
  useEffect(() => {
    function rerenderComponent() {
      setForceRenderCardComponent(state);
    }
    const timeout = setTimeout(rerenderComponent, 100);
    return () => clearTimeout(timeout);
  }, [state]);


  // Get the longitude & latidude of the cities that the user wants to visit
  async function getLocationOfCity(city) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    } else {
      throw new Error(`Location not found for city: ${city}`);
    }
  }

  // Get trip data from db
  const getTripData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripId}`, {
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
      console.log('tripData', data);

      const citiesLocationsArr = await Promise.all(data.cities.map(async (city) => {
        const location = await getLocationOfCity(city);
        return {
          city,
          ...location
        };
      }));

      console.log(citiesLocationsArr, 'citiesArray');
      setCitiesLocations(citiesLocationsArr);
      if (citiesLocationsArr.length > 0) {
        setSelectedCity(citiesLocationsArr[0]);
      }
    } catch (error) {
      console.error('Failed to fetch this trip:', error);
    }
  };

  useEffect(() => {
    getTripData();
  }, [tripId]);


  // default values for the activity filters 
  const [filterOptionsVisible, setFilterOptionsVisible] = useState(false);

  const [includeTypes, setIncludeTypes] = useState({
    thingsToDo: [
      filterCategories.thingsToDo[1].value,
      filterCategories.thingsToDo[7].value,
      filterCategories.thingsToDo[9].value,
      filterCategories.thingsToDo[12].value,
      filterCategories.sport[0].value
    ],
    foodAndDrinks: [],
    accomodations: [
      filterCategories.accomodations[0].value,
      filterCategories.accomodations[1].value,
      filterCategories.accomodations[3].value,
      filterCategories.accomodations[5].value,
      filterCategories.accomodations[6].value,
      filterCategories.accomodations[7].value
    ]
  });



  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const filtersOnFetch = page === "accomodations" ? includeTypes.accomodations : [
    ...includeTypes.thingsToDo,
    ...includeTypes.foodAndDrinks
  ];

  // Fetch location specific data from google maps api
  const searchPlaces = async () => {
    console.log('filterFetch', filtersOnFetch);
    if (!selectedCity) return;

    try {
      const response = await fetch(`https://places.googleapis.com/v1/places:searchNearby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.photos,places.primaryType,places.types,places.rating,places.userRatingCount,places.location',
        },
        body: JSON.stringify({
          "locationRestriction": {
            "circle": {
              "center": {
                "latitude": selectedCity.lat,
                "longitude": selectedCity.lng
              },
              "radius": 2000.0
            }
          },
          "includedTypes": filtersOnFetch,
          "languageCode": "en",
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('fetched suggestion', data);
      setPlaces(data.places || []);
      setGetCurrentPlaces(true);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    searchPlaces();
  
  }, [forceRerenderCardComponent, selectedCity]);


  // Handle input change of the location filters
  function handleChangeFilterInputs(category, selectedValues) {
    const selectedCategories = selectedValues.map((category) => category.value);
    console.log('selectedCat', selectedCategories);
    setIncludeTypes(prevIncludeTypes => ({
      ...prevIncludeTypes,
      [category]: selectedCategories
    }));
  }

  // Handle save of the values in the location filters
  function onSave() {
    setPlaces([]);
    setGetCurrentPlaces(false);
    searchPlaces();
  }

    return (
      <div className={styles.suggestions}>

        <div className={styles.flexContainer}>
          <div className={styles.titleContainer}>
            <button onClick={() => navigate(-1)}><i className="fi fi-sr-angle-left"></i></button>
            <h1>Suggestions</h1>
          </div>
          <button className={styles.filter} onClick={() => setFilterOptionsVisible(prev => !prev)}>
            <i className={filterOptionsVisible ? 'fi fi-rr-clear-alt' : 'fi fi-rr-filter'}></i>
          </button>
        </div>


        {filterOptionsVisible && (
        <FilterOptions
          page={page} 
          filterCategories={filterCategories} 
          includeTypes={includeTypes} 
          handleChangeFilterInputs={handleChangeFilterInputs} 
          onSave={onSave} 
        />
      )}
      

        {
          citiesLocations.length > 1 &&

          <div className={styles.cityButtons}>
            {citiesLocations.map((cityLocation) => (
                <FilterBtn key={cityLocation.city} isSelected={selectedCity && selectedCity.city === cityLocation.city ? true : false} handleClick={()=> setSelectedCity(cityLocation)} title={cityLocation.city}/>
            ))}
          </div>
        }

        {
          getCurrentPlaces ?

          <div className='gridPlanSidebar'>
            {places.length > 0 && places.map((place) => {
              return (
                <PlaceCard key={`suggestions-place-${place.id}`} place={place} isSuggestion={true} tripId={tripId} isItinerary={false}/>
              )
            })}
          </div>

          : 

          <p>Loading suggestions...</p>

        }
      </div>
    );
  
};

export default Suggestions;
