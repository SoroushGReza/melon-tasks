import React from "react";
import styles from "../../styles/Task.module.css";
import Card from "react-bootstrap/Card";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Media from 'react-bootstrap/Media';
import { Link } from 'react-router-dom';
import Avatar from "../../components/Avatar";

const Task = (props) => {
  const {
    id,
    owner,
    account_id,
    account_image,
    title,
    image,
    due_date,
    priority,
    category,
    status,
    is_overdue,
    is_public,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  return (
    <Card className={styles.Task}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/accounts/${account_id}`}>
            <Avatar src={account_image} height={55} />
            {owner}
          </Link>
        </Media>
      </Card.Body>
    </Card>
  );
};

export default Task;
