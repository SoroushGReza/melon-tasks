import React from "react";
import { Media } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/TaskComment.module.css";
import { Link } from "react-router-dom";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosRes } from "../../api/axiosDefaults";

const TaskComment = (props) => {
  const {
    account_id,
    account_image,
    owner,
    created_at,
    content,
    author,
    setTask,
    setComments,
    id,
  } = props;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === author;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setTask((prevTask) => ({
        results: [
          {
            ...(prevTask.results[0].comments_count - 1),
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.CommentForm}>
      <Media as="li" className="mt-3">
        <Link to={`/accounts/${account_id}`} className="mt-1">
          <Avatar src={currentUser?.account_image} height={25} />
        </Link>
        <Media.Body className="mb-1">
          <h6 className={styles.Owner}>{author}</h6>
          <p>{content}</p>
          <small className={styles.Date}>{created_at}</small>
        </Media.Body>
        {is_owner && (
          <MoreDropdown handleEdit={() => {}} handleDelete={handleDelete} />
        )}
      </Media>
    </div>
  );
};

export default TaskComment;
