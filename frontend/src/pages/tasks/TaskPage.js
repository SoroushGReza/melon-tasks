import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Task from "./Task";
import PermittedAccounts from "../accounts/PermittedAccounts";
import TaskComment from "./TaskComment";
import TaskCommentCreateForm from "./TaskCommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext"; // Import useCurrentUser

function TaskPage() {
  const { id } = useParams();
  const [task, setTask] = useState({ results: [] });
  const [comments, setComments] = useState({ results: [] });
  const currentUser = useCurrentUser();

  const isDataLoaded = task.results && task.results.length > 0;
  const taskData = isDataLoaded ? task.results[0] : null;
  const isOwner = taskData && currentUser?.username === taskData.owner;
  const isPublicTask = taskData && taskData.is_public;

  const removeTaskFromState = () => {
    setTask({ results: [] }); // Clear task from state
  };

  useEffect(() => {
    const fetchTaskAndComments = async () => {
      try {
        const [{ data: taskResponse }, { data: commentsResponse }] =
          await Promise.all([
            axiosReq.get(`/tasks/${id}`),
            axiosReq.get(`/comments/?task_id=${id}`),
          ]);

        setTask({ results: [taskResponse] });
        setComments(commentsResponse);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTaskAndComments();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={10}>
        {isDataLoaded && (
          <>
            <Task
              {...taskData}
              setTasks={setTask}
              taskPage
              removeTask={removeTaskFromState}
            />
            <Container className={appStyles.Content}>
              {(isPublicTask || isOwner) && (
                <TaskCommentCreateForm taskId={id} setComments={setComments} />
              )}
              <ul className="list-unstyled">
                {comments.results.map((comment) => (
                  <TaskComment key={comment.id} {...comment} />
                ))}
              </ul>
            </Container>
          </>
        )}
      </Col>
    </Row>
  );
}

export default TaskPage;
