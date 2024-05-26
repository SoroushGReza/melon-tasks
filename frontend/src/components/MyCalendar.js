import React, { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { useHistory, Link } from "react-router-dom";
import styles from "../styles/MyCalendar.module.css";
import { axiosReq } from "../api/axiosDefaults";

// Show unique image for each month's 1st day
const monthImages = {
  0: require("../assets/months/1january.webp"),
  1: require("../assets/months/2februari.webp"),
  2: require("../assets/months/3march.webp"),
  3: require("../assets/months/4april.webp"),
  4: require("../assets/months/5may.webp"),
  5: require("../assets/months/6june.webp"),
  6: require("../assets/months/7july.webp"),
  7: require("../assets/months/8august.webp"),
  8: require("../assets/months/9september.webp"),
  9: require("../assets/months/10october.webp"),
  10: require("../assets/months/11november.webp"),
  11: require("../assets/months/12december.webp"),
};

// Calendar component
const MyCalendar = ({ tasks, setTasks }) => {
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskListModal, setShowTaskListModal] = useState(false); // State for task list modal
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [currentView, setCurrentView] = useState("dayGridMonth"); // State to manage current view
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State to track window width
  const history = useHistory();

  // Hook to fetch tasks again
  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axiosReq.get("/tasks/");
      setTasks(data.results);
    } catch (err) {
      console.log(err);
    }
  }, [setTasks]);

  // Fetch tasks on initial load and when tasks change
  useEffect(() => {
    const calendarTasksPreview = tasks.map((task) => ({
      title: task.title,
      date: task.due_date,
      id: task.id.toString(),
    }));
    setCalendarTasks(calendarTasksPreview);
  }, [tasks]);

  // Handle updates on page navigation
  useEffect(() => {
    const unlisten = history.listen((location) => {
      if (location.pathname === "/") {
        fetchTasks();
      }
    });
    return () => {
      unlisten();
    };
  }, [history, fetchTasks]);

  useEffect(() => {
    const handleFirstDayCellCheck = () => {
      const allDayCells = document.querySelectorAll(".fc-daygrid-day");

      allDayCells.forEach((dayCell) => {
        const date = new Date(dayCell.dataset.date);
        if (date.getDate() === 1) {
          const month = date.getMonth();
          const imageUrl = monthImages[month];
          if (imageUrl) {
            dayCell.style.backgroundImage = `url(${imageUrl.default})`;
            dayCell.style.backgroundSize = "cover";
            dayCell.style.backgroundPosition = "center";
            dayCell.style.position = "relative";

            // Check if there are tasks on the first day of the month
            const tasksOnFirstDay = tasks.filter(
              (task) =>
                new Date(task.due_date).toDateString() === date.toDateString()
            );

            // Add class to darken the background if tasks exist
            if (tasksOnFirstDay.length > 0) {
              dayCell.classList.add(styles.darkenBackground);
            }
          }
        }
      });
    };

    handleFirstDayCellCheck();
  }, [tasks]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Handle icon click for task list
  const handleIconClick = (date) => {
    setSelectedDate(date);
    setShowTaskListModal(true);
  };

  // Redirection after editing
  const handleEditRedirect = (taskId) => {
    history.push(`/tasks/${taskId}/edit`);
  };

  // Remove task from the list by its ID
  const removeTaskFromList = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setCalendarTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
  };

  // Handle task delete
  const handleDelete = async (taskId) => {
    try {
      await axiosReq.delete(`/tasks/${taskId}/`);
      removeTaskFromList(taskId);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to truncate text
  const truncateText = (text) => {
    const maxLength = windowWidth <= 451 ? 15 : 40;
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Container className={`p-4 ${styles.calendarContainer}`}>
      <FullCalendar
        plugins={[dayGridPlugin]}
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
        dayCellContent={({ date }) => {
          const tasksOnDate = tasks.filter(
            (task) =>
              new Date(task.due_date).toDateString() === date.toDateString()
          );
          return (
            <>
              <div className="fc-daygrid-day-number">{date.getDate()}</div>
              {windowWidth <= 797 && tasksOnDate.length > 0 && (
                <Container fluid className="mt-5">
                  <Row>
                    <Col xs={6} className="mt-2">
                      <i
                        className={`fas fa-tasks task-list-icon`}
                        onClick={() => handleIconClick(date)}
                      ></i>
                    </Col>
                    <Col xs={6}></Col>
                  </Row>
                </Container>
              )}
            </>
          );
        }}
      />

      {/* Task details modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className={styles.calendarModal}
      >
        <Modal.Header closeButton className={styles.calendarModalHeader}>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.calendarModalBody}>
          {windowWidth > 797 && selectedTask && (
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
          {windowWidth <= 797 && <p>Task list of this day.</p>}
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
            onClick={() => handleEditRedirect(selectedTask.id)}
            className={styles.editButton}
          >
            Edit Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Task list modal */}
      <Modal
        show={showTaskListModal}
        onHide={() => setShowTaskListModal(false)}
        className={styles.taskListModal}
      >
        <Modal.Header closeButton className={styles.taskListModalHeader}>
          <Modal.Title>
            Tasks on {selectedDate ? selectedDate.toDateString() : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.taskListModalBody}>
          {selectedDate && (
            <ul className={styles.ulTaskList}>
              {tasks
                .filter(
                  (task) =>
                    new Date(task.due_date).toDateString() ===
                    selectedDate.toDateString()
                )
                .map((task) => (
                  <li key={task.id} className={styles.taskListItem}>
                    <Link to={`/tasks/${task.id}`} className={styles.taskLink}>
                      <strong>{truncateText(task.title)}</strong>
                    </Link>
                    <div className={styles.buttonGroup}>
                      <Button
                        variant="warning"
                        size="sm"
                        className={styles.editButton}
                        onClick={() => handleEditRedirect(task.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className={styles.deleteButton}
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer className={styles.taskListModalFooter}>
          <Button
            variant="secondary"
            onClick={() => setShowTaskListModal(false)}
            className={styles.closeButton}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyCalendar;
