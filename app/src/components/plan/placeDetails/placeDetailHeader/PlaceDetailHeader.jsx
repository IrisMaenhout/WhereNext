import React, { useContext, useState } from 'react';
import styles from './placeDetailHeader.module.css';
import SavePlaceBtn from '../../../global/btns/savePlaceBtn/SavePlaceBtn';
import { useNavigate } from 'react-router-dom';
import { PlacesContext } from '../../../../context/LocationsContext';


function PlaceDetailHeader({handleGoBackArrowFunc, googlePlaceData, googlePlaceId, tripId}) {
    const navigate = useNavigate();
    const {setPlaces} = useContext(PlacesContext);
    
    function goBack() {
        setPlaces([]);
        navigate(-1);
    }
    return (
        <>
            <div className={styles.topContainer}>
                <div className={styles.titleFlex}>
                    <button onClick={()=> goBack()}><i className={`fi fi-sr-angle-left ${styles.goBackArrow}`}></i></button>
                    <h2>{googlePlaceData.displayName.text}</h2>
                </div>

                <div className={styles.saveBtnContainer} onClick={(e) => e.stopPropagation()}>
                    <SavePlaceBtn placeId={googlePlaceId} tripId={tripId} position={"right"} />
                </div>
            
            </div>

        </>
        
    );
}

export default PlaceDetailHeader;