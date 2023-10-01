import React, { useState, useEffect } from "react";
import { Button, Form, Nav } from "react-bootstrap";
import classes from "./Register.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import ErrorModal from "../../UI/ErrorModal";
import Spinner from "../../UI/Spinner";
import debounce from "lodash/debounce";
import styles from "./RegisterStyles";
import regex from "../../config/regex";
import { useTheme } from "../../context/ThemeContext";

function Register() {
  const [formDataAndValidation, setFormDataAndValidation] = useState({
    name: {
      value: "",
      isValid: true,
    },
    email: {
      value: "",
      isValid: true,
    },
    password: {
      value: "",
      isValid: true,
    },
    confirmPassword: {
      value: "",
      isValid: true,
    },
    gender: {
      value: "",
      isValid: true,
    },
  });

  const theme = useTheme();

  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated when the component mounts
    const authenticated = sessionStorage.getItem("authenticated");
    if (authenticated === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Debounce the change handlers

  const debouncedChangeHandler = (field, newValue, validator) => {
    return debounce((newValue) => {
      setFormDataAndValidation((prevData) => ({
        ...prevData,
        [field]: {
          value: newValue,
          isValid: validator(newValue),
        },
      }));
    }, 1000);
  };

  const handleInputChange = (field, newValue, validator) => {
    debouncedChangeHandler(field, newValue, validator)(newValue);
  };

  const closeModal = () => {
    setShowErrorModal(false);
    setError(null); // Clear the error message
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formDataAndValidation;
    if (!name.isValid || !email.isValid || !password.isValid || !confirmPassword.isValid) {
      // Handle validation error, show a message, etc.
      return;
    }
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      await updateProfile(userCredential.user, {
        displayName: name.value,
        gender: formDataAndValidation.gender.value,
      });
      const user = userCredential.user;

      // Use the generated UID
      const uid = user.uid;

      // Add user data to Firestore with the generated UID
      const docRef = await addDoc(collection(db, "users"), {
        uid: uid,
        name: name.value,
        email: email.value,
        password: password.value,
        gender: formDataAndValidation.gender.value,
      });

      console.log("User registered and document written with ID: ", docRef.id);
      navigate("/dashboard");
      sessionStorage.setItem("authenticated", "true");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else if (error.code === "auth/network-request-failed") {
        setError("Network problem, please try again later!");
      } else {
        setError(error.message);
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={signupHandler} className={classes.formContainer}>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={(e) => {
              const newValue = e.target.value;
              handleInputChange("name", newValue, (value) => value.trim() !== "");
            }}
            type="text"
            placeholder="Enter Your Name"
            required
            className={classes.darkInput}
          />
          {!formDataAndValidation.name.isValid && formDataAndValidation.name.value && (
            <Form.Text className="text-danger">Name is required</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicGender">
          <Form.Label>Gender</Form.Label>
          <Form.Select
            value={formDataAndValidation.gender.value}
            onChange={(e) =>
              setFormDataAndValidation((prevData) => ({
                ...prevData,
                gender: {
                  value: e.target.value,
                  isValid: true, // Since it's just a select input
                },
              }))
            }
            className={classes.darkInput}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => {
              const newValue = e.target.value;
              handleInputChange("email", newValue, (value) => regex.emailConstant.test(value));
            }}
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
            onChange={(e) => {
              const newValue = e.target.value;
              handleInputChange("password", newValue, (value) => value.length >= 6);
            }}
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
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            onChange={(e) => {
              const newValue = e.target.value;
              handleInputChange("confirmPassword", newValue, (value) => value === formDataAndValidation.password.value);
            }}
            type="password"
            placeholder="Confirm Password"
            required
            className={classes.darkInput}
          />
          {!formDataAndValidation.confirmPassword.isValid && formDataAndValidation.confirmPassword.value && (
            <Form.Text className="text-danger">
              Passwords do not match
            </Form.Text>
          )}
        </Form.Group>

        <Button disabled={isLoading} variant="primary" type="submit">
          {isLoading ? <Spinner /> : "Submit"}
        </Button>
        <ErrorModal
          show={showErrorModal}
          onClose={closeModal}
          errorMessage={error}
        />
      </Form>
      <span style={styles.span}>
        <Nav.Link as={NavLink} to="/signin" active="/signin" exact>
          Already have an account? Sign In
        </Nav.Link>
      </span>
    </React.Fragment>
  );
}

export default Register;


