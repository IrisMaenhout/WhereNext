import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './bucketListCard.module.css';
import SavePlaceBtn from '../../../global/btns/savePlaceBtn/SavePlaceBtn';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

function BucketListCard({locationApiData, userId}) {
    const [googlePlaceData, setGooglePlaceData] = useState(null);
    const [locationApiDataUpToDate, setLocationApiDataUpToDate] = useState(locationApiData);
    const [coverImage, setCoverImage] = useState('');
    const numberOfTripMembers = 6;
    
    
    const navigate = useNavigate();

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function handleClick() {
        // navigate(`/place/${locationApiData.googleLocationId}`);
    }


    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
    const getGooglePlaceData = () => {

        fetch(`https://places.googleapis.com/v1/places/${locationApiDataUpToDate.googleLocationId}?fields=displayName,formattedAddress,photos,primaryType,types,location&languageCode=en&key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            setGooglePlaceData(data);
        });
    };

    const getPictureUrl = () => {

        fetch(`https://places.googleapis.com/v1/${googlePlaceData.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            console.log('img',data);
            setCoverImage(data);
        });
    };

    // Fetch data depending on googlePlacesApi
    useEffect(()=> {
        getGooglePlaceData();
        console.log(googlePlaceData);
        // if(googlePlaceData?.photos !== undefined){
        //     getPictureUrl();
        // }
       
    }, []);

    useEffect(()=> {
         if (googlePlaceData && googlePlaceData.photos.length > 0) {
            // getPictureUrl();
        }
    }, [googlePlaceData])


    const indexOfUser = locationApiDataUpToDate.interest.findIndex(e => e.user === userId.toString());

    const fullStars = indexOfUser > -1 ? Math.floor(locationApiDataUpToDate.interest[indexOfUser].rating) : 0;
    const emptyStars = 5 - fullStars;

    async function giveRating(rating){

        try{
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/locations/${locationApiDataUpToDate.googleLocationId}/addIndividualRating/${locationApiDataUpToDate.tripId}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                'authorization': userId
                },
                body: JSON.stringify({
                    rating: rating,
                    status: 'pending'
                }),
            });
    
            //   if (!response.ok) {
            //     console.log(response);
            //     throw new Error(response.statusText);
            //   }
    
          const data = await response.json();
          setLocationApiDataUpToDate(data);
        } catch (error) {
            throw new Error(error);
          // setError(error.message);
        }
    
    }

  
    const interestData = locationApiDataUpToDate.interest;


    function calculateGroupInterest() {
        if (interestData.length === 0) return 0;
    
        const totalScore = interestData.reduce((sum, entry) => sum + entry.rating, 0);
        const averageRating = totalScore / interestData.length;
        const percentage = ((averageRating - 1) / 4) * 100;
    
        return percentage.toFixed(0); // To keep the percentage to two decimal places
    }
    

    // calculateGroupInterest();

    const ratingCounts = [0, 0, 0, 0, 0];
    interestData.forEach(entry => {
        ratingCounts[entry.rating - 1]++;
    });

    const data = {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [{
            label: 'People',
            data: ratingCounts,
            backgroundColor: ['#F25353', '#FF9737', '#FFCE56', '#D3ED6F', '#8FD763'],
            borderRadius: 5,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Interest rating (stars)',
                    padding: { top: 10 },
                    font: {
                        size: 14,
                        family: 'Nunito',
                        // weight: 'bold',
                        // lineHeight: 1.2
                    },
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of members',
                    padding: { bottom: 20},
                    font: {
                        size: 14,
                        family: 'Nunito'
                    },
                },
                beginAtZero: true,
                max: numberOfTripMembers
            }
        },
        plugins: {
            legend: false,
            tooltip: {
                callbacks: {
                    title: function(context) {
                        return `${context[0].label} star${context[0].label > 1 ? 's' : ''} `;
                    },
                    label: function(context) {
                        return `  ${context.raw} member${context.raw > 1 ? 's' : ''} `;
                    }
                }
            }
        },
        layout: {
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        }
    };


    if(!googlePlaceData){
        return <></>
    }else{
        return (
            <>
            <div onClick={handleClick} className={`${styles.card} ${styles.bucketListCard}`}>
                <div className={styles.topCard}>
                    <div className={styles.left}>
                        <div className={styles.saveBtn} onClick={(e) => e.stopPropagation()}>
                            <SavePlaceBtn 
                                placeId={locationApiDataUpToDate.googleLocationId}
                                tripId={locationApiDataUpToDate.tripId} 
                                position={'left'}
                            />
                        </div>
                        {/* {coverImage !== "" && <img src={coverImage} alt={googlePlaceData.displayName.text} />} */}
                        <img src="https://www.thonhotels.com/siteassets/artikler/z_vare-hoteller_destinasjonssider/tekster-pa-destinasjonssider/brussel/visit-brussels-jean-paul-remy.jpg?mode=crop&quality=80&width=1100&height=619" alt={googlePlaceData.displayName.text} />
                    </div>
    
                    <div className={styles.right}>
                        <h3>{googlePlaceData.displayName.text}</h3>
                    
                        <div className={styles.location}>
                            <i className="fi fi-rs-marker"></i>
                            <p>{googlePlaceData.formattedAddress}</p>
                        </div>
    
                        <div className={styles.categories}>
                            {googlePlaceData.types.length > 0 &&
                                (googlePlaceData.types.length > 2 ? (
                                    <>
                                        <p className={styles.category}>{capitalizeFirstLetter(googlePlaceData.types[0].replace('_', ' '))}</p>
                                        {/* <p className={styles.category}>{capitalizeFirstLetter(googlePlaceData.types[1].replace('_', ' '))}</p> */}
                                        <p className={styles.moreCategories}>+ {googlePlaceData.types.length - 1}</p>
                                    </>
                                ) : (
                                    googlePlaceData.types.map((type, index) => (
                                        <p key={index} className={styles.category}>{capitalizeFirstLetter(type.replace('_', ' '))}</p>
                                    ))
                                ))
                            }
                        </div>
                    </div>
                    
                </div>
    
                <div className={styles.averageGroupInterestPercentage}>
                    <p>Average group interest:</p>

                    <div>
                        <b className={styles.percentage}>{ calculateGroupInterest() }%</b>
                        <p>({(calculateGroupInterest() / 20).toFixed(1)} stars)</p>
                    </div>
                </div>
    
                <div className={styles.groupInterestGraph}>
                    {/* <Bar
                    
                    /> */}
                    <div className={styles.graph}>
                        <Bar data={data} options={options} />
                    </div>
                    
                </div>
    
                <div className={styles.myInterestStars}>
                    <p>My rating:</p>
    
                    <div className={styles.stars}>
                        {
                            [...Array(fullStars)].map((_, i) => (
                                <button key={`place-full-star-${googlePlaceData.id}-${i}`} onClick={() => giveRating(i+1)}>
                                    <i className={`fa-solid fa-star ${styles.colored}`}></i>

                                </button>
                                
                            ))}
                                    
                            {[...Array(emptyStars)].map((_, i) => (
                               
                                <button key={`place-empty-star-${googlePlaceData.id}-${i}`} onClick={() => giveRating(i+fullStars+1)}>
                                     <i className="fa-regular fa-star"></i>
                                </button>
                            ))
                            }
                    </div>
                
                </div>
            </div>
    
            </>
        );

    }
    
}

export default BucketListCard;