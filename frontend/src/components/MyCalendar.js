import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { useHistory } from "react-router-dom";
import styles from "../styles/MyCalendar.module.css";

// Show unique image for each months 1st day
const monthImages = {
  0: require("../assets/months/1january.webp"),
  1: require("../assets/months/2februari.webp"),
  2: require("../assets/months/3march.webp"),
  3: require("../assets/months/4april.webp"),
  4: require("../assets/months/5may.webp"),
  5: require("../assets/months/6june.webp"),
  6: require("../assets/months/7july.webp"),
  7: require("../assets/months/8august.png"),
  8: require("../assets/months/9september.png"),
  9: require("../assets/months/10october.png"),
  10: require("../assets/months/11november.png"),
  11: require("../assets/months/12december.png"),
};

// Calendar component
const MyCalendar = ({ tasks }) => {
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentView, setCurrentView] = useState("dayGridMonth"); // State to manage current view
  const history = useHistory();

  // Hook to process tasks data when prop changes
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

  // Add background image to the first day of each month
  const handleDayCellDidMount = (info) => {
    const date = new Date(info.date);
    if (date.getDate() === 1) {
      const month = date.getMonth();
      const imageUrl = monthImages[month];
      if (imageUrl) {
        info.el.style.backgroundImage = `url(${imageUrl.default})`;
        info.el.style.backgroundSize = "cover";
        info.el.style.backgroundPosition = "center";
      }
    }
  };

  return (
    <Container className={`p-4 ${styles.calendarContainer}`}>
      <FullCalendar
        plugins={[dayGridPlugin]} // Using only the dayGrid plugin
        initialView={currentView}
        views={{
          dayGridYear: {
            type: "dayGrid",
            duration: { year: 1 },
            buttonText: "Year",
          },
        }}
        customButtons={{
          year: {
            text: "Year",
            click: () => setCurrentView("dayGridYear"),
          },
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridYear",
        }}
        events={calendarTasks}
        eventClick={handleEventClick}
        dayCellDidMount={handleDayCellDidMount}
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
