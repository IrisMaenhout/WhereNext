import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Overview from './overview/Overview';
import Reviews from './reviews/Reviews';
import VisitingInfo from './visitingInfo/VisitingInfo';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { PlacesContext } from '../../../context/LocationsContext';

function PlaceDetails(props) {
    const { places, setPlaces, setError } = useContext(PlacesContext);
    const { googlePlaceId } = useParams();
    const navigate = useNavigate();
    // const [googlePlaceData, setGooglePlaceData] = useState(undefined);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const { state } = useLocation();
    const [savedLocationData, setSavedLocationData] = useState([]);
    const loggedInUser = useContext(LoggedInUserContext);
    const tripId = "6654e2621cbe496564c8192d";
    const [forceRerenderCardComponent, setForceRenderCardComponent] = useState(state ? state : 0);

    const fullStars = Math.floor(places[0]?.rating);
    const halfStars = places[0]?.rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    const [coverImage, setCoverImage] = useState('');

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

          console.log("dbData",data);
          setSavedLocationData(data);
        //   setPlaces(data.places || []);
        } catch (error) {
        //   setError(error.message);
        }
      };
    
      useEffect(() => {
        getLocationDB();
      }, [forceRerenderCardComponent]);

    const getGooglePlaceData = () => {
        fetch(`https://places.googleapis.com/v1/places/${places.length === 1 ?places[0].id : googlePlaceId}?fields=displayName,id,formattedAddress,photos,primaryType,types,location,rating,userRatingCount,currentOpeningHours,regularOpeningHours,internationalPhoneNumber,websiteUri,editorialSummary,goodForGroups,reservable,reviews&languageCode=en&key=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                setPlaces([data]);
                console.log('content', data);
            });
    };

    useEffect(() => {
        getGooglePlaceData();
        console.log('somthing',places, places[0]);
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
        navigate(-1);
    }

    

    if (places.length === 1) {
        return (
            // <Overview 
            //     fullStars={fullStars}
            //     halfStars={halfStars}
            //     emptyStars={emptyStars}
            //     googlePlaceId={googlePlaceId}
            //     googlePlaceData={places[0]}
            //     tripId={tripId}
            //     handleGoBackArrowFunc={handleGoBackArrowFunc}
            //     coverImage={coverImage}
            // />

            // <Reviews
            //     googlePlaceData={places[0]}
            //     googlePlaceId={googlePlaceId} 
            //     tripId={tripId}
            //     handleGoBackArrowFunc={handleGoBackArrowFunc}
            
            // />

            <VisitingInfo 
                handleGoBackArrowFunc={handleGoBackArrowFunc}
                googlePlaceData={places[0]}
                googlePlaceId={googlePlaceId}
                tripId={tripId}
                savedLocationData={savedLocationData}
            />
        );
    } else {
        return <></>
    }
}

export default PlaceDetails;