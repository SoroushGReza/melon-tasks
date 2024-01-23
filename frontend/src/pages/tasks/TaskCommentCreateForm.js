import React, { useState } from "react";
import { Form, InputGroup, Button, Row, Container, Col } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/TaskComment.module.css";

// TaskCommentCreateForm for creating comments on tasks
const TaskCommentCreateForm = ({ taskId, setComments }) => {
  // managing the content of the comment
  const [content, setContent] = useState("");
  // access the current user data
  const currentUser = useCurrentUser();

  // Handle changes in the comment input field
  const handleChange = (e) => setContent(e.target.value);

  // Handle submission of the comment form
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents default form submission actiom
    try {
      // POST request to create new comment with task ID and content
      const { data } = await axiosRes.post("/comments/", {
        content,
        task: taskId,
      });
      // Update state to include new comment in the comments list
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      // Clear the content field after successful submission
      setContent("");
    } catch (err) {
      // Log any errors that occur during the submission
      console.log(err);
    }
  };

  return (
    <Container className={styles.CommentForm}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={11} className="pr-md-2 mt-1">
            <InputGroup>
              <Avatar
                src={currentUser?.account_image}
                height={25}
                className="mr-2"
              />
              <Form.Control
                as="textarea"
                value={content}
                onChange={handleChange}
                rows={2}
                placeholder="Write a comment..."
                className={`${styles.InputFieldComments} mb-1 mt-1`}
                style={{ borderRadius: "3px" }}
              />
            </InputGroup>
          </Col>
          <Col sm={12} md={1} className="pl-md-0 d-flex justify-content-end">
            <Button
              type="submit"
              disabled={!content.trim()}
              className={`${styles.PostCommentBtn} mt-2 mt-md-0`}
            >
              Post
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default TaskCommentCreateForm;
