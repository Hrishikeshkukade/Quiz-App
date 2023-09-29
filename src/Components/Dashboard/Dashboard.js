import React, { useEffect, useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./DashboardStyles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rules from "../Rules";
import notify from "../../config/Notify";
import { useTheme } from "../../context/ThemeContext";
import "./Dashboard.css";

const Dashboard = () => {
  const [quizData, setQuizData] = useState([]);
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [startQuiz, setStartQuiz] = useState(false);
  const [userResponses, setUserResponses] = useState([]);
  const [userMarks, setUserMarks] = useState(null); // State for user marks
  const [showRules, setShowRules] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [initialTime, setInitialTime] = useState(180);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // const [correctAnswers, setCorrectAnswers] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme(); 

  const handleAcceptRules = () => {
    setShowRules(false); // Close the rules modal
    setStartQuiz(true); // Start the quiz
    setInitialTime(180);
    startTimer();
    setShowConfirmationModal(false)
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    setTimeout(() => {
      if (startQuiz) {
        clearInterval(timer);
        handleSubmit(); // Automatically submit the quiz when time is up
      }
    }, initialTime * 1000); // 3 minutes in milliseconds
    setTimerInterval(timer);
  };
  const stopTimer = () => {
    clearInterval(timerInterval); // Clear the interval to stop the timer
    setTimeLeft(initialTime);
  };
  const startQuizHandler = () => {
    setShowRules(true);
  };

  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      navigate("/dashboard");
    };

    if (location.pathname === "/dashboard") {
      window.history.pushState(null, "", "/dashboard");
      window.addEventListener("popstate", handleBackButton);
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [location, navigate]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userName = user.displayName;
        const uid = user.uid;
        setUid(uid);
        setName(userName);
      }
    });
  });
  const fetchApiData = async () => {
    try {
      const res = await fetch(
        "https://opentdb.com/api.php?amount=6&category=18&difficulty=medium"
      );
      const data = await res.json();
      const quizQuestions = data.results.map((question) => {
        const correctIndex = Math.floor(Math.random() * 4); // Randomly select an index for the correct answer
        question.incorrect_answers.splice(
          correctIndex,
          0,
          question.correct_answer
        ); // Insert the correct answer at the randomly selected index
        return question;
      });
      setQuizData(quizQuestions);
    } catch (error) {
      console.log(error);
      notify("An error occured while fetching questions", true);
    }
  };

  useEffect(() => {
    if (startQuiz) {
      fetchApiData();
    }
  }, [startQuiz]);

  const handleOptionClick = (questionIndex, option) => {
    const updatedResponses = [...userResponses];
    updatedResponses[questionIndex] = option;
    setUserResponses(updatedResponses);
  };

  const handleConfirmation = () => {
    setShowConfirmationModal(true);
  };
  const hideConfirmation = () => {
    setShowConfirmationModal(false);
  }

  const handleSubmit = async () => {
    // Calculate user marks
    let marks = 0;
    for (let i = 0; i < quizData.length; i++) {
      const question = quizData[i];
      const userResponse = userResponses[i];
      // setCorrectAnswers(question.correct_answer);
      if (userResponse === question.correct_answer) {
        marks++;
      }
    }
    // Set user marks in state

    setUserMarks(marks);
    setStartQuiz(false);
    setTimeLeft(initialTime);
    stopTimer();

    // Prepare user data to submit

    const userData = {
      marks: marks,
      questionsWithAnswers: quizData.map((question, index) => ({
        question: question.question,
        correctAnswer: question.correct_answer,
        userResponse: userResponses[index], // Add user's response
      })),
      uid: uid,
    };

    try {
      // Add user data to Firestore
      const docRef = await addDoc(collection(db, "user_data"), userData);
      console.log("User data submitted with ID: ", docRef.id);
      // setShowResultModal(true);
      notify("Test is submitted successfully", false);
    } catch (error) {
      console.error("Error submitting user data: ", error);
      notify("An error occurred while submitting user data", true);
      // showErrorToast("An error occurred while submitting user data");
    }
  };

  return (
    <div>
      <div>
        <h1 style={styles.heading} className="mt-4">
          Welcome to the Dashboard, {name}
        </h1>

        {/* {!startQuiz && (
          <Button
            variant="primary"
            style={styles.button2}
            onClick={() => setShowRules(true)}
          >
            View Rules
          </Button>
        )} */}
        {/* Display the rules modal */}
        <Rules
          show={showRules}
          onHide={() => setShowRules(false)}
          onAccept={handleAcceptRules}
        />
        {!startQuiz ? (
          <Button
            variant="primary"
            style={styles.button2}
            onClick={startQuizHandler}
          >
            Start Quiz
          </Button>
        ) : (
          <div>
            {quizData.length === 0 ? (
              <p>Loading questions...</p>
            ) : (
              <div>
                <div className="sticky-top" style={{ top: "0", zIndex: "100" }}>
                  {startQuiz && (
                    <div style={styles.button2}>
                      <p style={styles.timeDisplay}>
                        Time Left: {timeLeft} seconds
                      </p>
                    </div>
                  )}
                </div>
                {quizData.map((question, questionIndex) => (
                  <Card style={styles.card}  key={questionIndex} className="mt-3">
                    <Card.Body>
                      <Card.Title>Question {questionIndex + 1}</Card.Title>
                      <Card.Text>{question.question}</Card.Text>
                      <ul  className="list-group">
                        {question.incorrect_answers.map(
                          (option, optionIndex) => (
                            <li
                            style={styles.card}
                              key={optionIndex}
                              className={
                                userResponses[questionIndex] === option
                                  ? "list-group-item list-group-item-success"
                                  : "list-group-item"
                              }
                              onClick={() =>
                                handleOptionClick(questionIndex, option)
                              }
                            >
                              {option}
                            </li>
                          )
                        )}
                      </ul>
                    </Card.Body>
                  </Card>
                ))}
                <Button
                  variant="success"
                  className="mt-3"
                  style={styles.button1}
                  onClick={handleConfirmation}
                >
                  Submit
                </Button>
                {/* {userMarks !== null && ( */}
                {showConfirmationModal && (
                  <Modal  show={showConfirmationModal} onHide={hideConfirmation}>
                    <div style={styles.darkModal}>

                   
                    <Modal.Header closeButton>
                      <Modal.Title>Confirm Submission</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure you want to submit the quiz?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={hideConfirmation}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleSubmit}>
                        Yes, Submit
                      </Button>
                    </Modal.Footer>
                    </div>
                  </Modal>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* {startQuiz ?  <div style={styles.button2}>
        <p>Time Left: {timeLeft} seconds</p>
      </div> : null} */}
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
    </div>
  );
};

export default Dashboard;
