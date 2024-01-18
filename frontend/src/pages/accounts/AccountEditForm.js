import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import styles from "../../styles/AccountEditForm.module.css";

const AccountEditForm = () => {
  useRedirect("loggedOut");
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [accountData, setAccountData] = useState({
    name: "",
    content: "",
    image: "",
  });
  const { name, content, image } = accountData;

  const [errors, setErrors] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.account_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/accounts/${id}/`);
          const { name, content, image } = data;
          setAccountData({ name, content, image });
        } catch (err) {
          console.log(err);
          history.push("/");
        }
      } else {
        history.push("/");
      }
    };

    handleMount();
  }, [currentUser, history, id]);
  

  const handleChange = (event) => {
    setAccountData({
      ...accountData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("content", content);

    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/accounts/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        account_image: data.image,
      }));
      history.goBack();
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosRes.delete("/delete-user/", {
        data: { password: password },
      });
      if (response.status !== 400) {
        console.log("logged out");
        setCurrentUser(null);
        // Redirect to signup page
        history.push("/signup");
      } else console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Account
  const deleteAccountSection = (
    <div className={`${styles.DeleteAccountDiv} mt-4`}>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Red}`}
        onClick={() => setShowModal(true)}
      >
        Delete Account
      </Button>
      <p className={styles.WarningP}>
        <span className={styles.WarningSpan}>Warning</span>: this action will
        delete all your user data, and it is not undoable.
      </p>
    </div>
  );

  // Bio
  const textFields = (
    <>
      <Form.Group>
        <Form.Label className={styles.BioLabel}>Bio</Form.Label>
        <Form.Control
          as="textarea"
          value={content}
          onChange={handleChange}
          name="content"
          rows={7}
        />
      </Form.Group>

      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
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
    </>
  );

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
            <Container className={appStyles.Content}>
              <Form.Group>
                {image && (
                  <figure>
                    <Image src={image} fluid />
                  </figure>
                )}
                {errors?.image?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}
                <div>
                  <Form.Label
                    className={`${btnStyles.Button} ${btnStyles.Dark} btn my-auto`}
                    htmlFor="image-upload"
                  >
                    Change the image
                  </Form.Label>
                </div>
                <Form.File
                  id="image-upload"
                  ref={imageFile}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length) {
                      setAccountData({
                        ...accountData,
                        image: URL.createObjectURL(e.target.files[0]),
                      });
                    }
                  }}
                />
              </Form.Group>
              <div className="d-md-none">{textFields}</div>
            </Container>
          </Col>
          <Col md={5} lg={6} className="py-2 p-0 p-md-2 text-center">
            <Container className={appStyles.Content}>{textFields}</Container>
            <Container className={appStyles.Content}>
              {deleteAccountSection}{" "}
            </Container>
          </Col>
        </Row>
      </Form>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please enter your password to confirm account deletion:</p>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AccountEditForm;
