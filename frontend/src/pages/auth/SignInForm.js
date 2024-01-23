import React, { useState } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import SignInMelon from "../../assets/melon4.png";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";

// SignInForm to handle sign ins
const SignInForm = () => {
  // Custom hook to set current user context
  const setCurrentUser = useSetCurrentUser();
  // Manage sign in form data and error
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  // Destructure to extract username and password from signInData
  const { username, password } = signInData;
  // useState hook for managing form errors
  const [errors, setErrors] = useState({});
  const history = useHistory();

  // Handle form submission.
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission
    try {
      // POST request to the sign-in endpoint with the form data
      const response = await axios.post("/dj-rest-auth/login/", signInData);
      // Extracts data from the response
      const data = response.data;
      // Set current user in the context to the signed in user
      setCurrentUser(data.user);
      // Redirect to homepage after successful sign in
      history.push("/");
    } catch (err) {
      // Set form errors if the sign in attempt fails
      setErrors(err.response.data);
    }
  };

  // Function to handle changes in form inputs
  const handleChange = (event) => {
    // Updates signInData state with new input values
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto p-0 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>sign in</h1>
          <Form onSubmit={handleSubmit}>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                className={styles.Input}
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                className={styles.Input}
                value={password}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              Sign in
            </Button>
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up now!</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
      >
        <Image className={`${appStyles.FillerImage}`} src={SignInMelon} />
      </Col>
    </Row>
  );
};

export default SignInForm;
