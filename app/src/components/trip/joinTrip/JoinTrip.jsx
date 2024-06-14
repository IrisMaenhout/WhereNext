import React, { useContext, useEffect, useState } from 'react';
import styles from './joinTrip.module.css';
import Popup from '../../global/popups/Popup';
import { useNavigate, useParams } from 'react-router-dom';
import SimplePopup from '../../global/popups/SimplePopup';
import PasswordInputWithLabel from '../../global/formInputs/input/passwordInputWithLabel/PasswordWithLabel';
import PrimaryBtn from '../../global/btns/primary/btn/PrimaryBtn';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';

function JoinTrip(props) {
    const {tripId} = useParams();
    const [tripData, setTripData] = useState();
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    const loggedInUser = useContext(LoggedInUserContext);

    const navigate = useNavigate();

    const getTripData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok || response.status === 404) {
                setError('wrong password');
                return;
            }

            const data = await response.json();
            setTripData(data);
            
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(()=>{
        getTripData();
    }, []);

    const handleChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = () => {
        const submit = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripId}/addLoggedInUserToTrip`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': loggedInUser._id
                    },
                    body: JSON.stringify({
                        password: password
                    })
                });
    
                const data = await response.json();
                if (!response.ok || response.status === 404) {
                    console.log(data);
                    return;
                }
    
                
                console.log(data);

                navigate(`/trip/${tripId}/plan/bucket-list`);
                
            } catch (error) {
                console.error(error);
            }
        };

        submit();
    }
    
    return (
        <div className={styles.background}>

            {
                tripData &&

                    <SimplePopup classNames={styles.popup}>
                        <p>You are invited to join this trip:</p>
                        <h2>{tripData.tripName}</h2>


                        <PasswordInputWithLabel name={'password'} value={password} labelText={'Password'} handleChange={(e)=> handleChange(e) }/>

                        {error && <p>{error}</p>}

                        <PrimaryBtn onClick={handleSubmit} style={styles.submitBtn}>
                            Join
                        </PrimaryBtn>
                    </SimplePopup>

            }
            
            <div>
                
            </div>
        </div>
    );
}

export default JoinTrip;