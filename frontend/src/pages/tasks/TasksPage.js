import React, { useContext, useEffect, useState } from "react";
import Post from "./Task";
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
import PermittedAccounts from "../accounts/PermittedAccounts";

function TasksPage({ message, filter = "" }) {
  const [tasks, setTasks] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useContext(CurrentUserContext);

  const [query, setQuery] = useState("");

  useEffect(() => {
    // const fetchTasks = async () => {
    //   try {
    //     const { data } = await axiosReq.get(`/tasks/?${filter}search=${query}`);
    //     setTasks(data);
    //     setHasLoaded(true);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    const fetchTasks = async () => {
      try {
        const username = currentUser?.username; // Make sure currentUser and username exist
        if (!username) {
          console.error("No logged-in user found!");
          return; // Exit the function if no user is found
        }
        const { data } = await axiosReq.get(
          `/tasks/?owner__username=${username}&${filter}search=${query}`
        );
        setTasks(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchTasks();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PermittedAccounts mobile />
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
                  <Post key={task.id} {...task} setTasks={setTasks} />
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
        <PermittedAccounts />
      </Col>
    </Row>
  );
}

export default TasksPage;
