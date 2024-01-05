import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Alert, Image } from "react-bootstrap";
import Asset from "../../components/Asset";

import Upload from "../../assets/upload.png";

import styles from "../../styles/TaskCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

function TaskEditForm() {
  const [errors, setErrors] = useState({});

  const [taskData, setTaskData] = useState({
    title: "",
    content: "",
    image: "",
    due_date: "",
    is_overdue: false,
    is_public: false,
    priority: "medium",
    category: "other",
    status: "open",
  });
  const {
    title,
    content,
    image,
    due_date,
    priority,
    category,
    status,
    is_overdue,
    is_public,
  } = taskData;

  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/${id}/`);
        setTaskData(data);
        setHasLoaded(true); // Set hasLoaded to true after data is fetched
      } catch (err) {
        console.error("Failed to fetch task data:", err);
        setHasLoaded(true); // Set hasLoaded to true even if there is an error
      }
    };

    fetchTaskData();
  }, [id]); // Re-run when id changes


  if (!hasLoaded) {
    return (
      <Container className={appStyles.Content}>
        <Asset spinner />{" "}
      </Container>
    );
  }
  if (errors.form) {
    return (
      <Container className={appStyles.Content}>
        <Alert variant="danger">{errors.form}</Alert>
      </Container>
    );
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTaskData({
      ...taskData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setTaskData({
        ...taskData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let newErrors = {};

    // If any issue, updated 'errors' and abort submission
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    if (imageInput.current && imageInput.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }
    formData.append("due_date", due_date);
    formData.append("priority", priority);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("is_overdue", is_overdue);
    formData.append("is_public", is_public);

    try {
      await axiosReq.put(`/tasks/${id}/`, formData);
      history.push(`/tasks/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) setErrors(err.response?.data);
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={taskData.title || ""}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="content"
          value={taskData.content || ""}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="date"
          name="due_date"
          value={taskData.due_date || ""}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.due_date?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Priority</Form.Label>
        <Form.Control
          as="select"
          name="priority"
          value={taskData.priority || ""}
          onChange={handleChange}
        >
          <option value="urgent">🔴 Urgent</option>
          <option value="high">🟡 High Priority</option>
          <option value="medium">🟢 Medium Priority</option>
          <option value="low">🔵 Low Priority</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={taskData.category || ""}
          onChange={handleChange}
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="other">Other</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          name="status"
          value={taskData.status || ""}
          onChange={handleChange}
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="Is Overdue"
          name="is_overdue"
          checked={taskData.is_overdue}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="Is Public"
          name="is_public"
          checked={taskData.is_public}
          onChange={handleChange}
        />
      </Form.Group>

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {image && (
                <>
                  <figure>
                    {image && (
                      <Image className={appStyles.Image} src={image} rounded />
                    )}
                  </figure>

                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              )}
              {!image && (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset src={Upload} message="Click to upload image" />
                </Form.Label>
              )}

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>

        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default TaskEditForm;
