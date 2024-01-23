import React, { useState } from "react";
import { Media } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/TaskComment.module.css";
import { Link } from "react-router-dom";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosRes } from "../../api/axiosDefaults";
import TaskCommentEditForm from "./TaskCommentEditForm";

const TaskComment = (props) => {
  const {
    account_id,
    account_image,
    created_at,
    content,
    author,
    setTask,
    setComments,
    id,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === author;
  const taskId = props.task;

  // Delete comments 
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setTask((prevTask) => ({
        results: [
          {
            ...(prevTask.results[0]),
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
    <>
      <hr />
      <div className={styles.CommentForm}>
        <Media>
          <Link to={`/accounts/${account_id}`} className="mt-1">
            <Avatar src={currentUser?.account_image} height={25} />
          </Link>
          <Media.Body className="mb-1 align-self-center ml-2">
            <h6 className={styles.Owner}>{author}</h6>
            <p>{content}</p>
            {showEditForm ? (
              <TaskCommentEditForm
                id={id}
                taskId={taskId}
                content={content}
                accountImage={account_image}
                setComments={setComments}
                setShowEditForm={setShowEditForm}
              />
            ) : (
              <small className={styles.Date}>{created_at}</small>
            )}
          </Media.Body>
          {is_owner && !showEditForm && (
            <MoreDropdown
              handleEdit={() => setShowEditForm(true)}
              handleDelete={handleDelete}
            />
          )}
        </Media>
      </div>
      <hr />
    </>
  );
};

export default TaskComment;
