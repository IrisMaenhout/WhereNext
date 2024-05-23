import React, { useState } from 'react';
import styles from './savePlaceBtn.module.css';

function SavePlaceBtn(props) {
    const [isContainerSaveToPagesBtnsActive, setIsContainerSaveToPagesBtnsActive] = useState(false);

    const [savedPlanPages, setSavedPlanPages] = useState({
        bucketList: false,
        itinerary: false,
        accommodations: false
    });

    const toggleSaveState = (key) => {
        setSavedPlanPages((prevState) => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };


    return (
        <>
        <button 
            className={styles.saveBtn} 
            onClick={(e)=>{
                e.stopPropagation();
                setIsContainerSaveToPagesBtnsActive((prev)=> !prev)
            }}
        >
            

            {
                savedPlanPages.bucketList || savedPlanPages.itinerary || savedPlanPages.accommodations ?
                <i className="fa-solid fa-bookmark"></i>

                : 

                <i className="fa-regular fa-bookmark"></i>
            }

        </button>


        {
            isContainerSaveToPagesBtnsActive &&

            <div className={styles.containerSaveToPagesBtns}>
                <div className={styles.page}>
                    <div>
                        <i className="fi fi-rr-heart"></i>
                        <p>Bucketlist</p>
                    </div>

                    <button onClick={() => toggleSaveState('bucketList')}>
                        {
                            savedPlanPages.bucketList ?
                            <i className={`fi fi-ss-check-circle ${styles.addedBtn}`}></i>

                            :
                            <i className={`fi fi-rr-add ${styles.addBtn}`}></i>

                        }
                    </button>
                </div>
                <div className={styles.page}>
                    <div>
                        <i className="fi fi-sr-track"></i>
                        <p>Itinerary</p>
                    </div>

                    <button onClick={() => toggleSaveState('itinerary')}>
                        {
                            savedPlanPages.itinerary ?
                            <i className={`fi fi-ss-check-circle ${styles.addedBtn}`}></i>

                            :
                            <i className={`fi fi-rr-add ${styles.addBtn}`}></i>

                        }
                    </button>
                </div>
                <div className={styles.page}>
                    <div>
                        <i className="fi fi-rr-bed"></i>
                        <p>Accommodations</p>
                    </div>

                    <button onClick={() => toggleSaveState('accommodations')}>
                        {
                            savedPlanPages.accommodations ?
                            <i className={`fi fi-ss-check-circle ${styles.addedBtn}`}></i>

                            :
                            <i className={`fi fi-rr-add ${styles.addBtn}`}></i>

                        }
                    </button>
                </div>
            </div>
        }
        
        </>
    );
}

export default SavePlaceBtn;