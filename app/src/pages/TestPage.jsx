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







import React from 'react';
import Header from '../components/global/header/Header';
import Sidebar from '../components/global/sidebar/Sidebar';
import Map from '../components/plan/map/Map';
import ContentContainer from '../components/plan/contentContainer/ContentContainer';
import styles from './testPage.module.css';
import Subnav from '../components/plan/subNav/Subnav';

function TestPage(props) {
    return (
        <div className={styles.container}>
            <Header />
            <div className="contentWrapper">
                <Sidebar />
                <div className={styles.main}>
                    <Subnav />
                    <div className={styles.flexContentPlan}>
                        <ContentContainer>
                            <h1>Titel</h1>
                        </ContentContainer>
                        <Map />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestPage;
