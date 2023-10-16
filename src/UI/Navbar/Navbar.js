import React, { useEffect, useState } from 'react';
import {
  Container,
  Navbar,
  Nav,
  Dropdown,
  Modal,
  Button,
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import DarkTheme from '../../Components/DarkTheme/DarkTheme';
import styles from './NavbarStyles';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Spinner } from 'react-bootstrap';

const NavBar = () => {
  const [userData, setUserData] = useState({
    name: '',
    gender: '',
  });
  const [profilePicture, setProfilePicture] = useState('./blank.jpg');
  const [authenticatedUser, setAuthenticatedUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const listenAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userName = user.displayName;
        const userGender = user.gender;
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        const profilePictureURL = userData?.profilePicture || null;

        setProfilePicture(profilePictureURL);
        setUserData({
          name: userName,
          gender: userGender,
        });
        setAuthenticatedUser(user);

         // Simulate a delay (e.g., 2 seconds) before hiding the loading spinner
         setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else {
        setAuthenticatedUser(null);
        setLoading(false); // Stop loading even if not authenticated
      }
      setLoading(false);
    });
    return () => {
      listenAuth();
    };
  }, []);

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
        sessionStorage.setItem('authenticated', 'false');
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
    setShowLogoutModal(false);
  };

  if (loading) {
    return (
      <Navbar data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
        <Container>
          <Spinner animation="border" />
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Quizknowledge</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {authenticatedUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="success"
                  id="circular-dropdown"
                  styles={styles.dropdown}
                >
                  <img
                    src={profilePicture || './blank.jpg'}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      marginRight: '4px',
                    }}
                  />
                  {userData.name}
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
                </Nav.Link>
                <Nav.Link as={NavLink} to="/reviews">
                  Reviews
                </Nav.Link>
                <DarkTheme />
              </>
            )}
          </Nav>
        </Navbar.Collapse>
        {showLogoutModal && (
          <Modal
            style={{ color: 'black' }}
            show={showLogoutModal}
            onHide={hideLogoutModal}
          >
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
