import React, { useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  Dropdown,
  Modal,
  Button,

} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import DarkTheme from "../Components/DarkTheme/DarkTheme";

// import {BrowserRouter as Router, NavLink} from "react-router-dom";

const NavBar = () => {
  const styles = {
    dropdown: {
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    darkModal: {
      backgroundColor: "var(--background-color)",
      color: "var(--text-color)",
      borderRadius: "5px",
      /* Add any other dark theme styles you need for the modal */
    }
  };

  const [authenticatedUser, setAuthenticatedUser] = useState(auth.currentUser);
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const listenAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email;
        setEmail(userEmail);
        setGender(user.gender);
        console.log(gender);
        setAuthenticatedUser(user);
      } else {
        setAuthenticatedUser(null);
      }
      setLoading(false);
    });
    return () => {
      listenAuth();
    };
  });

  const navigate = useNavigate();

  const logoutModalHandler = () => {
    setShowLogoutModal(true);
  };
  const hideLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.setItem("authenticated", "false");
        navigate("/");
        console.log("signed out");
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error);
        // An error happened.
      });
      setShowLogoutModal(false)
  };
  // const imageSource = authenticatedUser && gender === "male" ?
  // `/Boy.jpg` :
  // 'Girl.jpg';
  if (loading) {
    return;
  }
  return (
    <Navbar data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Quizknowledge</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* <Nav className="justify-content-end"> */}
          <Nav className="ms-auto">
            {authenticatedUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="success"
                  id="circular-dropdown"
                  styles={styles.dropdown}
                >
                  <img
                    src="/blank.jpg"
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "4px",
                    }}
                  />
                  {/* <Row>
          <Col xs={6} md={4}>
          <Image src={`./public/Boy.jpg/${authenticatedUser.gender}`} roundedCircle />

        </Col>
        </Row> */}
                  {email}

                  {/* <i className="fas fa-user"></i> Font Awesome icon */}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/dashboard">
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/profile">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/settings">
                    Settings
                  </Dropdown.Item>
                  {/* <Dropdown.Item href="#settings">Settings</Dropdown.Item> */}
                  <Dropdown.Item onClick={logoutModalHandler}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={NavLink} to="/signin">
                  Sign In
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about">
                  About
                </Nav.Link>{" "}
                <Nav.Link as={NavLink} to="/reviews">
                  Reviews
                </Nav.Link>
             
              
                 
               
                   <DarkTheme />
               
             
              
               </>
            )}
           
          </Nav>
        
        </Navbar.Collapse>
        {showLogoutModal && (
          <Modal style={{color: "black"}} show={showLogoutModal} onHide={hideLogoutModal}>
            <div style={styles.darkModal}>

       
            <Modal.Header closeButton>
              <Modal.Title>Confirm Logout</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to Logout?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={hideLogoutModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={logoutHandler}>
                Logout
              </Button>
            </Modal.Footer>
            </div>
          </Modal>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
