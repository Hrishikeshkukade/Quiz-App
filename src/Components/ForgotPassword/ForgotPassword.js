import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { auth } from "../../firebase";
// import { updatePassword, get } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import Spinner from "../../UI/Spinner";
import styles from "./ForgotPasswordStyles";

const ForgotPassword = () => {
  
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);



    const emailChangeHandler = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    
        // const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
        // setEmailValid(isValid);
      };

      const updatePasswordHandler = (e) => {
        e.preventDefault();
        // const user = auth.currentUser;
        // const newPassword = getASecureRandomPassword();
        setIsLoading(true);
        sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
        setIsLoading(false);
      }
     


    return(
        <Form onSubmit={updatePasswordHandler} style={styles.formContainer}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            onChange={emailChangeHandler}
            type="email"
            placeholder="Enter email"
            required
          />
        
         
          </Form.Group>
          <Button disabled={isLoading} variant="primary" type="submit">
        {isLoading ? <Spinner /> : "Submit"}
      </Button>
          </Form>
    );
};

export default ForgotPassword