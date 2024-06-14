import React, { useState } from 'react';

const PlacesSearch = () => {
  const [query, setQuery] = useState('Spicy Vegetarian Food in Sydney, Australia');
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('search');

  const [type, setType] = useState('restaurant');

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; 
  const searchPlaces = async () => {
    try {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.photos,places.primaryTypeDisplayName,places.types,places.priceLevel,places.rating,places.userRatingCount,places.regularOpeningHours,places.websiteUri,places.servesVegetarianFood',
        },
        body: JSON.stringify({
            "textQuery": "Eat & drink in Ghent, Belgium",
            "includedType": "coffee_shop",
            "minRating": 3,
            "locationBias": {
              "circle": {
                "center": {
                  "latitude": 51.049999,
                  "longitude": 3.733333
                },
                "radius": 2000.0
              } 
            },
            // "languageCode": "en",
            // "priceLevels":["PRICE_LEVEL_INEXPENSIVE", "PRICE_LEVEL_MODERATE"]


            
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



  return (
    <div>
      <h1>Suggestions</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your search query"
      />
      <button onClick={searchPlaces}>Search</button>
      {error && <p>Error: {error}</p>}

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

export default PlacesSearch;
