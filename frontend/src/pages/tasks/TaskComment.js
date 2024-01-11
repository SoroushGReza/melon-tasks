import React from "react";
import { Media } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/TaskComment.module.css";
import { Link } from "react-router-dom";

const TaskComment = (props) => {
  const { account_id, account_image, owner, created_at, content, author } =
    props;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === author;

  return (
    <div className={styles.CommentForm}>
      <hr />
      <Media as="li" className="mt-3">
        <Link to={`/accounts/${account_id}`}>
          <Avatar src={currentUser?.account_image} height={20} />
        </Link>
        <Media.Body>
          <h6 className={styles.Owner}>{author}</h6>
          <p>{content}</p>
          <small className={styles.Date}>{created_at}</small>
        </Media.Body>
      </Media>
    </div>
  );
};

export default TaskComment;
