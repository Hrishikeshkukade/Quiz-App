import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
import {  onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";




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
  };


  const [authenticatedUser, setAuthenticatedUser] = useState(auth.currentUser);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const listenAuth = onAuthStateChanged(auth, (user) => {
      if(user) {
      const userName = user.email;
      setName(userName)
        setAuthenticatedUser(user)
        setGender(user.gender)
        console.log(gender)
      }else{
        setAuthenticatedUser(null)
      }
      setLoading(false)
    }) 
    return() => {
      listenAuth();
    }
  })
   
 

  const navigate = useNavigate();


  

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.setItem("authenticated","false")
        navigate("/");
        console.log("signed out");
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error);
        // An error happened.
      });
  };
  const imageSource = authenticatedUser && gender === "male" ?
  `/Boy.jpg` :
  'Girl.jpg';
  if(loading){
    return ;
  }
  return (
    <Navbar data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Quiz</Navbar.Brand>
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
                  src={imageSource}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                />
          {/* <Row>
          <Col xs={6} md={4}>
          <Image src={`./public/Boy.jpg/${authenticatedUser.gender}`} roundedCircle />

        </Col>
        </Row> */}
             {name}
      
       
      
    
                  {/* <i className="fas fa-user"></i> Font Awesome icon */}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/profile">Profile</Dropdown.Item>
                  {/* <Dropdown.Item href="#settings">Settings</Dropdown.Item> */}
                  <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/" exact>
                  Home
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/register"
                
                  exact={true}
                >
                  Register
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/signin"
                
                  exact={true}
                >
                  Sign In
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/about"
                  
                  exact={true}
                >
                  About
                </Nav.Link>{" "}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
