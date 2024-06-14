import React, { useState } from 'react';
import Popup from '../../global/popups/Popup';
import styles from './shareTrip.module.css';

function ShareTrip({handleClose, tripId, tripData}) {
    const [copySuccesMessages, setCopySuccesMessages] = useState({
        link: false,
        password: false
    });

    return (
        <Popup title={'Share this trip:'} handleClose={handleClose} classNames={styles.shareTrip}>
            <div className={styles.container}>
                <div>
                    <p>Click on the link to copy the url and send this url to a friend.</p>

                    <p className={styles.shareLink} onClick={(e)=> {
                            navigator.clipboard.writeText(e.target.innerText);
                            setCopySuccesMessages( (prevValue) => ({...prevValue, link: 'Link has been copied.'}));
                        }}
                    >
                        {`${process.env.REACT_APP_BASE_URL_APP}/join-trip/${tripId}`}
                    </p>

                    {
                        copySuccesMessages.link !== undefined &&
                        <p className={styles.succesMessage}>{copySuccesMessages.link}</p>
                    }


                </div>

                {
                    tripData &&

                    <div>
                        <p>There has been a password generated for this trip.<br></br>Don't forget to share this as well.</p>

                        <p className={styles.sharePassword} onClick={(e)=> {
                                navigator.clipboard.writeText(e.target.innerText);
                                setCopySuccesMessages( (prevValue) => ({...prevValue, password: 'Generated password has been copied.'}));
                            }}
                        >
                            {tripData.password}
                        </p>

                        {
                            copySuccesMessages.password !== undefined &&
                            <p className={styles.succesMessage}>{copySuccesMessages.password}</p>
                        }


                    </div>
                }

            </div>
            
            

            
        </Popup>
    );
}

export default ShareTrip;