import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Container from "react-bootstrap/Container";
import { Modal, Button, Form, Image } from "react-bootstrap";
import styles from "../styles/MyCalendar.module.css";
import { axiosReq } from "../api/axiosDefaults";

const MyCalendar = ({ tasks }) => {
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    content: "",
    image: "",
    due_date: "",
    priority: "medium",
    category: "other",
    status: "open",
    is_overdue: false,
    is_public: false,
  });

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
      setTaskData({ ...task });
      setShowModal(true);
    } else {
      console.error("Task not found for ID:", taskId);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    if (name === "image" && files.length) {
      setTaskData({
        ...taskData,
        image: files[0],
      });
    } else {
      setTaskData({
        ...taskData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    if (selectedTask && selectedTask.id) {
      try {
        const formData = new FormData();
        Object.keys(taskData).forEach((key) => {
          if (taskData[key] !== '') {
            formData.append(key, taskData[key]);
          }
        });
        await axiosReq.put(`/tasks/${selectedTask.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setShowModal(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.error("No task selected or task has no ID!");
    }
  };

  const handleDeleteTask = async () => {
    if (selectedTask && selectedTask.id) {
      try {
        await axiosReq.delete(`/tasks/${selectedTask.id}/`);
        setShowModal(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.error("No task selected or task has no ID!");
    }
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
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveChanges}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={taskData.title || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={taskData.content || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="due_date"
                value={taskData.due_date || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleChange}
              />
              {taskData.image && (
                <Image src={typeof taskData.image === 'string' ? taskData.image : URL.createObjectURL(taskData.image)} alt="Task" fluid />
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={handleDeleteTask}>
              Delete Task
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default MyCalendar;
