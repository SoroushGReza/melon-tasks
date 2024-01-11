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
                style={{ borderRadius: '3px' }}
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
