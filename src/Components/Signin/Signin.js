import React, { useState, useEffect } from "react";
import { Form, Button, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import GoogleSigninButtton from "../../UI/GoogleSigninButton/GoogleSigninButton";
import debounce from "lodash/debounce";
import constant from "../../config/Constant";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../../firebase";
import ErrorModal from "../../UI/Modal";
import Spinner from "../../UI/Spinner";
import classes from "./Signin.module.css";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isEmailValid, setEmailValid] = useState(true);
  const [isPasswordValid, setPasswordValid] = useState(true);

  const navigate = useNavigate();

  const debouncedEmailChangeHandler = debounce((newEmail) => {
    setEmail(newEmail);
    const isValid = constant.emailConstant.test(newEmail);
    setEmailValid(isValid);
  }, 1000); // Adjust the delay time as needed (e.g., 300 milliseconds)

  const emailChangeHandler = (e) => {
    const newEmail = e.target.value;
    debouncedEmailChangeHandler(newEmail);
  };

  // Add debouncing for password input
  const debouncedPasswordChangeHandler = debounce((newPassword) => {
    setPassword(newPassword);
    setPasswordValid(newPassword.length >= 6);
  }, 1000); // Adjust the delay time as needed (e.g., 300 milliseconds)

  const passwordChangeHandler = (e) => {
    const newPassword = e.target.value;
    debouncedPasswordChangeHandler(newPassword);
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
        password
      );
      const user = userCredential.user;
      console.log(user);

      console.log("Signed in user:", user);
      sessionStorage.setItem("authenticated", "true");
      navigate("/dashboard");
      // You can redirect the user to the dashboard or home page here
    } catch (error) {
      // You can display an error message to the user if needed
      if (error.code === "auth/invalid-email") {
        setError("Email is not valid");
      } else if (error.code === "auth/user-not-found") {
        setError("User is not registered");
      } else if (error.code === "auth/network-request-failed") {
        setError("Network problem,please try again later!");
      } else {
        setError(error.message);
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
    setEmail("");
    setPassword("");
  };

  const GoogleSigninHandler = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // Start the Google sign-in process with a redirect
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.log("Google Sign-In Error:", error);
    }
  };

  // const GoogleSignInRedirect = () => {
  //   const navigate = useNavigate();

  //   useEffect(() => {
  //     const handleRedirect = async () => {
  //       try {
  //         // Complete the Google sign-in process after the redirect
  //         const result = await getRedirectResult(auth);

  //         if (result.user) {
  //           // User is now signed in with Google.
  //           sessionStorage.setItem("authenticated", "true");
  //           navigate("/dashboard");
  //         } else {
  //           // Handle the case where sign-in was not successful
  //           console.error("Google Sign-In Error: Sign-in was not successful");
  //         }
  //       } catch (error) {
  //         console.error("Google Sign-In Error:", error);
  //       }
  //     };

  //     handleRedirect();
  //   }, []);

  //   // return <Spinner />;
  // };

  return (
    <Form onSubmit={signinHandler} className={classes.formContainer}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          onChange={emailChangeHandler}
          type="email"
          placeholder="Enter email"
          required
        />
         {!isEmailValid && email && (
          <Form.Text className="text-danger">Invalid email</Form.Text>
        )}
        {/* <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text> */}

       
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          onChange={passwordChangeHandler}
          type="password"
          placeholder="Password"
          required
        />
        {!isPasswordValid && password && (
          <Form.Text className="text-danger">
            Password must be at least 6 characters long
          </Form.Text>
        )}
      </Form.Group>
      <Button disabled={isLoading} variant="primary" type="submit">
        {isLoading ? <Spinner /> : "Sign in"}
      </Button>
      <Nav.Link as={NavLink} className={classes.fp} to="/fp">
        Forgot Password
      </Nav.Link>
      <ErrorModal
        show={showErrorModal}
        onClose={closeModal}
        errorMessage={error}
      />
      {/* <GoogleSigninButtton  />
      <GoogleSignInRedirect /> Render the redirection component */}
    </Form>
  );
};

export default Signin;
