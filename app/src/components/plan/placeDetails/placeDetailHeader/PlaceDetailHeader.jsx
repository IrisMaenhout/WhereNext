import React from 'react';
import styles from './placeDetailHeader.module.css';
import SavePlaceBtn from '../../../global/btns/savePlaceBtn/SavePlaceBtn';
import PlaceDetailTabs from '../../../global/btns/tabs/placeDetailTabs/PlaceDetailTabs';

function PlaceDetailHeader({handleGoBackArrowFunc, googlePlaceData, googlePlaceId, tripId}) {
    return (
        <>
            <div className={styles.topContainer}>
                <div className={styles.titleFlex}>
                    <button onClick={handleGoBackArrowFunc}><i className={`fi fi-sr-angle-left ${styles.goBackArrow}`}></i></button>
                    <h2>{googlePlaceData.displayName.text}</h2>
                </div>

                <div className={styles.saveBtnContainer} onClick={(e) => e.stopPropagation()}>
                    <SavePlaceBtn placeId={googlePlaceId} tripId={tripId} position={"right"} />
                </div>
            
            </div>

            <PlaceDetailTabs />
        </>
        
    );
}

export default PlaceDetailHeader;