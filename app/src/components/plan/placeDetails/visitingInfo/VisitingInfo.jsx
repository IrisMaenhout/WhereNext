import React, { useContext, useEffect, useState } from 'react';
import styles from './visitingInfo.module.css';
import PlaceDetailHeader from '../placeDetailHeader/PlaceDetailHeader';
import Editor from '../../../global/editor/Editor';
import PollStatistics from '../../bucketList/pollStatistics/PollStatistics';
import NotFound404 from '../../../../pages/404/NotFound404';
import PlaceDetailTabs from '../../../global/btns/tabs/placeDetailTabs/PlaceDetailTabs';
import { LoggedInUserContext } from '../../../../context/LoggedInUserContext';

function VisitingInfo({handleGoBackArrowFunc, googlePlaceData, googlePlaceId, tripId, savedLocationData}) {
    const [numberOfTripMembers, setNumberOfTripMembers] = useState();
    const loggedInUser = useContext(LoggedInUserContext);
    
    const getTrip = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id
                }
            });

            if (!response.ok || response.status === 404) {
                return;
            }

            const data = await response.json();
            setNumberOfTripMembers(data.members.length);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(()=>{
        getTrip();
        console.log('test',savedLocationData);
    }, [])
    
        return (
            <div className={styles.visitingInfo}>
                <PlaceDetailHeader 
                    // handleGoBackArrowFunc={handleGoBackArrowFunc}
                    googlePlaceData={googlePlaceData}
                    googlePlaceId={googlePlaceId}
                    tripId={tripId}
                    // savedLocationData={savedLocationData}
                />

                <PlaceDetailTabs selected={'visiting-info'}/>
    
        
               
                <div className={styles.practicalInfoContainer}>
                    <h3>Practical info</h3>
                        
                        <div className={styles.tableContainer}>
                            <table>
                                <tbody>
                                    <tr >
                                        <th>Date:</th>
                                        <td>{savedLocationData.date? savedLocationData.date.split('T')[0] : "There is no date save for this location."}</td>
                                    </tr>
                                    <tr >
                                        <th>Start time:</th>
                                        <td>{savedLocationData.startTime? savedLocationData.startTime : "There is no start time added to this location."}</td>
                                    </tr>
                                    <tr >
                                        <th>End time:</th>
                                        <td>{savedLocationData.endTime? savedLocationData.endTime : "There is no end time added to this location."}</td>
                                    </tr>
                                    <tr >
                                        <th>Booked:</th>
                                        <td>{savedLocationData.isBooked? "Yes" : "No"}</td>
                                    </tr>

                                </tbody>
                            </table>
    
                        </div>
                                    
                    </div>
                                
                <div className={styles.noteContainer}>
                    <h3>Note</h3>
    
                    <div className={styles.editorContainer}>
                        <Editor googleLocationId={googlePlaceId} tripId={tripId}/>
                    </div>
                    
                </div>
    
                <div>
                    <h3>Interest in this activity</h3>
    
                    <div className={styles.pollStatisticsContainer}>
                        <PollStatistics
                             numberOfTripMembers={numberOfTripMembers}
                             locationApiData={savedLocationData}
                        />
                    </div>
                </div>
    
    
                <div>
                    <h3>Friends & individual excitement</h3>
    
                    
    
                </div>
    
    
            </div>
        );

    
}

export default VisitingInfo;