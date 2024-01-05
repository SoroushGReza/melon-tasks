import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Container from "react-bootstrap/Container";
import { Modal, Button, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import styles from "../styles/MyCalendar.module.css";

const MyCalendar = ({ tasks }) => {
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const calendarTasksPreview = tasks.map((task) => ({
      title: task.title,
      date: task.due_date,
      id: task.id.toString(),
    }));
    setCalendarTasks(calendarTasksPreview);
  }, [tasks]);

  const handleEventClick = (clickInfo) => {
    const taskId = clickInfo.event.id;
    const task = tasks.find((task) => task.id.toString() === taskId);
    if (task) {
      setSelectedTask(task);
      setShowModal(true);
    } else {
      console.error("Task not found for ID:", taskId);
    }
  };

  const handleEditRedirect = () => {
    history.push(`/tasks/${selectedTask.id}/edit`);
  };

  return (
    <Container className={`p-4 ${styles.calendarContainer}`}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarTasks}
        eventClick={handleEventClick}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              <p>
                <strong>Title:</strong> {selectedTask.title}
              </p>
              <p>
                <strong>Content:</strong> {selectedTask.content}
              </p>
              <p>
                <strong>Due Date:</strong> {selectedTask.due_date}
              </p>
              <p>
                <strong>Priority:</strong> {selectedTask.priority}
              </p>
              <p>
                <strong>Category:</strong> {selectedTask.category}
              </p>
              <p>
                <strong>Status:</strong> {selectedTask.status}
              </p>
              <p>
                <strong>Is Overdue:</strong>{" "}
                {selectedTask.is_overdue ? "Yes" : "No"}
              </p>
              <p>
                <strong>Is Public:</strong>{" "}
                {selectedTask.is_public ? "Yes" : "No"}
              </p>
              {selectedTask.image && (
                <div>
                  <p>
                    <strong>Image:</strong>
                  </p>
                  <Image src={selectedTask.image} alt="Task" fluid />
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditRedirect}>
            Edit Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyCalendar;
