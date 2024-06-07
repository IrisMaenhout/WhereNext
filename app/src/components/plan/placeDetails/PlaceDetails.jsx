import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Overview from './overview/Overview';
import Reviews from './reviews/Reviews';
import VisitingInfo from './visitingInfo/VisitingInfo';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';

function PlaceDetails(props) {
    const { googlePlaceId } = useParams();
    const navigate = useNavigate();
    const [googlePlaceData, setGooglePlaceData] = useState(undefined);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const { state } = useLocation();
    const [savedLocationData, setSavedLocationData] = useState([]);
    const loggedInUser = useContext(LoggedInUserContext);
    const tripId = "6654e2621cbe496564c8192d";
    const [forceRerenderCardComponent, setForceRenderCardComponent] = useState(state ? state : 0);

    const fullStars = Math.floor(googlePlaceData?.rating);
    const halfStars = googlePlaceData?.rating % 1 !== 0 ? 1 : 0;
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
        fetch(`https://places.googleapis.com/v1/places/${googlePlaceId}?fields=displayName,formattedAddress,photos,primaryType,types,location,rating,userRatingCount,currentOpeningHours,regularOpeningHours,internationalPhoneNumber,priceLevel,websiteUri,editorialSummary,goodForGroups,reservable,reviews&languageCode=en&key=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                setGooglePlaceData(data);
                console.log('content', data);
            });
    };

    useEffect(() => {
        getGooglePlaceData();
    }, []);

    const getPictureUrl = async () => {
        try {
            const response = await fetch(`https://places.googleapis.com/v1/${googlePlaceData.photos[0].name}/media?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&maxHeightPx=800&maxWidthPx=800`);
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
        if (googlePlaceData && googlePlaceData.photos?.length > 0) {
            getPictureUrl();
        }
    }, [googlePlaceData]);

    function handleGoBackArrowFunc() {
        navigate(-1);
    }

    

    if (googlePlaceData !== undefined) {
        return (
            // <Overview 
            //     fullStars={fullStars}
            //     halfStars={halfStars}
            //     emptyStars={emptyStars}
            //     googlePlaceId={googlePlaceId}
            //     googlePlaceData={googlePlaceData}
            //     tripId={tripId}
            //     handleGoBackArrowFunc={handleGoBackArrowFunc}
            //     coverImage={coverImage}
            // />

            // <Reviews
            //     googlePlaceData={googlePlaceData}
            //     googlePlaceId={googlePlaceId} 
            //     tripId={tripId}
            //     handleGoBackArrowFunc={handleGoBackArrowFunc}
            
            // />

            <VisitingInfo 
                handleGoBackArrowFunc={handleGoBackArrowFunc}
                googlePlaceData={googlePlaceData}
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