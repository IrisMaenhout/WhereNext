import { useEffect, useRef, useState } from "react";
import VC from "vanilla-calendar-pro";
import "vanilla-calendar-pro/build/vanilla-calendar.min.css";

function Calendar({ config, ...attributes }) {
  const ref = useRef(null);
  const [calendar, setCalendar] = useState(null);

  useEffect(() => {
    if (!ref.current) return
    setCalendar(new VC(ref.current, config));
  }, [ref, config])

  useEffect(() => {
    if (!calendar) return;
    calendar.init();
  }, [calendar]);

  return (
    <div {...attributes} ref={ref}></div>
  )
}

export default Calendar;
