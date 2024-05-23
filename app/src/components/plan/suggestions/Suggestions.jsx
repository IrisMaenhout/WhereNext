import React, { useEffect, useState } from 'react';
import styles from './suggestions.module.css';
import PlaceCard from '../placeCard/PlaceCard';

const Suggestions = () => {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const location = {
    lat: 51.049999,
    lng: 3.733333
  };

  const method = ':searchNearby';
  //:searchText

  const [activeTab, setActiveTab] = useState('search');

  // const [type, setType] = useState('restaurant');

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  const searchPlaces = async () => {
    try {
      const response = await fetch(`https://places.googleapis.com/v1/places${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.photos,places.primaryTypeDisplayName,places.types,places.priceLevel,places.rating,places.userRatingCount,places.regularOpeningHours,places.websiteUri,places.servesVegetarianFood',
        },
        body: JSON.stringify({
          "minRating": 5,
          "locationRestriction": {
            "circle": {
              "center": {
                "latitude": location.lat,
                "longitude": location.lng
              },
              "radius": 2000.0
            } 
          },
          "includedTypes": ["restaurant", "museum"],
          "excludedTypes": ["hotel"]
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
  }, [method]); // Include 'method' as a dependency

  useEffect(() => {
    console.log(places); // Log places whenever it updates
  }, [places]);

  return (
    <div>
      <h1>Suggestions</h1>
      {/* <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your search query"
      />
      <button onClick={searchPlaces}>Search</button>
      {error && <p>Error: {error}</p>} */}

      {/* <div className={styles.toggleBtns}>
        <button onClick={() => setActiveTab('search')}>Search</button>
        <button onClick={() => setActiveTab('settings')}>Settings</button>
        <button onClick={() => setActiveTab('results')}>Results</button>
      </div> */}

      {
        places.length > 0 &&

        places.map((place)=> (
          <PlaceCard place={place}/>
        ))
      }
      
      {/* <ul>
        {places.map((place, index) => (
          <li key={index}>
            <h2>{place.displayName}</h2>
            <p>{place.formattedAddress}</p>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default Suggestions;
