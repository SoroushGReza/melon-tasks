import React from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import logo from "../assets/logo.png";

const NavBar = () => {
  return (
    <Navbar bg="light" expand="md" fixed="top">
      <Container>
        <Navbar.Brand>
          <img src={logo} alt="logo" height="45" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Nav className="ml-auto text-left">
            <Nav.Link>
              <i className="fa-solid fa-right-to-bracket"></i>Sign in
            </Nav.Link>
            <Nav.Link>
              <i className="fa-solid fa-user-plus"></i>Sign up
            </Nav.Link>
            <NavDropdown
              title={
                <>
                  <i className="fa-solid fa-calendar-days">{""}</i>View
                </>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="#action/3.1">Year</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Month</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
