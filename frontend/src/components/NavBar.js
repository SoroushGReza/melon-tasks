import React, { useState, useRef } from "react";
import { Form, FormControl, Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useSetCurrentUser,
  useCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import { axiosReq } from "../api/axiosDefaults";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

// Navbar component
const NavBar = () => {
  // For managing current user data and navbar behavior
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const navbarRef = useRef(null);
  const searchRef = useRef(null);

  // managing navbar, search expansion and search functionality
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Close navbar when clicking outside
  useClickOutsideToggle(() => setNavbarExpanded(false), navbarRef);
  // Close searchbar when clicking otside
  useClickOutsideToggle(() => setSearchExpanded(false), searchRef);

  // Handle search input changes and fetch results
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length === 0) {
      setSearchResults([]);
    } else {
      try {
        // Fetch search result based on query
        const { data } = await axiosReq.get(`/search-users/?username=${query}`);
        setSearchResults(data.results);
        setSearchExpanded(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Close search results dropdown
  const closeSearchResults = () => {
    setSearchExpanded(false);
  };

  // Handle sign out
  const handleSignout = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null); // Clear current user context
    } catch (err) {
      console.log(err);
    }
  };

  // Create task icon
  const addTaskIcon = (
    <NavLink
      className={`${styles.CreateTaskButton} d-flex align-items-center`}
      to="/tasks/create"
    >
      <i className="fa-solid fa-calendar-plus"></i>
      <span className={`${styles.CreateTaskText}`}>Create task</span>
    </NavLink>
  );

  // Links shown to logged in users
  const loggedInIcons = (
    <>
      <NavLink
        activeClassName={styles.Active}
        className={styles.NavLink}
        to="/tasks"
      >
        <i className="fa-solid fa-list-check"></i>
        <span className={styles.NavLinkTexts}>Tasks</span>
      </NavLink>

      <NavLink className={styles.NavLink} to="/" onClick={handleSignout}>
        <i className="fa-solid fa-right-from-bracket"></i>
        <span className={styles.NavLinkTexts}>Sign out</span>
      </NavLink>

      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to={`/accounts/${currentUser?.account_id}`}
      >
        <div>
          <Avatar src={currentUser?.account_image} height={40} />
        </div>
        <span className={styles.NavLinkTexts}>Account</span>
      </NavLink>
    </>
  );

  // Links shown to logged out users
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fa-solid fa-right-to-bracket"></i>
        <span className={styles.NavLinkTexts}>Sign in</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signup"
      >
        <i className="fa-solid fa-user-plus"></i>
        <span className={styles.NavLinkTexts}>Sign up</span>
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={navbarExpanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
      ref={navbarRef}
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" />
          </Navbar.Brand>
        </NavLink>
        {currentUser && (
          <div className={styles.SearchInputContainer} ref={searchRef}>
            <Form inline onSubmit={(e) => e.preventDefault()}>
              <FormControl
                type="text"
                placeholder="Search for users"
                className="mr-sm-2"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Form>
            {searchExpanded && (
              <div className={styles.SearchResultsDropdown}>
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <NavLink
                      key={user.id}
                      to={`/accounts/${user.id}`}
                      onClick={closeSearchResults}
                    >
                      {user.username}
                    </NavLink>
                  ))
                ) : (
                  <div className={styles.NoUserFound}>No user found</div>
                )}
              </div>
            )}
          </div>
        )}
        <Navbar.Toggle
          onClick={() => setNavbarExpanded(!navbarExpanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          {currentUser && addTaskIcon}

          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fa-solid fa-house-chimney"></i>
              <span className={styles.NavLinkTexts}>Home</span>
            </NavLink>

            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
