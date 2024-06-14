import React, { useContext, useState } from 'react';
import styles from './header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import SecondaryBtn from '../btns/secondary/btn/SecondaryBtn';

import PrimaryBtn from '../btns/primary/btn/PrimaryBtn';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import Popup from '../popups/Popup';
import CountrySelect from '../inputs/countrySelect/CountrySelect';

function Header({isPlaningPages, menuBtnHandleClick, isTripsOverviewPage}) {

    const loggedInUserData = useContext(LoggedInUserContext);

    const navigate = useNavigate();
    
    const [formErrorMessages, setFormErrorMessages] = useState({
        title: null,
        country: null
    })


    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newTripData, setNewTripData] = useState({
        title:  '',
        country: '',
        lat: null,
        lng: null,
    });


    const handleTitleChange = (e) => {
        const title = e.target.value;
        setNewTripData({ ...newTripData, title });
        // sessionStorage.setItem('title', title);
    };

    // Use loggedInUserData to display user data like avatar

    const handleClick = () => {
        console.log('Button was clicked!');
    };


    function submitcreateTripForm(){
        console.log('submit', newTripData);
        
        sessionStorage.setItem('newTripData', JSON.stringify(newTripData));
        navigate('/add-trip');
    }

    return (
        <>
        <header className={styles.overviewTripsHeader}>
            <div className={`${styles.container} ${styles.wraper}`}>
                <div className={styles.left}>
                    {isPlaningPages &&

                        <button className={styles.hamburgerMenuMobile} onClick={menuBtnHandleClick}>
                            <i className="fi fi-rr-menu-burger"></i>
                        </button>
                    }
                    

                    {/* Desktop logo */}
                    <Link to={"/"} className={styles.desktopLogo}>
                        <img src="/logo/long-logo.svg" alt="logo" />
                    </Link>


                    {/* Mobile logo */}
                    <Link to={"/"} className={styles.mobileLogo}>
                        <img src="/logo/mobile-logo.svg" alt="logo" />
                    </Link>


                </div>

                <nav className={styles.right}>

                    <PrimaryBtn onClick={()=> setIsPopupOpen(true)}>Add new trip</PrimaryBtn>

                    {/* Avatar for both mobile and desktop */}
                    <Link to={"../account"}>
                        <img className={styles.avatar} src={loggedInUserData.image} alt="avatar" />
                    </Link>
                </nav>
            
            </div>
        </header>


        {
            isPopupOpen &&

            <Popup title={'Where do you want to go?'} classNames={styles.popupAddTripWidth} handleClose={()=> setIsPopupOpen(false)}>
                <div className={styles.addTripPopup}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Give this trip a title"
                            className={styles.titleInput}
                            value={newTripData.title}
                            onChange={handleTitleChange}
                        />
                    </div>
                    <div>
                        <CountrySelect
                            className={styles.countrySelect}
                            // onChange={handleCountryChange}
                            setNewTripData ={setNewTripData}
                        />
                    </div>
                </div>

                <PrimaryBtn onClick={submitcreateTripForm} style={styles.primaryBtnPopup}>
                    Continue
                </PrimaryBtn>
            </Popup>

        }
        </>
    );
}

export default Header;