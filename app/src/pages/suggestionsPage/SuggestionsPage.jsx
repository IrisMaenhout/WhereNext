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
import styles from './suggestionsPage.module.css';
import Subnav from '../../components/plan/subNav/Subnav.jsx';
import PlacesSearch from '../../components/plan/placesSearch/PlacesSearch.jsx';
import Suggestions from '../../components/plan/suggestions/Suggestions.jsx';
import PlaceCard from '../../components/plan/placeCard/PlaceCard.jsx';
import { PlacesProvider } from '../../context/locationsContext.jsx';
import { SelectedPlaceProvider } from '../../context/SelectedPlaceContext.jsx';
import ContentContainerMobile from '../../components/plan/contentContainer/ContentContainerMobile.jsx';

function SuggestionsPage(props) {
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
                                         <Suggestions/>
                                    </ContentContainerMobile>
                                    :
                                
                                    <ContentContainerDesktop>
                                        <Suggestions/>
                                    </ContentContainerDesktop>
                                    
                                }

                                    
                                    {/* <PlacesSearch/> */}


                                   
                                    
                                    {/* <PlaceCard/> */}

                                    
                                <Map />
                            </div>
                        </SelectedPlaceProvider>
                    </div>
                </div>
            </div>
        </PlacesProvider>
    );
}

export default SuggestionsPage;
