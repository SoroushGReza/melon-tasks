import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Container from 'react-bootstrap/Container';
import styles from '../styles/MyCalendar.module.css';

const MyCalendar = () => {
  return (
    <Container className={`p-4 ${styles.calendarContainer}`}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
      />
    </Container>
  );
};

export default MyCalendar;
