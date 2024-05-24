import React, { useContext, useEffect, useState } from 'react';
import styles from './suggestions.module.css';
import PlaceCard from '../placeCard/PlaceCard';
import filterCategories from './sugestionsFilterCategories.json';
import FilterCategories from './filterCategories/FiterCategories';
import PrimaryBtn from '../../global/btns/primary/btn/PrimaryBtn';
import SecondaryBtn from '../../global/btns/secondary/btn/SecondaryBtn';
import { PlacesContext } from '../../../context/locationsContext';

const Suggestions = () => {
  // const [query, setQuery] = useState('');
  const { places, setPlaces, setError } = useContext(PlacesContext);

  // const [places, setPlaces] = useState([]);
  // const [error, setError] = useState(null);
  const location = {
    lat: 51.049999,
    lng: 3.733333
  };

  const [filterOptionsVisible, setFilterOptionsVisible] = useState(false);

  // const [selectedCategories, setSelectedCategories] = useState([

  // ]);
  const [includeTypes, setIncludeTypes] = useState({
    // Set default values for the first select input
    thingsToDo: [
      filterCategories.thingsToDo[1].value,
      filterCategories.thingsToDo[7].value,
      filterCategories.thingsToDo[9].value,
      filterCategories.thingsToDo[12].value,
      filterCategories.sport[0].value
    ],
    // Set default values for the second select input
    foodAndDrinks: [
      
    ]
  });

  const method = ':searchNearby';
  //:searchText



  // const [type, setType] = useState('restaurant');

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  const searchPlaces = async () => {
    try {
      const response = await fetch(`https://places.googleapis.com/v1/places${method}`, {
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
                "latitude": location.lat,
                "longitude": location.lng
              },
              "radius": 2000.0
            } 
          },
          "includedTypes": [
            ...includeTypes.thingsToDo,
            ...includeTypes.foodAndDrinks
          ],
          "excludedTypes": ["hotel"],
          "languageCode": "en",
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPlaces(data.places || []);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (method === ':searchNearby') {
      searchPlaces();
    }
  }, [method]);

  useEffect(() => {
    console.log(places); // Log places whenever it updates
  }, [places]);


  console.log(includeTypes);
  console.log([...includeTypes.foodAndDrinks, ...includeTypes.thingsToDo]);
  


  function handleChangeFilterInputs(category, selectedValues) {
    const selectedCategories = selectedValues.map((category) => category.value);
    setIncludeTypes(prevIncludeTypes => ({
      ...prevIncludeTypes,
      [category]: selectedCategories
    }));
  }

  function onSave(){
    searchPlaces();
  }
  



  const groupedOptionsThingsToDo = [{
    label: 'Things to do',
    options: filterCategories.thingsToDo,
  },
  {
    label: 'Sport',
    options: filterCategories.sport,
  }]

  const groupedOptionsFoodAndDrinks = [{
    label: 'Drinks',
    options: filterCategories.foodAndDrinks.drinks,
  },
  {
    label: 'Asian restaurants',
    options: filterCategories.foodAndDrinks.restaurants.asian,
  },
  {
    label: 'American restaurants',
    options: filterCategories.foodAndDrinks.restaurants.american,
  },
  {
    label: 'European restaurants',
    options: filterCategories.foodAndDrinks.restaurants.european,
  },
  {
    label: 'Middle-eastern restaurants',
    options: filterCategories.foodAndDrinks.restaurants['middle-eastern'],
  },
  {
    label: 'Other restaurants',
    options: filterCategories.foodAndDrinks.restaurants.others,
  }
  ]

  return (
    <div className={styles.suggestions}>

      <div className={styles.flexContainer}>
        <h1>Suggestions</h1>
        <button className={styles.filter} onClick={() => setFilterOptionsVisible(prev => !prev)}>
          <i className={filterOptionsVisible ? 'fi fi-rr-clear-alt' : 'fi fi-rr-filter'}></i>
        </button>
      </div>
      {filterOptionsVisible && 
        <div className={`${styles.filterContainer}`}>
          <div className={styles.flexContainer}>
            <h3>Filter on categories</h3>
            <PrimaryBtn onClick={onSave}>
              Save
            </PrimaryBtn>
          </div>
          <label>Things to do</label>
          <FilterCategories 
            groupedOptions={groupedOptionsThingsToDo}
            defaultSelected={[
              filterCategories.thingsToDo[1],
              filterCategories.thingsToDo[7],
              filterCategories.thingsToDo[9],
              filterCategories.thingsToDo[12],
              filterCategories.sport[0]
            ]}
            handleChange={(selectedValues) => handleChangeFilterInputs('thingsToDo', selectedValues)}
          />
          <label>Restaurants</label>
          <FilterCategories 
            groupedOptions={groupedOptionsFoodAndDrinks}
            defaultSelected={includeTypes.foodAndDrinks}
            handleChange={(selectedValues) => handleChangeFilterInputs('foodAndDrinks', selectedValues)}
          />
        </div>
      }
      
      

      <div className='gridPlanSidebar'>
        {
          places.length > 0 &&

          places.map((place)=> (
            <PlaceCard key={`suggestions-place-${place.id}`} place={place} isSuggestion={true}/>
          ))
        }
      </div>
      
    </div>
  );
};

export default Suggestions;
