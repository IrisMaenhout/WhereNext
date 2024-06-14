import React, { useContext, useEffect, useState } from 'react';
import Calendar from './calendar/Calendar';
import styles from './calendarSidebar.module.css';
import { LoggedInUserContext } from '../../../context/LoggedInUserContext';

function CalendarSidebar({trips}) {
  const loggedInUser = useContext(LoggedInUserContext);
  const [allTripDates, setAllTripDates] = useState([]);
  const [tripsData, setTripsData] = useState([]);
  

  const getTrips = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/my-trips`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': loggedInUser._id,
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        data.forEach((trip)=>{
          setAllTripDates((prevValue) => (
            [
              ...prevValue,
              ...trip.datesArray
            ]
          ))
        })

        
    } catch (error) {
        console.error('Failed to fetch trips:', error);
    }
  };


    useEffect(()=>{
      getTrips();
    }, []);
    
    const [selectedTrip, setSelectedTrip] = useState();


    const dates = [
        '2024-06-23', '2024-06-24', '2024-06-25'
    ]


  const calendarOptions = {
    settings: {
      visibility: {
        theme: 'light',
      },
   
    },

    actions: {
        getDays(day, date, HTMLElement, HTMLButtonElement, self) {

            HTMLButtonElement.style.flexDirection = 'column';
            dates.forEach((tripDate)=>{
                if(date === tripDate){
                    
                    HTMLButtonElement.innerHTML = `
                    <span>${day}</span>
                    <span class="highlightTripCalendar" onclick="handleClickOnTripCalendar()"></span>
                    `;
                }
                    
            })
          
        },
        clickArrow(event, self) {
          console.log(self.selectedYear, self.selectedMonth);
        },
        clickYear(event, self) {
          console.log(self.selectedYear, self.selectedMonth);
        },
        clickMonth(e, self) {
          console.log(self.selectedYear, self.selectedMonth);
        },
    },
};
 

  


  return (
    <aside className={styles.sidebar}>
      <h3>Calendar</h3>
      <div>
        <Calendar config={calendarOptions} />
      </div>

      <div className={styles.tripOverviewSidebar}>
        <div className={styles.day}>4 april - 8 april</div>

        <div>
            <span></span>
            <p>Trip to london</p>
        </div>
      </div>
    </aside>
  );
}

export default CalendarSidebar;
