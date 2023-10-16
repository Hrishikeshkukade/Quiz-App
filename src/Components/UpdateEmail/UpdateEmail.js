import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { updateEmail, getAuth, sendEmailVerification } from 'firebase/auth';
import classes from './UpdateEmail.module.css';
import notify from '../../config/Notify';
import { ToastContainer } from 'react-toastify';
import debounce from 'lodash/debounce';

const UpdateEmail = () => {
  const auth = getAuth();
  const [newEmail, setNewEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const user = auth.currentUser;

  const validateEmail = (email) => {
    // Use a regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (isValidEmail) {
      try {
        // Update the user's email address
        await updateEmail(user, newEmail);

        // Send a verification email to the new email address
        await sendEmailVerification(user);

        // Handle success or navigate to another page
        notify('Email verification link is sent successfully.');
      } catch (error) {
        // Handle errors (e.g., invalid email, user is not signed in)
        console.error(error);
      }
    }
  };

  const debouncedEmailValidation = debounce((email) => {
    setIsValidEmail(validateEmail(email));
  }, 1000); // Adjust the debounce delay as needed

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setNewEmail(email);
    debouncedEmailValidation(email);
  };

  return (
    <>
      <Form onSubmit={handleUpdateEmail} className={classes.formContainer}>
        <Form.Group className="mb-3">
          <Form.Label>Current Email Address</Form.Label>
          <Form.Control
            className={classes.darkInput}
            type="email"
            value={user.email}
            disabled
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Email Address</Form.Label>
          <Form.Control
            type="email"
            value={newEmail}
            onChange={handleEmailChange}
            required
            className={`${classes.darkInput} ${
              isValidEmail ? '' : 'is-invalid'
            }`}
          />
          <div className="invalid-feedback">
            Please enter a valid email address.
          </div>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={!isValidEmail}>
          Verify
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

export default UpdateEmail;
