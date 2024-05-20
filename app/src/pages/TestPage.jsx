import React from 'react';
import Header from '../components/global/header/Header';
import Sidebar from '../components/global/sidebar/Sidebar';
import Map from '../components/plan/map/Map';

function TestPage(props) {
    return (
        <>
            <Header />
            <Sidebar />
            <Map />
            <div className="contentWrapper">
                {/* Content */}
            </div>
            
            
        </>
    );
}

export default TestPage;