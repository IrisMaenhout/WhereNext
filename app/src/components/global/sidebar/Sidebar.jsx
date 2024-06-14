import React, { useContext } from 'react';
import styles from './sidebar.module.css';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';
import { PlacesContext } from '../../../context/LocationsContext';
import TripSettingsBtn from '../btns/tripSettingsBtn/TripSettingsBtn';

function Sidebar(props) {
    const {tripId} = useParams();
    const location = useLocation();
    const loggedInUser = useContext(LoggedInUserContext);
    const { places, setPlaces, setError } = useContext(PlacesContext);

    const resetPlacesMap = () => {
        setPlaces([]);
    }


    return (
        <>
        <aside className={styles.sidebarNav}>

            {/* Desktop nav */}
            <div className={styles.desktop}>
                {/* Mobile logo */}
                <Link to={'/'} className={styles.smallLogo} onClick={resetPlacesMap}>
                    <img src="/logo/mobile-logo.svg" alt="logo" />
                </Link>


                <nav>
                    <div>
                        <Link 
                            to={`/trip/${tripId}/plan/bucket-list`}
                            className={`${location.pathname.includes('/bucket-list') ? styles.selected : null} ${styles.navItem}`}
                            data-tooltip-id={`bucket-list`}
                            data-tooltip-content={'Bucketlist'}
                            onClick={resetPlacesMap}
                        >
                            <i className="fi fi-rr-heart"></i>
                        </Link>

                        <Link 
                            to={`/trip/${tripId}/plan/itinerary`} 
                            className={`${styles.navItem} ${location.pathname.includes('/itinerary') ? styles.selected : null}`}
                            data-tooltip-id={'itinerary'}
                            data-tooltip-content={'Itinerary'}
                            onClick={resetPlacesMap}
                        >
                            <i className="fi fi-sr-track"></i>
                        </Link>

                        <Link 
                            to={`/trip/${tripId}/plan/accomodations`} 
                            className={`${styles.navItem} ${location.pathname.includes('/accomodations') ? styles.selected : null}`}
                            data-tooltip-id={'accomodations'}
                            data-tooltip-content={'Accomodations'}
                            onClick={resetPlacesMap}
                        >
                            <i className="fi fi-rr-bed"></i>
                        </Link>
                    </div>

                    <div>
                        {/* <Link 
                            to={`/trip/${tripId}/trip-settings`} 
                            className={`${styles.navItem}`}
                            data-tooltip-id={'trip-settings'}
                            data-tooltip-content={'Trip settings'}
                            onClick={resetPlacesMap}
                        >
                            <i className="fi fi-rr-settings"></i>
                        </Link> */}
                        <TripSettingsBtn tripId={tripId} isInSideBar={true} position={''}>
                            <i className="fi fi-rr-settings"></i>
                        </TripSettingsBtn>
                        <Link 
                            to={"/account"}
                            data-tooltip-id={'account'}
                            data-tooltip-content={'Account'}
                            onClick={resetPlacesMap}
                        >
                            <img className={styles.avatar} src={loggedInUser.image} alt="avatar" />
                        </Link>
                    </div>
                </nav>
            </div>
            

            {/* Mobile nav */}
            <nav className={styles.mobile}>
                <Link to={`/trip/${tripId}/plan/bucket-list`} className={`${location.pathname.includes('/bucket-list') ? styles.selected : null} ${styles.navItem}`} onClick={resetPlacesMap}>
                    <i className="fi fi-rr-heart"></i>
                </Link>

                <Link to={`/trip/${tripId}/plan/itinerary`} className={`${styles.navItem} ${location.pathname.includes('/itinerary') ? styles.selected : null}`} onClick={resetPlacesMap}>
                    <i className="fi fi-sr-track"></i>
                </Link>

                <Link to={`/trip/${tripId}/plan/accomodations`} className={`${styles.navItem} ${location.pathname.includes('/accomodations') ? styles.selected : null}`} onClick={resetPlacesMap}>
                    <i className="fi fi-rr-bed"></i>
                </Link>

                <Link to={`/trip/${tripId}/trip-settings`} className={`${styles.navItem}`} onClick={resetPlacesMap}>
                    <i className="fi fi-rr-settings"></i>
                </Link>
                <Link to={"/account"} className={`${styles.navItem}`} onClick={resetPlacesMap}>
                    <img className={styles.avatar} src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww" alt="avatar" />
                </Link>
            </nav>
        </aside>

        <Tooltip id={'bucket-list'} border='1px solid #B0BDC7' style={{backgroundColor: '#EDF2FC', color: '#6C7886', zIndex: 200}} place='bottom' opacity={1}/>
        <Tooltip id={'itinerary'} border='1px solid #B0BDC7' style={{backgroundColor: '#EDF2FC', color: '#6C7886', zIndex: 200}} place='bottom' opacity={1}/>
        <Tooltip id={'accomodations'} border='1px solid #B0BDC7' style={{backgroundColor: '#EDF2FC', color: '#6C7886', zIndex: 200}} place='bottom' opacity={1}/>
        <Tooltip id={'trip-settings'} border='1px solid #B0BDC7' style={{backgroundColor: '#EDF2FC', color: '#6C7886', zIndex: 200}} place='bottom' opacity={1}/>
        <Tooltip id={'account'} border='1px solid #B0BDC7' style={{backgroundColor: '#EDF2FC', color: '#6C7886', zIndex: 200}} place='bottom' opacity={1}/>
    </>
    );
}

export default Sidebar;
