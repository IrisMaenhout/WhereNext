import React, { useState } from 'react';
import { PlacesProvider } from '../../context/locationsContext.jsx';
import Header from '../../components/global/header/Header.jsx';
import Sidebar from '../../components/global/sidebar/Sidebar.jsx';
import Subnav from '../../components/plan/subNav/Subnav.jsx';
import { SelectedPlaceProvider } from '../../context/SelectedPlaceContext.jsx';

import Map from '../../components/plan/map/Map.jsx';
import ContentContainerDesktop from '../../components/plan/contentContainer/ContentContainerDesktop.jsx';
import ContentContainerMobile from '../../components/plan/contentContainer/ContentContainerMobile.jsx';
import PlaceCard from '../../components/plan/placeCard/PlaceCard.jsx';

import styles from './bucketlist.module.css';



function BucketList(props) {
    const isViewedOnMobile = window.innerWidth < 800;
    const [isSubNavActive, setIsSubNavActive] = useState(isViewedOnMobile ? false : true);


    function handleSubNavMenuClick() {
        setIsSubNavActive(!isSubNavActive);
        console.log(isSubNavActive)
    }


    return (
        <PlacesProvider>
            <div className={styles.container}>
                <Header menuBtnHandleClick={handleSubNavMenuClick} isPlaningPages={true}/>
                <div className="contentWrapper">
                    <Sidebar />
                    <div className={styles.main}>
                        <Subnav isActive={isSubNavActive}/>

                        <SelectedPlaceProvider>
                            <div className={styles.flexContentPlan}>
                                { isViewedOnMobile ? 
                                    <ContentContainerMobile>
                                         {/* Here needs to be content */}
                                    </ContentContainerMobile>
                                    :
                                
                                    <ContentContainerDesktop>
                                         {/* Here needs to be content */}
                                    </ContentContainerDesktop>
                                    
                                }
  
                                <Map />
                            </div>
                        </SelectedPlaceProvider>
                    </div>
                </div>
            </div>
        </PlacesProvider>
    );
}

export default BucketList;