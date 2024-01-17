import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useSetCurrentUser } from "../contexts/CurrentUserContext";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import { axiosReq } from "../api/axiosDefaults";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length === 0) {
      setSearchResults([]); // Clear results when the input is empty
    } else {
      try {
        const { data } = await axiosReq.get(`/search-users/?username=${query}`);
        setSearchResults(data.results);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const addTaskIcon = (
    <NavLink className={`${styles.CreateTaskButton}`} to="/tasks/create">
      <i className="fa-solid fa-calendar-plus"></i>Create task
    </NavLink>
  );

  const handleSignout = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const loggedInIcons = (
    <>
      <NavLink
        activeClassName={styles.Active}
        className={styles.NavLink}
        to="/tasks"
      >
        <i className="fa-solid fa-list-check"></i>Tasks
      </NavLink>

      <NavLink className={styles.NavLink} to="/" onClick={handleSignout}>
        <i className="fa-solid fa-right-from-bracket"></i>Sign out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/accounts/${currentUser?.account_id}`}
      >
        <Avatar src={currentUser?.account_image} text="Account" height={40} />
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fa-solid fa-right-to-bracket"></i>Sign in
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signup"
      >
        <i className="fa-solid fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className={styles.SearchInputContainer}>
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search for users"
                className="mr-sm-2"
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={(e) => e.key === "Enter" && handleSearchChange(e)}
              />
              <Button variant="outline-success" onClick={handleSearchChange}>
                Search
              </Button>
            </Form>

            {searchResults.length > 0 && (
              <div className={styles.SearchResultsDropdown}>
                {searchResults.map((user) => (
                  <NavLink key={user.id} to={`/accounts/${user.id}`}>
                    {user.username}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {currentUser && addTaskIcon}

          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fa-solid fa-house-chimney"></i>Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
