import React from 'react';
import styles from './tripOverview.module.css';
import Header from '../global/header/Header';
import CalendarSidebar from './calendarSidebar/CalendarSidebar';


function TripOverview(props) {
    return (
        <div className={styles.container}>
            <Header isPlaningPages={false} isTripsOverviewPage={true}/>

            <div className="contentWrapper">
                <CalendarSidebar />
                <div className={styles.main}>
                    <p>Content</p>
                </div>

            
            </div>
            
            
        </div>
    );
}

export default TripOverview;