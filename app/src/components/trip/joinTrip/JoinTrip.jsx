import React from 'react';
import styles from './joinTrip.module.css';
import Popup from '../../global/popups/Popup';
import { useParams } from 'react-router-dom';

function JoinTrip(props) {
    const {tripId} = useParams();
    
    return (
        <div className={styles.background}>
            <div>
                <p>You are invited to join this trip:</p>
                <h2>Trip to london</h2>

                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
            </div>
        </div>
    );
}

export default JoinTrip;