import React, { useContext, useEffect, useState } from "react";
import Task from "./Task";
import Asset from "../../components/Asset";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

import appStyles from "../../App.module.css";
import styles from "../../styles/TasksPage.module.css";
import { useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import NewestAccounts from "../accounts/NewestAccounts";
import { useRedirect } from "../../hooks/useRedirect";

// TasksPage component, accepting props for an optional message and filter
function TasksPage({ message, filter = "" }) {
  // Redirect user if not logged in
  useRedirect("loggedOut");

  // State for storing tasks and loading status
  const [tasks, setTasks] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  // Get current location path
  const { pathname } = useLocation();

  // Access current user information from context
  const currentUser = useContext(CurrentUserContext);

  // State to store search query
  const [query, setQuery] = useState("");

  // remove task from the list by it ID
  const removeTaskFromList = (taskId) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      results: prevTasks.results.filter((task) => task.id !== taskId),
    }));
  };

  // Fetch tasks when dependencies change
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Check if a user is logged in
        const username = currentUser?.username;
        if (!username) {
          console.error("No logged-in user found!");
          return; // Exit if no user is found
        }

        // Fetch tasks data from the API
        const { data } = await axiosReq.get(
          `/tasks/?owner__username=${username}&${filter}search=${query}`
        );

        // Update state with fetched tasks and set loading status
        setTasks(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    // Reset loading state and set a timer to delay the fetch
    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchTasks();
    }, 1000); // Delayed fetch

    // Cleanup function to clear the timer
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <NewestAccounts mobile />
        <i className={`fa-solid fa-magnifying-glass ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search tasks"
          />
        </Form>
        {hasLoaded ? (
          <>
            {tasks.results.length ? (
              <InfiniteScroll
                children={tasks.results.map((task) => (
                  <Task
                    key={task.id}
                    {...task}
                    setTasks={setTasks}
                    onTaskDelete={removeTaskFromList}
                  />
                ))}
                dataLength={tasks.results.length}
                loader={<Asset spinner />}
                hasMore={!!tasks.next}
                next={() => fetchMoreData(tasks, setTasks)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
                <p>No tasks created yet</p>
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <NewestAccounts />
      </Col>
    </Row>
  );
}

export default TasksPage;
