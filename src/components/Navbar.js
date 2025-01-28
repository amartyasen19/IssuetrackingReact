import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './NavigationBar.css';  

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Navbar.Brand className="navbar-brand">
        <h1 className="text-white">Issue Tracker</h1> {/*added simple text */}
      </Navbar.Brand>
      <Nav className="ml-auto custom-nav">
        <Link to="/" className="nav-link">
          <Button variant="outline-light" className="mr-2">All Issues</Button> {/* Button for All Issues */}
        </Link>
        <Link to="/addissue" className="nav-link">
          <Button variant="outline-light">Add New Issue</Button> {/* Add New Issue sir i make this form for the test purpose */}
        </Link>
      </Nav>
    </Navbar>
  );
};

export default NavigationBar;
