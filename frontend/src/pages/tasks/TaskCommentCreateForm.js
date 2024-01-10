import React, { useState } from "react";
import { Form, InputGroup, Button, Row, Container, Col } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/TaskComment.module.css";

const TaskCommentCreateForm = ({ taskId, setComments }) => {
  const [content, setContent] = useState("");
  const currentUser = useCurrentUser();

  const handleChange = (e) => setContent(e.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/comments/", {
        content,
        task: taskId,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Container className={styles.Container}>
        <Row>
          <Form.Group>
            <InputGroup>
              <Avatar src={currentUser?.account_image} height={20} />
              <Form.Control
                as="textarea"
                value={content}
                onChange={handleChange}
                rows={2}
                placeholder="Write a comment..."
              />
            </InputGroup>
          </Form.Group>
          <Button type="submit" disabled={!content.trim()}>
            Post
          </Button>
        </Row>
      </Container>
    </Form>
  );
};

export default TaskCommentCreateForm;
