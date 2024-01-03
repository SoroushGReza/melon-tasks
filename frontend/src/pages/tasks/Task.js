import React from "react";
import styles from "../../styles/Task.module.css";
import Card from "react-bootstrap/Card";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Media from "react-bootstrap/Media";
import { Link, useHistory } from "react-router-dom";
import { MoreDropdown } from "../../components/MoreDropdown";

const Task = (props) => {
  const {
    id,
    owner,
    account_id,
    updated_at,
    title,
    content,
    image,
    due_date,
    priority,
    category,
    status,
    is_overdue,
    is_public,
    taskPage,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/tasks/${id}/edit`);
  };

  return (
    <Card className={styles.Task}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          {title && <Card.Title className="text-center">{title}</Card.Title>}
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && taskPage && <MoreDropdown handleEdit={handleEdit} />}
          </div>
        </Media>
      </Card.Body>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <div className="d-flex align-items-center">{content}</div>
        </Media>
      </Card.Body>
      <Link to={`/tasks/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>
      <Card.Body>
        <span>Due date: {due_date}</span>
        {/* Add content field in backend below later */}
        {/* {content && <Card.Text>{content}</Card.Text>} */}
      </Card.Body>
    </Card>
  );
};

export default Task;
