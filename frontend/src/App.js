import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import { axiosReq } from "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import MyCalendar from "./components/MyCalendar";
import TaskCreateForm from "./pages/tasks/TaskCreateForm";
import TaskPage from "./pages/tasks/TaskPage";
import TasksPage from "./pages/tasks/TasksPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import TaskEditForm from "./pages/tasks/TaskEditForm";

function App() {
  const currentUser = useCurrentUser();
  const account_id = currentUser?.account_id || "";
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/?account_id=${account_id}`);
        setTasks(data.results);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, [account_id]);

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <MyCalendar tasks={tasks} />} />
          <Route
            exact
            path="/alltasks"
            render={() => (
              <TasksPage
                message="No results found. Try another keyword."
                setTasks={setTasks}
                tasks={tasks}
              />
            )}
          />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/tasks/create" render={() => <TaskCreateForm />} />
          <Route exact path="/tasks/:id" render={() => <TaskPage />} />
          <Route exact path="/tasks" render={() => <TasksPage />} />
          <Route exact path="/tasks/:id/edit" render={() => <TaskEditForm />} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
