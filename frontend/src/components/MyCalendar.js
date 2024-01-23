import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Container from "react-bootstrap/Container";
import { Modal, Button, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import styles from "../styles/MyCalendar.module.css";

// Calendar component
const MyCalendar = ({ tasks }) => {
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const history = useHistory();

  // hook to process tasks data when prop changes
  useEffect(() => {
    const calendarTasksPreview = tasks.map((task) => ({
      title: task.title,
      date: task.due_date,
      id: task.id.toString(),
    }));
    setCalendarTasks(calendarTasksPreview);
  }, [tasks]);

  // Handle click events
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

  // Redirection after editing
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

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className={styles.calendarModal}
      >
        <Modal.Header closeButton className={styles.calendarModalHeader}>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.calendarModalBody}>
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
                <strong>Public:</strong> {selectedTask.is_public ? "Yes" : "No"}
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
        <Modal.Footer className={styles.calendarModalFooter}>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            className={styles.closeButton}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleEditRedirect}
            className={styles.editButton}
          >
            Edit Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyCalendar;
