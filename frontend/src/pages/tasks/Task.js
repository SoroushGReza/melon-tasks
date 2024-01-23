import React, { useContext } from "react";
import styles from "../../styles/Task.module.css";
import Card from "react-bootstrap/Card";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import Media from "react-bootstrap/Media";
import { Link, useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";

const Task = (props) => {
  const {
    id,
    owner,
    updated_at,
    title,
    content,
    image,
    due_date,
    onTaskDelete,
    is_public,
  } = props;

  const currentUser = useContext(CurrentUserContext);
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const dueDateObj = new Date(due_date);

  // Format due date
  const formattedDueDate = dueDateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Handle editing and redirecting
  const handleEdit = () => {
    history.push(`/tasks/${id}/edit`);
  };

  // Handles deletion of task
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tasks/${id}/`);
      onTaskDelete(id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className={styles.Task}>
      <Card.Body
        className={`${styles.TitleSection} d-flex justify-content-between`}
      >
        <div className={`d-flex align-items-center ${styles.TitleContainer}`}>
          {is_public && (
            <div className={styles.PublicInfo}>
              <i className={`fa-solid fa-users ${styles.PublicIcon}`} />
              <span className={styles.PublicText}>public</span>
            </div>
          )}
          {title && (
            <Link to={`/tasks/${id}`} className={styles.taskTitleLink}>
              <Card.Title className={styles.taskTitle}>{title}</Card.Title>
            </Link>
          )}
        </div>

        <div
          className={`d-flex align-items-center ${styles.DateAndDropdownContainer}`}
        >
          <span className={styles.creationDate}>{updated_at}</span>
          {is_owner && (
            <div className="ml-2">
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </Card.Body>

      <Link to={`/tasks/${id}`} className={styles.ImageSection}>
        {image && <Card.Img src={image} alt={title} />}
      </Link>

      <Card.Body className={styles.ContentSection}>
        <Media className="align-items-center justify-content-between">
          <div className="d-flex align-items-center">{content}</div>
        </Media>
      </Card.Body>
      <Card.Body className={styles.FooterSection}>
        <p className={styles.DueDateP}>
          Due date:{" "}
          <span className={styles.DueDateSpan}>{formattedDueDate}</span>
        </p>
      </Card.Body>
    </Card>
  );
};

export default Task;
