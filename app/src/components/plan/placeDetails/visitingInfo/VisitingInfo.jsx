import React from 'react';
import styles from './visitingInfo.module.css';
import PlaceDetailHeader from '../placeDetailHeader/PlaceDetailHeader';
import Editor from '../../../global/editor/Editor';

function VisitingInfo({handleGoBackArrowFunc, googlePlaceData, googlePlaceId, tripId, savedLocationData}) {
    return (
        <div className={styles.visitingInfo}>
            <PlaceDetailHeader 
                handleGoBackArrowFunc={handleGoBackArrowFunc}
                googlePlaceData={googlePlaceData}
                googlePlaceId={googlePlaceId}
                tripId={tripId}
                savedLocationData={savedLocationData}
            />

    
           
            <div className={styles.practicalInfoContainer}>
                <h3>Practical info</h3>
                    
                    <div className={styles.tableContainer}>
                        <table>
                            <tr >
                                <th>Date:</th>
                                <td>{savedLocationData.date? savedLocationData.date.split('T')[0] : "This date has not been added to a date."}</td>
                            </tr>
                            <tr >
                                <th>Time:</th>
                                <td>12:20</td>
                            </tr>
                            <tr >
                                <th>Booked:</th>
                                <td>{savedLocationData.isBooked? "Yes" : "No"}</td>
                            </tr>
                        </table>

                    </div>
                                
                </div>
                            
            <div className={styles.noteContainer}>
                <h3>Note</h3>

                <div className={styles.editorContainer}>
                    <Editor />
                </div>
                
            </div>

            <div>
                <h3>Interest in this activity</h3>
            </div>


        </div>
    );
}

export default VisitingInfo;