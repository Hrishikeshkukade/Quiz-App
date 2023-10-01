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
import ErrorModal from "../../UI/ErrorModal";
import Spinner from "../../UI/Spinner";
import classes from "./Signin.module.css";

const Signin = () => {
  const [formDataAndValidation, setFormDataAndValidation] = useState({
    email: {
      value: "",
      isValid: true,
    },
    password: {
      value: "",
      isValid: true,
    },
  });
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const debouncedEmailChangeHandler = debounce((newEmail) => {
    setFormDataAndValidation((prevState) => ({
      ...prevState,
      email: {
        value: newEmail,
        isValid: constant.emailConstant.test(newEmail),
      },
    }));
  }, 1000);

  const emailChangeHandler = (e) => {
    const newEmail = e.target.value;
    debouncedEmailChangeHandler(newEmail);
  };

  const debouncedPasswordChangeHandler = debounce((newPassword) => {
    setFormDataAndValidation((prevState) => ({
      ...prevState,
      password: {
        value: newPassword,
        isValid: newPassword.length >= 6,
      },
    }));
  }, 1000);

  const passwordChangeHandler = (e) => {
    const newPassword = e.target.value;
    debouncedPasswordChangeHandler(newPassword);
  };

  const closeModal = () => {
    setShowErrorModal(false);
  };

  const signinHandler = async (e) => {
    e.preventDefault();
    const { email, password } = formDataAndValidation;
    if (!email.isValid || !password.isValid) {
      return;
    }
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      const user = userCredential.user;
      // console.log(user);

      // console.log("Signed in user:", user);
      sessionStorage.setItem("authenticated", "true");
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setError("Email is not valid");
      } else if (error.code === "auth/user-not-found") {
        setError("User is not registered");
      } else if (error.code === "auth/wrong-password") {
        setError("Wrong password");
      } else if (error.code === "auth/missing-password") {
        setError("Password is required");
      } else if (error.code === "auth/network-request-failed") {
        setError("Network problem, please try again later!");
      } else {
        setError(error.message);
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
      setFormDataAndValidation({
        email: {
          value: "",
          isValid: true,
        },
        password: {
          value: "",
          isValid: true,
        },
      });
    }
  };

  const GoogleSigninHandler = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.log("Google Sign-In Error:", error);
    }
  };

  return (
    <Form onSubmit={signinHandler} className={classes.formContainer}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          onChange={emailChangeHandler}
          type="email"
          placeholder="Enter email"
          required
          className={classes.darkInput}
        />
        {!formDataAndValidation.email.isValid && formDataAndValidation.email.value && (
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
          className={classes.darkInput}
        />
        {!formDataAndValidation.password.isValid && formDataAndValidation.password.value && (
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
    </Form>
  );
};

export default Signin;

