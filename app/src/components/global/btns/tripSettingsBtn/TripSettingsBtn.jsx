import React, { useContext, useState } from 'react';
import styles from './tripSettingsBtn.module.css';
import { LoggedInUserContext } from '../../../../context/LoggedInUserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Popup from '../../popups/Popup';
import { nanoid } from "nanoid";

function TripSettingsBtn({ tripId, children,  isInSideBar, position}) {
    const loggedInUser = useContext(LoggedInUserContext);
    const [isContainerBtnsActive, setIsContainerBtnsActive] = useState(false);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState();
    const [isPopupActive, setIsPopupActive] = useState(false);

    async function handleDelete() {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id // Ensure this header is included if needed by your API
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setSuccessMessage('This trip has been successfully deleted.');
            window.location.reload();
        } catch (error) {
            console.error(error.message);
        }
    }

    function handleClickSettingBtn(type) {
        if (type === 'edit') {
            // Edit trip logic
            navigate(`/trip/${tripId}/edit`)
        } else {
            // Remove trip
            setIsPopupActive(true);
        }
    }

    return (
        <div className={styles.btnContainer}>
            <button 
                className={`${isInSideBar ? styles.navItem : styles.btnInCard} ${styles.saveBtn}`} 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsPopupActive(false);
                    setIsContainerBtnsActive((prev) => !prev);
                }}
            >
                {children}
            </button>

            {isContainerBtnsActive && (
                <div className={`${styles.containerSaveToPagesBtns} ${styles.right} ${isInSideBar ? styles.horizontalFlexContainer : styles.verticalFlexContainer}`}>
                    <div className={styles.page} onClick={() => handleClickSettingBtn('edit')}>
                        <i className="fa-regular fa-pen-to-square"></i>
                        <p>Edit</p>
                    </div>

                    <div className={styles.page} onClick={() => handleClickSettingBtn('delete')}>
                        <i className="fa-regular fa-trash-can"></i>
                        <p>Delete</p>
                    </div>
                </div>
            )}

            {isPopupActive && (
                <Popup title={'Do you want to delete this trip?'} classNames={styles.deletePopupWidth} handleClose={() => setIsPopupActive(false)}>
                    {successMessage ? (
                        <p className={styles.successMessage}>{successMessage}</p>
                    ) : (
                        <>
                            <p>Everything that you saved in this trip will be lost and no one would be able to access it anymore.</p>
                            <button onClick={handleDelete} className={styles.deleteBtn}>Yes, delete</button>
                        </>
                    )}
                </Popup>
            )}
        </div>
    );
}

export default TripSettingsBtn;
