import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { auth } from "../../firebase";
// import { updatePassword, get } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import LoadingSpinner from "../../UI/Spinner";
import "./ForgotPassword.css"
import notify from "../../config/Notify";
import { ToastContainer } from "react-toastify";

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
          notify("Password reset email sent!", false)
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        }).finally(() => {
          setIsLoading(false)
        })
      
      }
     


    return(
      <>
        <Form onSubmit={updatePasswordHandler} className="formContainer">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            onChange={emailChangeHandler}
            type="email"
            placeholder="Enter email"
            required
            className="darkInput"
          />
             
         
          </Form.Group>
          <Button disabled={isLoading} variant="primary" type="submit">
        {isLoading ? <LoadingSpinner /> : "Submit"}
      </Button>
          </Form>
           <ToastContainer
           position="top-center"
           autoClose={5000}
           hideProgressBar={false}
           newestOnTop={false}
           closeOnClick
           rtl={false}
           pauseOnFocusLoss
           draggable
           pauseOnHover
           theme="light"
         />
         </>
    );
};

export default ForgotPassword