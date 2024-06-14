import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Overview from './overview/Overview';
import Reviews from './reviews/Reviews';
import VisitingInfo from './visitingInfo/VisitingInfo';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { PlacesContext } from '../../../context/LocationsContext';

function PlaceDetails({page}) {
    const { tripId, googlePlaceId } = useParams();
    const { places, setPlaces, setError } = useContext(PlacesContext);
    const loggedInUser = useContext(LoggedInUserContext);
    const navigate = useNavigate();
    // const [googlePlaceData, setGooglePlaceData] = useState(undefined);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const { state } = useLocation();
    const [savedLocationData, setSavedLocationData] = useState([]);
    
    const [forceRerenderCardComponent, setForceRenderCardComponent] = useState(state ? state : 0);

    const fullStars = Math.floor(places[0]?.rating);
    const halfStars = places[0]?.rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    const [coverImage, setCoverImage] = useState('');

    const location = useLocation();

    const getLocationDB = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${googlePlaceId}/inTrip/${tripId}`, {
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

          setSavedLocationData(data);
        } catch (error) {
          setError(error.message);
        }
      };
    
      useEffect(() => {
        getLocationDB();
      }, [forceRerenderCardComponent, tripId, googlePlaceId]);

    const getGooglePlaceData = () => {
        fetch(`https://places.googleapis.com/v1/places/${places.length === 1 ?places[0].id : googlePlaceId}?fields=displayName,id,formattedAddress,photos,primaryType,types,location,rating,userRatingCount,currentOpeningHours,regularOpeningHours,internationalPhoneNumber,websiteUri,editorialSummary,goodForGroups,reservable,reviews&languageCode=en&key=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                setPlaces([data]);
            });
    };

    useEffect(() => {
        getGooglePlaceData();
    }, []);

    const getPictureUrl = async () => {
        try {
            const response = await fetch(`https://places.googleapis.com/v1/${places[0].photos[0].name}/media?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&maxHeightPx=800&maxWidthPx=800`);
            if (response.ok) {
                setCoverImage(response.url);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (places.length !== 0 && places[0].photos?.length > 0) {
            getPictureUrl();
        }
    }, [places]);

    function handleGoBackArrowFunc() {
        setPlaces([]);
        navigate(-1)
    }

    

    if (places.length === 1) {
        if(page === "overview"){
            return(
                <Overview 
                    fullStars={fullStars}
                    halfStars={halfStars}
                    emptyStars={emptyStars}
                    googlePlaceId={googlePlaceId}
                    googlePlaceData={places[0]}
                    tripId={tripId}
                    handleGoBackArrowFunc={handleGoBackArrowFunc}
                    coverImage={coverImage}
                />
            )
            
        }else if(page === "visiting-info"){
            return (
                <VisitingInfo 
                    handleGoBackArrowFunc={handleGoBackArrowFunc}
                    googlePlaceData={places[0]}
                    googlePlaceId={googlePlaceId}
                    tripId={tripId}
                    savedLocationData={savedLocationData}
                />
            )
        }else if(page === "reviews"){
            return (
                <Reviews
                    googlePlaceData={places[0]}
                    googlePlaceId={googlePlaceId} 
                    tripId={tripId}
                    handleGoBackArrowFunc={handleGoBackArrowFunc}
                
                />
            )
        }
    } else {
        return <></>
    }
}

export default PlaceDetails;