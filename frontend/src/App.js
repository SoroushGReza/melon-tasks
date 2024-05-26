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
import AccountPage from "./pages/accounts/AccountPage";
import UsernameForm from "./pages/accounts/UsernameForm";
import UserPasswordForm from "./pages/accounts/UserPasswordForm";
import AccountEditForm from "./pages/accounts/AccountEditForm";

function App() {
  const currentUser = useCurrentUser();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const username = currentUser?.username;
        if (!username) {
          console.error("No logged-in user found!");
          return; // Exit the function if no user is found
        }
        const { data } = await axiosReq.get(
          `/tasks/?owner__username=${username}`
        );
        setTasks(data.results);
      } catch (err) {
        console.log(err);
      }
    };

    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]); // Dependency on currentUser

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <MyCalendar tasks={tasks} setTasks={setTasks} />}
          />
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
          <Route
            exact
            path="/tasks/create"
            render={() => <TaskCreateForm setTasks={setTasks} />}
          />
          <Route exact path="/tasks/:id" render={() => <TaskPage />} />
          <Route exact path="/tasks" render={() => <TasksPage />} />
          <Route
            exact
            path="/tasks/:id/edit"
            render={() => <TaskEditForm setTasks={setTasks} />}
          />
          <Route exact path="/accounts/:id" render={() => <AccountPage />} />
          <Route
            exact
            path="/accounts/:id/edit/username"
            render={() => <UsernameForm />}
          />
          <Route
            exact
            path="/accounts/:id/edit/password"
            render={() => <UserPasswordForm />}
          />
          <Route
            exact
            path="/accounts/:id/edit"
            render={() => <AccountEditForm />}
          />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
