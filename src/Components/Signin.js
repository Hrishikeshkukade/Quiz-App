import React, { useState, useEffect } from "react";
import { Form, Button, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import GoogleSigninButtton from "../UI/GoogleSigninButton";
import {  signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult} from "firebase/auth";
import { auth } from "../firebase";
import ErrorModal from "../UI/Modal";
import Spinner from "../UI/Spinner";

const Signin = () => {
  const styles = {
    formContainer: {
      display: "flex",
      width: "34%",
      flexDirection: "column",
      justifyContent: "center",
      marginLeft: "32%",
      marginTop: "10%",
    },
    cardContainer: {
      display: "flex",
      width: "auto",
      flexDirection: "column",
      justifyContent: "center",
      marginLeft: "32%",
      marginTop: "10%",
    },
    button: {
      textAlign: "center",
    },
    span: {
      textAlign: "center",
      padding: "20px",
    },
    fp:{
      textAlign: "right",
      padding: "20px"
    },
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isEmailValid, setEmailValid] = useState(true);
  const [isPasswordValid, setPasswordValid] = useState(true);

  const navigate = useNavigate();
  // useEffect(() => {
  //   // Check if the user is already authenticated when the component mounts
  //   const authenticated = sessionStorage.getItem("authenticated");
  //   if (authenticated === "true") {
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);


  const emailChangeHandler = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    setEmailValid(isValid);
  };

  const passwordChangeHandler = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordValid(newPassword.length >= 6);
  };

  const closeModal = () => {
    setShowErrorModal(false);
  };

  const signinHandler = async (e) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) {
      // Handle validation error, show a message, etc.
      return;
    }
    setIsLoading(true);
    
    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
        
      );
      const user = userCredential.user;
      console.log(user);

      console.log("Signed in user:", user);
      sessionStorage.setItem("authenticated", "true");
      navigate("/dashboard")
      // You can redirect the user to the dashboard or home page here
    } catch (error) {
      // You can display an error message to the user if needed
      if (error.code === "auth/invalid-email") {
        setError("Email is not valid");
      }else if(error.code === "auth/user-not-found"){
        setError("User is not registered");
      }else if (error.code === "auth/network-request-failed") {
        setError("Network problem,please try again later!");
       } else {
        setError(error.message);
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
    setEmail("")
    setPassword("");
  }
  // const GoogleSigninHandler = async() => {
  //   const provider = new GoogleAuthProvider();
  //   // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  //   // await signInWithPopup(auth, provider)
  //   // .then((result) => {
  //   //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   //   const credential = GoogleAuthProvider.credentialFromResult(result);
  //   //   const token = credential.accessToken;
  //   //   // The signed-in user info.
  //   //   const user = result.user;
  //   //   // IdP data available using getAdditionalUserInfo(result)
  //   //   // ...
  //   // }).catch((error) => {
  //   //   // Handle Errors here.
  //   //   // const errorCode = error.code;
  //   //   // const errorMessage = error.message;
  //   //   // // The email of the user's account used.
  //   //   // const email = error.customData.email;
  //   //   // The AuthCredential type that was used.
  //   //   console.log(error)
  //   //   const credential = GoogleAuthProvider.credentialFromError(error);
  //   //   // ...
  //   // });
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     // User is now signed in with Google.
  //     sessionStorage.setItem("authenticated", "true");
  //     navigate("/dashboard")
  //     console.log("Signed in user:", user);
  //   } catch (error) {
  //     // Handle errors if any.
  //     console.error("Google Sign-In Error:", error);
  //   }

  
  // }
 
  const GoogleSigninHandler = async () => {
    const provider = new GoogleAuthProvider();
  
    try {
      // Start the Google sign-in process with a redirect
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const GoogleSignInRedirect = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const handleRedirect = async () => {
        try {
          // Complete the Google sign-in process after the redirect
          const result = await getRedirectResult(auth);
  
          if (result.user) {
            // User is now signed in with Google.
            sessionStorage.setItem("authenticated", "true");
            navigate("/dashboard");
          } else {
            // Handle the case where sign-in was not successful
            console.error("Google Sign-In Error: Sign-in was not successful");
          }
        } catch (error) {
          console.error("Google Sign-In Error:", error);
        }
      };
  
      handleRedirect();
    }, [navigate]);
  
    return <Spinner />;
  };


  return (
    <Form onSubmit={signinHandler} style={styles.formContainer}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          onChange={emailChangeHandler}
          type="email"
          placeholder="Enter email"
          required
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>

        {!isEmailValid && (
          <Form.Text className="text-danger">Invalid email</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          onChange={passwordChangeHandler}
          type="password"
          placeholder="Password"
          required
        />
        {!isPasswordValid && (
          <Form.Text className="text-danger">
            Password must be at least 6 characters long
          </Form.Text>
        )}
      </Form.Group>
      <Button disabled={isLoading} variant="primary" type="submit">
        {isLoading ? <Spinner /> : "Sign in"}
      </Button>
      <Nav.Link  as={NavLink} style={styles.fp} to="/fp">Forgot Password</Nav.Link>
      <ErrorModal
        show={showErrorModal}
        onClose={closeModal}
        errorMessage={error}
      />
     

      <GoogleSigninButtton onClick = {GoogleSigninHandler}/>
      <GoogleSignInRedirect /> {/* Render the redirection component */}
    </Form>
  );
};

export default Signin;
