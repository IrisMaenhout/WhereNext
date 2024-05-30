import React, { useContext, useEffect, useState } from 'react';
import styles from './suggestions.module.css';
import PlaceCard from '../placeCard/PlaceCard';
import filterCategories from './sugestionsFilterCategories.json';
import FilterCategories from './filterCategories/FiterCategories';
import PrimaryBtn from '../../global/btns/primary/btn/PrimaryBtn';
import SecondaryBtn from '../../global/btns/secondary/btn/SecondaryBtn';
import { PlacesContext } from '../../../context/LocationsContext';

const Suggestions = () => {
  const page = "accomodations";
  // const [query, setQuery] = useState('');
  const { places, setPlaces, setError } = useContext(PlacesContext);
  const tripId = "6654e2621cbe496564c8192d";

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
      
    ],
    accomodations: [
      filterCategories.accomodations[0].value,
      filterCategories.accomodations[1].value,
      filterCategories.accomodations[3].value,
      filterCategories.accomodations[5].value,
      filterCategories.accomodations[6].value,
      filterCategories.accomodations[7].value
    ]
  });

  const method = ':searchNearby';
  //:searchText



  // const [type, setType] = useState('restaurant');

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const filtersOnFetch = page === "accomodations" ? includeTypes.accomodations : [
    ...includeTypes.thingsToDo,
    ...includeTypes.foodAndDrinks
  ]
  
  const searchPlaces = async () => {
    console.log('filterFetch',filtersOnFetch);
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
          "includedTypes": filtersOnFetch,
          // "excludedTypes": ["hotel"],
          "languageCode": "en",
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
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
  


  function handleChangeFilterInputs(category, selectedValues) {
    const selectedCategories = selectedValues.map((category) => category.value);
    console.log('selectedCat',selectedCategories)
    setIncludeTypes(prevIncludeTypes => ({
      ...prevIncludeTypes,
      [category]: selectedCategories
    }));
  }

  function onSave(){
    searchPlaces();
  }
  



  const groupedOptionsAccomodations = [{
    label: 'Accomodations',
    options: filterCategories.accomodations,
  }];



  const groupedOptionsThingsToDo = [{
    label: 'Things to do',
    options: filterCategories.thingsToDo,
  },
  {
    label: 'Sport',
    options: filterCategories.sport,
  }];

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
  ];

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

          {
            page === "accomodations" ?
            <>
              <label>Accomodations</label>
              <FilterCategories 
                groupedOptions={groupedOptionsAccomodations}
                defaultSelected={[
                  filterCategories.accomodations[0],
                  filterCategories.accomodations[1],
                  filterCategories.accomodations[3],
                  filterCategories.accomodations[5],
                  filterCategories.accomodations[6],
                  filterCategories.accomodations[7]
                ]}
                handleChange={(selectedValues) => handleChangeFilterInputs('accomodations', selectedValues)}
              />
            </>
            
            :
            
            <>
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
            
            </>
            
          }
          
        </div>
      }
      
      

      <div className='gridPlanSidebar'>
        {
          places.length > 0 ?

          places.map((place)=> (
            <PlaceCard key={`suggestions-place-${place.id}`} place={place} isSuggestion={true} tripId={tripId}/>
          ))

          :

          <p>There are no results for these categories</p>

        }
      </div>

      
    </div>
  );
};

export default Suggestions;
