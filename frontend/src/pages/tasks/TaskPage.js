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

// TaskPage to display a specific task and its comments
function TaskPage() {
  // Redirects logged out users
  useRedirect("loggedOut");
  const { id } = useParams();
  const [task, setTask] = useState({ results: [] });
  // State to hold comments associated with the task
  const [comments, setComments] = useState({ results: [] });
  // Retrieves current user information
  const currentUser = useCurrentUser();

  // Boolean to check if the task data is loaded
  const isDataLoaded = task.results && task.results.length > 0;
  // Extract first task data if loaded, else null
  const taskData = isDataLoaded ? task.results[0] : null;
  // Check if current user is the owner of the task
  const isOwner = taskData && currentUser?.username === taskData.owner;
  // Check if the task is public
  const isPublicTask = taskData && taskData.is_public;

  // Clear task data from the state
  const removeTaskFromState = () => {
    setTask({ results: [] });
  };

  // Fetch task and comments data when the component mounts or the ID changes
  useEffect(() => {
    const fetchTaskAndComments = async () => {
      try {
        // Fetches task and comments data from the server using the task ID
        const [{ data: taskResponse }, { data: commentsResponse }] =
          await Promise.all([
            axiosReq.get(`/tasks/${id}`),
            axiosReq.get(`/comments/?task_id=${id}`),
          ]);

        // Set fetched task and comments data to their respective states
        setTask({ results: [taskResponse] });
        setComments(commentsResponse);
      } catch (err) {
        // Logs the error if the fetching fails
        console.log(err);
      }
    };

    // Calls the fetch function
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
