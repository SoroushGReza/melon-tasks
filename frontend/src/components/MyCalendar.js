import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Container from 'react-bootstrap/Container';

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <Container className="p-4">
      <Calendar onChange={onChange} value={date} /> {}
    </Container>
  );
};

export default MyCalendar;
