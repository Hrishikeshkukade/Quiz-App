import React, { useState, useEffect } from "react";
import { Button, Form, Nav } from "react-bootstrap";
import classes from "./Register.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import ErrorModal from "../../UI/Modal";
import Spinner from "../../UI/Spinner";
import debounce from "lodash/debounce";
import styles from "./RegisterStyles";
import constant from "../../config/Constant";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [gender, setGender] = useState("");

  const [isNameValid, setNameValid] = useState(true);
  const [isEmailValid, setEmailValid] = useState(true);
  const [isPasswordValid, setPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setConfirmPasswordValid] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated when the component mounts
    const authenticated = sessionStorage.getItem("authenticated");
    if (authenticated === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

   // Debounce the name change handler
  
   const debouncedNameChangeHandler = debounce((newName) => {
    setName(newName);
    setNameValid(newName.trim() !== ""); // Basic validation
  }, 1000);
  const nameChangeHandler = (e) => {
    const newName = e.target.value;
    debouncedNameChangeHandler(newName);
  };

  // Debounce the email change handler
  const debouncedEmailChangeHandler = debounce((newEmail) => {
    setEmail(newEmail);

    const isValid = constant.emailConstant.test(newEmail);
    setEmailValid(isValid);
  }, 1000);

  const emailChangeHandler = (e) => {
    const newEmail = e.target.value;
    debouncedEmailChangeHandler(newEmail);
  };

  // Debounce the password change handler
  const debouncedPasswordChangeHandler = debounce((newPassword) => {
    setPassword(newPassword);
    setPasswordValid(newPassword.length >= 6);
  }, 1000);

  const passwordChangeHandler = (e) => {
    const newPassword = e.target.value;
    debouncedPasswordChangeHandler(newPassword);
  };

  // Debounce the confirm password change handler
  const debouncedConfirmPasswordChangeHandler = debounce(
    (newConfirmPassword) => {
      setConfirmPassword(newConfirmPassword);
      setConfirmPasswordValid(newConfirmPassword === password);
    },
    1000
  );

  const confirmPasswordChangeHandler = (e) => {
    const newConfirmPassword = e.target.value;
    debouncedConfirmPasswordChangeHandler(newConfirmPassword);
  };
  const closeModal = () => {
    setShowErrorModal(false);
    setError(null); // Clear the error message
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (
      !isNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      // Handle validation error, show a message, etc.
      return;
    }
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
       
      )
      await updateProfile(userCredential.user, {
        displayName: name,
        gender: gender,
        
      });
      const user = userCredential.user;
        
      // Use the generated UID
      const uid = user.uid;

      // Add user data to Firestore with the generated UID
      const docRef = await addDoc(collection(db, "users"), {
        uid: uid,
        name: name,
        email: email,
        password: password,
        gender: gender,
        
        
      })
      
   
      console.log("User registered and document written with ID: ", docRef.id);
      navigate("/dashboard");
      sessionStorage.setItem("authenticated", "true");
    } catch (error) {
    
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } 
      else if(error.code === "auth/network-request-failed"){
        setError("Network problem,please try again later!")
      }
      else {
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
            
            onChange={nameChangeHandler}
            type="text"
            placeholder="Enter Your Name"
            required
          />
          {!isNameValid && name && (
            <Form.Text className="text-danger">Name is required</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicGender">
  <Form.Label>Gender</Form.Label>
  <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
    <option value="">Select gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </Form.Select>
</Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={emailChangeHandler}
            type="email"
            placeholder="Enter email"
            required
          />
          {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text> */}
          {!isEmailValid && email && (
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

          {!isPasswordValid && password && (
            <Form.Text className="text-danger">
              Password must be at least 6 characters long
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            onChange={confirmPasswordChangeHandler}
            type="password"
            placeholder="Confirm Password"
            required
          />
          {!isConfirmPasswordValid && confirmPassword && (
            <Form.Text className="text-danger">
              Passwords do not match
            </Form.Text>
          )}
        </Form.Group>
    
        <Button disabled={isLoading} variant="primary" type="submit">
          {isLoading ? (
            <Spinner />
          ) : (
            "Submit"
          )}
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