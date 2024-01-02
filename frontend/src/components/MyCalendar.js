import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Container from 'react-bootstrap/Container';
import styles from '../styles/MyCalendar.module.css';

const MyCalendar = ({ tasks }) => {
  const [calendarTasks, setCalendarTasks] = useState([]);

  useEffect(() => {
    const calendarTasksPreview = tasks.map(task => ({
      title: task.title,
      date: task.due_date
    }));
    setCalendarTasks(calendarTasksPreview);
  }, [tasks]);

  return (
    <Container className={`p-4 ${styles.calendarContainer}`}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarTasks}
      />
    </Container>
  );
};

export default MyCalendar;
