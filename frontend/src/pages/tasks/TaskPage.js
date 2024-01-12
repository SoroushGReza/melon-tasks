import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Task from "./Task";
import TaskComment from "./TaskComment";
import TaskCommentCreateForm from "./TaskCommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/TaskPage.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import { useRedirect } from "../../hooks/useRedirect";

function TaskPage() {
  useRedirect("loggedOut");
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
            <Container className={styles.CommentContainer}>
              {(isPublicTask || isOwner) && (
                <TaskCommentCreateForm taskId={id} setComments={setComments} />
              )}
              <InfiniteScroll
                dataLength={comments.results.length}
                next={() => fetchMoreData(comments, setComments)}
                hasMore={!!comments.next}
                loader={<Asset spinner />}
              >
                {comments.results.map((comment) => (
                  <TaskComment
                    key={comment.id}
                    {...comment}
                    setTask={setTask}
                    setComments={setComments}
                    task={id}
                  />
                ))}
              </InfiniteScroll>
            </Container>
          </>
        )}
      </Col>
    </Row>
  );
}

export default TaskPage;
