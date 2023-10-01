import React, { useState } from "react";
import { Form, Button, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import regex from "../../config/regex";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import ErrorModal from "../../UI/ErrorModal";
import Spinner from "../../UI/Spinner";
import classes from "./Signin.module.css";

const Signin = () => {
  const [formData, setFormData] = useState({
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

  const debouncedChangeHandler = debounce((key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: {
        value: value,
        isValid: key === "email" ? regex.emailConstant.test(value) : value.length >= 6,
      },
    }));
  }, 1000);

  const inputChangeHandler = (key, e) => {
    const newValue = e.target.value;
    debouncedChangeHandler(key, newValue);
  };

  const closeModal = () => {
    setShowErrorModal(false);
  };

  const signinHandler = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
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
      sessionStorage.setItem("authenticated", "true");
      navigate("/dashboard");
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
      resetFormData();
    }
  };

  const handleAuthError = (error) => {
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
  };

  const resetFormData = () => {
    setFormData({
      email: {
        value: "",
        isValid: true,
      },
      password: {
        value: "",
        isValid: true,
      },
    });
  };

  return (
    <Form onSubmit={signinHandler} className={classes.formContainer}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          onChange={(e) => inputChangeHandler("email", e)}
          type="email"
          placeholder="Enter email"
          required
          className={classes.darkInput}
        />
        {!formData.email.isValid && formData.email.value && (
          <Form.Text className="text-danger">Invalid email</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          onChange={(e) => inputChangeHandler("password", e)}
          type="password"
          placeholder="Password"
          required
          className={classes.darkInput}
        />
        {!formData.password.isValid && formData.password.value && (
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



