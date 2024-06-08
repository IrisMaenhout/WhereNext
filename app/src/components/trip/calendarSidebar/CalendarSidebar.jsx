import React from 'react';
import Calendar from './calendar/Calendar';
import styles from './calendarSidebar.module.css';

function CalendarSidebar() {
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
                    <span class="highlightTripCalendar"></span>
                    `;
                }
                    
            })
          
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
