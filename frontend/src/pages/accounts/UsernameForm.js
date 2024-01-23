import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useHistory, useParams } from "react-router-dom";
import { useRedirect } from "../../hooks/useRedirect";
import { axiosRes } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import styles from "../../styles/UsernamePasswordForm.module.css";

// Form to change username
const UsernameForm = () => {
  // Redirects if the user is not logged in
  useRedirect("loggedOut");
  // useState hook to manage username and form errors.
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  // useHistory hook for programmatic navigation.
  const history = useHistory();
  // useParams hook to access the user ID from the URL.
  const { id } = useParams();

  // Accessing the current user context
  const currentUser = useCurrentUser();
  // update the current user context
  const setCurrentUser = useSetCurrentUser();

  // runs when the component mount or dependencies update
  useEffect(() => {
    // Checks if the current user ID matches the ID inURL
    if (currentUser?.account_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      history.push("/"); // Redirect to home if not current user
    }
  }, [currentUser, history, id]);

  // Handle form submission.
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents default form submission behavior
    try {
      // PUT request to update the username.
      await axiosRes.put("/dj-rest-auth/user/", { username });
      // Update the current user's username in context
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      history.goBack(); // Navigate back to the previous page
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data); // Set errors from the response
    }
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Content}>
          <Form onSubmit={handleSubmit} className="my-2">
            <Form.Group>
              <Form.Label className={styles.CustomUsernamePasswordLabel}>
                Change username
              </Form.Label>
              <Form.Control
                placeholder="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Dark}`}
              onClick={() => history.goBack()}
            >
              cancel
            </Button>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Green}`}
              type="submit"
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;
