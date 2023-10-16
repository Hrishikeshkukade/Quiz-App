import React, {useState} from "react";
import { Button, Spinner } from "react-bootstrap";
import classes from "./Settings.module.css";
import "../../config/styles.css";

import DarkTheme from "../DarkTheme/DarkTheme";

import notify from "../../config/Notify";
import { ToastContainer } from "react-toastify";
import deleteQuizData from "../../api/deleteQuizData";
import getCurrentUser from "../../api/getCurrentUser";

const Settings = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteQuizData = async () => {
    try {
      setIsDeleting(true);
      const user = getCurrentUser();

      if (user) {
        // User is signed in
        await deleteQuizData(user);
        notify('Quiz data deleted successfully.');
      } else {
        // No user signed in
        console.log('No user signed in');
      }
    } catch (error) {
      console.error('Error deleting quiz data:', error);
      notify('Error deleting quiz data', true);
    } finally {
      setIsDeleting(false); // Set loading state back to false
    }
  };

  return (
    <div className={classes.container}>
      <h2>Settings</h2>
      <div>
        <h3>Theme Options</h3>
        <label htmlFor="themeSelect">Select Theme:</label>
        <DarkTheme />
      </div>
      <div>
        <h3>Delete Quiz Data</h3>
        <p>Click the button below to delete all your quiz data.</p>
        <Button variant="danger" onClick={handleDeleteQuizData} disabled={isDeleting}>
          {isDeleting ? (
            <>
              <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
              Deleting...
            </>
          ) : (
            "Delete Quiz Data"
          )}
        </Button>
      </div>
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
        theme='light'
      />
    </div>
  );
};

export default Settings;


