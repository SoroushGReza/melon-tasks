import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Container from "react-bootstrap/Container";
import styles from "../styles/MyCalendar.module.css";

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <Container className={`p-4 ${styles.calendarContainer}`}>
      <Calendar
        onChange={onChange}
        value={date}
        className={styles.reactCalendar}
      />
    </Container>
  );
};

export default MyCalendar;
