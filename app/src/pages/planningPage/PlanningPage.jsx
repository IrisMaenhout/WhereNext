// import React from 'react';
// import Header from '../components/global/header/Header';
// import Sidebar from '../components/global/sidebar/Sidebar';
// import Map from '../components/plan/map/Map';
// import ContentContainer from '../components/plan/contentContainer/ContentContainer';
// import styles from './testPage.module.css';
// import Subnav from '../components/plan/subNav/Subnav';

// function TestPage(props) {
//     return (
//         <>
//             <Header />

//             {/* <div className="flexContentAndSidebar"> */}
//                 {/* <Sidebar /> */}
                
//                 {/* <div className="fullWidth"> */}
//                     {/* <Subnav/> */}
//                     {/* <div className={styles.flexContentPlan}> */}
//                         {/* Content */}
//                         {/* <ContentContainer> */}
//                             {/* <h1>Titel</h1> */}
//                         {/* </ContentContainer> */}

//                         {/* <Map /> */}
                        
//                     {/* </div> */}

//                 {/* </div> */}
                
//             {/* </div> */}

            
//             <Sidebar />
           
//             <div className="contentWrapper">

//                 <Subnav/>
//                 <div className={styles.flexContentPlan}>
//                     {/* Content */}
//                     <ContentContainer>
//                         <h1>Titel</h1>
//                     </ContentContainer>

//                     <Map />
                    
//                 </div>
                
//             </div>
            
            
//         </>
//     );
// }

// export default TestPage;







import React, { useState } from 'react';
import Header from '../../components/global/header/Header.jsx';
import Sidebar from '../../components/global/sidebar/Sidebar.jsx';
import Map from '../../components/plan/map/Map.jsx';
import ContentContainerDesktop from '../../components/plan/contentContainer/ContentContainerDesktop.jsx';
import styles from './planningPage.module.css';
import { PlacesProvider } from '../../context/LocationsContext.jsx';
import { SelectedPlaceProvider } from '../../context/SelectedPlaceContext.jsx';
import ContentContainerMobile from '../../components/plan/contentContainer/ContentContainerMobile.jsx';
import PlanHeader from '../../components/global/header/PlanHeader.jsx';

function PlanningPage({children}) {
    const isViewedOnMobile = window.innerWidth < 800;

    return (
        <PlacesProvider>
            <div className={styles.container}>
                <Sidebar />
                {/* <Header menuBtnHandleClick={handleSubNavMenuClick} isPlaningPages={true} isTripsOverviewPage={false}/> */}
                <PlanHeader />
                <div className="contentWrapper">
                    
                    <div className={styles.main}>

                        {/* <Subnav isActive={isSubNavActive}/> */}

                        <SelectedPlaceProvider>
                            <div className={styles.flexContentPlan}>
                                { isViewedOnMobile ? 
                                    <ContentContainerMobile>
                                        {children}
                                        {/* <Accomodations /> */}
                                         {/* <Suggestions/> */}
                                         {/* <BucketList/> */}
                                    </ContentContainerMobile>
                                    :
                                
                                    <ContentContainerDesktop>
                                        {children}
                                        {/* <Accomodations /> */}
                                        {/* <Suggestions/> */}
                                        {/* <BucketList/> */}
                                    </ContentContainerDesktop>
                                    
                                }

                                    
                                    {/* <PlacesSearch/> */}


                                   
                                    
                                    {/* <PlaceCard/> */}

                                    
                                <Map/>
                            </div>
                        </SelectedPlaceProvider>
                    </div>
                </div>
            </div>
        </PlacesProvider>
    );
}

export default PlanningPage;
