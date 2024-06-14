import React, { useContext, useEffect, useState } from 'react';
import styles from './addTrip.module.css';
import Calendar from '../calendarSidebar/calendar/Calendar';
import CreatableSelect from 'react-select/creatable';
import Header from '../../global/header/Header';
import PrimaryBtn from '../../global/btns/primary/btn/PrimaryBtn';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { useNavigate, useParams } from 'react-router-dom';

function AddTrip({isEditPage}) {
    const {tripId} = useParams();
    const loggedInUser = useContext(LoggedInUserContext);
    const sessionData = sessionStorage.getItem("newTripData");
    const sessionDataObj = (sessionData && !isEditPage) ? JSON.parse(sessionData) : null;
    const [countryImage, setCountryImage] = useState();
    const [isOpenCalenderSelect, setIsOpenCalenderSelect] = useState(false);
    const [currentFormData, setCurrentFormData] = useState(sessionDataObj ? {
        title: isEditPage ? '' : sessionDataObj.title,
        country: {
            name: isEditPage ? '' : sessionDataObj.country,
            location: {
                lat: isEditPage ? null : sessionDataObj.lat,
                lng: isEditPage ? null : sessionDataObj.lng,
            }
        },
        startDate: null,
        endDate: null,
        allDatesArray: [],
        citiesArray: [],
    } : {
        title: '',
        country: {
            name: '',
            location: {
                lat: null,
                lng: null,
            }
        },
        startDate: null,
        endDate: null,
        allDatesArray: [],
        citiesArray: [],
    });
    

    const [validationErrors, setValidationErrors] = useState({
        dates: null,
        cities: null
    })

    const navigate = useNavigate();

    const getCountryImage = async () => {
        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=${currentFormData.country.name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.REACT_APP_PEXEL_API_KEY
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCountryImage(data.photos[0].src.portrait);
        } catch (error) {
            console.error(error.message);
        }
    };


    const getTripData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.REACT_APP_PEXEL_API_KEY
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            if (data) {
                setCurrentFormData({
                    title: data.tripName,
                    country: {
                        name: data.country.name,
                        location: data.country.location,
                    },
                    citiesArray: data.cities,
                    startDate: data.startDate.split('T')[0],
                    endDate: data.endDate.split('T')[0],
                    allDatesArray: data.datesArray
                });
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(()=>{
        if(isEditPage){
            getTripData();
        }
    }, [tripId, isEditPage]);
    

    // useEffect(() => {
    //     if(sessionDataObj){
    //         getCountryImage();
    //     }
        
    // }, [currentFormData.country]);


    const calendarOptions = {
        // input: true,
        type: 'multiple',
        settings: {
          range: {
            disablePast: true,
          },
          selection: {
            day: 'multiple-ranged',
          },
          visibility: {
            daysOutside: false,
            theme: 'light'
          },

            selected: {
                dates: currentFormData.startDate ? [`${currentFormData.startDate}:${currentFormData.endDate}`] : [],
                
              },
          
        },
        
        actions: {
            
            clickDay(event, self) {

                if(self.selectedDates.length > 1){
                    setCurrentFormData((prevValue)=> {
                        const dateArrayStrings = self.selectedDates;

                        return (
                            {
                                ...prevValue,
                                allDatesArray: dateArrayStrings,
                                startDate: dateArrayStrings[0],
                                endDate: dateArrayStrings[dateArrayStrings.length - 1]
                            }
                        )
                        
                    });

                    setIsOpenCalenderSelect(false);
                }

                
            },
        }
    };


    function handleCitiesInputChange(cities) {
        setCurrentFormData(prevValue => {

            const updatedCitiesArray = cities.map(city => {
                return city.value;
            })

            return (
                {
                    ...prevValue,
                    citiesArray: updatedCitiesArray
                }
            )
        })
    }

    async function handleSubmitCreate() {
        function isPayloadValid(obj) {
            return obj.allDatesArray.length >= 2 && obj.citiesArray.length > 0;
        }
    
        if (isPayloadValid(currentFormData)) {
            // Submit to db
            try {
               
                  const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/add`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'authorization': loggedInUser._id
                    },
                    body: JSON.stringify({
                        tripName: currentFormData.title,
                        startDate: currentFormData.startDate,
                        endDate: currentFormData.endDate,
                        datesArray: currentFormData.allDatesArray,
                        // "password": "dit is een wachtwoord",
                        country: {
                            name: currentFormData.country.name,
                            location: currentFormData.country.location
                        },
                        cities: currentFormData.citiesArray
                    }),
                  });
            
                  if (!response.ok) {
                    throw new Error(response.statusText);
                  }
            
                  const data = await response.json();
                  navigate(`/trip/${data._id}/plan/bucket-list`);
                  
            } catch (error) {
                throw new Error(error);
            }
            
        } else {
            let newErrorsObj = {
                dates: null,
                cities: null
            };
    
            if (currentFormData.allDatesArray.length < 2) {
                newErrorsObj.dates = 'Select at least 2 dates.';
            }
    
            if (currentFormData.citiesArray.length === 0) {
                newErrorsObj.cities = 'You need to type at least one city.';
            }
    
            setValidationErrors(newErrorsObj);
        }
        
    }


    
    async function handleSubmitEdit() {
        function isPayloadValid(obj) {
            return obj.allDatesArray.length >= 2 && obj.citiesArray.length > 0;
        }
    
        if (isPayloadValid(currentFormData)) {
            // Submit to db
            try {
               
                  const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripId}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                      'authorization': loggedInUser._id
                    },
                    body: JSON.stringify({
                        tripName: currentFormData.title,
                        startDate: currentFormData.startDate,
                        endDate: currentFormData.endDate,
                        datesArray: currentFormData.allDatesArray,
                        // "password": "dit is een wachtwoord",
                        country: {
                            name: currentFormData.country.name,
                            location: currentFormData.country.location
                        },
                        cities: currentFormData.citiesArray
                    }),
                  });
            
                  if (!response.ok) {
                    throw new Error(response.statusText);
                  }
            
                  const data = await response.json();
                  navigate(`/trip/${data._id}/plan/bucket-list`);
                  
            } catch (error) {
                throw new Error(error);
            }
            
        } else {
            let newErrorsObj = {
                dates: null,
                cities: null
            };
    
            if (currentFormData.allDatesArray.length < 2) {
                newErrorsObj.dates = 'Select at least 2 dates.';
            }
    
            if (currentFormData.citiesArray.length === 0) {
                newErrorsObj.cities = 'You need to type at least one city.';
            }
    
            setValidationErrors(newErrorsObj);
        }
        
    }
    

    useEffect(() => {
        if (currentFormData.country.name !== "") {
            getCountryImage();
        }
    }, [currentFormData.country, currentFormData]);

    
    if (currentFormData) {
        return (
            <div className={styles.container}>
                <Header isPlaningPages={false} isTripsOverviewPage={true} />
    
                <div className={styles.pageLayout}>
                    <div className={styles.leftContent}>
                        <div className={styles.titlesImg}>
                            <h1>{currentFormData.country.name}</h1>
                            <h3>{currentFormData.title}</h3>
                        </div>
                        <img src={countryImage} alt={currentFormData.country.name} />
                    </div>
    
                    <div className={styles.rightContent}>
                        <h2>Create your trip</h2>
    
                        <div className={styles.inputsContainer}>
                            <div className={styles.dateSelect}>
                                <label htmlFor="dateSelect">Date of arrival and departure</label>
                                <div className={styles.dateInput} onClick={() => setIsOpenCalenderSelect(prev => !prev)}>
                                    <div>
                                        <i className="fa-regular fa-calendar"></i>
                                        <p>{currentFormData.startDate ? currentFormData.startDate : 'Arrival'}</p>
                                    </div>
    
                                    <i className={`fi fi-rr-arrow-right ${styles.arrowIcon}`}></i>
    
                                    <div>
                                        <i className="fa-regular fa-calendar"></i>
                                        <p>{currentFormData.endDate ? currentFormData.endDate : 'Departure'}</p>
                                    </div>
                                </div>
                                <div className={styles.calendar}>
                                    {isOpenCalenderSelect && <Calendar config={calendarOptions} />}
                                </div>
    
                                {validationErrors.dates && <p className={styles.errorMessage}>{validationErrors.dates}</p>}
                            </div>
    
                            <div>
                                <label htmlFor="">Cities</label>
    
                                <CreatableSelect isMulti options={[]} value={currentFormData.citiesArray.map(city => ({ label: city, value: city }))} onChange={handleCitiesInputChange} placeholder={'Type cities that you want to visit'} />
    
                                {validationErrors.cities && <p className={styles.errorMessage}>{validationErrors.cities}</p>}
                            </div>
    
                            {
                                isEditPage ?

                                <PrimaryBtn style={styles.submitBtn} onClick={handleSubmitEdit}>
                                    Update this trip
                                </PrimaryBtn>

                                :

                                <PrimaryBtn style={styles.submitBtn} onClick={handleSubmitCreate}>
                                    Create this trip
                                </PrimaryBtn>
                            }

                        
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <p>You missed a part of the setup to add a trip, go to '/my-trip' on this website, click on the button 'Add trip' and complete the first step of the process.</p>
    }
    
}

export default AddTrip;