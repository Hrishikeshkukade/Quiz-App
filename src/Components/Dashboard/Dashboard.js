import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./DashboardStyles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rules from "../Rules/Rules";
import notify from "../../config/Notify";

import "./Dashboard.css";
import ConfirmationModal from "../../UI/ConfirmationModal/ConfirmationModal";
import Timer from "../Timer/Timer";
import QuizQuestions from "../QuizQuestions/QuizQuestions";

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
  

  const handleAcceptRules = () => {
    setShowRules(false); // Close the rules modal
    setStartQuiz(true); // Start the quiz
    setInitialTime(180);

    setShowConfirmationModal(false);
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
  };

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

  const handleTimeUp = () => {
    handleSubmit(); // Automatically submit the quiz when time is up
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
            <div className="sticky-top" style={{ top: "0", zIndex: "100" }}>
              {startQuiz && (
                <Timer
                  initialTime={initialTime}
                  startQuiz={startQuiz}
                  onTimeUp={handleTimeUp}
                />
              )}
            </div>
            <QuizQuestions
              quizData={quizData}
              userResponses={userResponses}
              handleOptionClick={handleOptionClick}
              onClick={handleConfirmation}
            />

            {/* {userMarks !== null && ( */}
            {showConfirmationModal && (
              <ConfirmationModal
                show={showConfirmationModal}
                onHide={hideConfirmation}
                onConfirm={handleSubmit}
                style={styles.darkModal}
              />
            )}
          </div>
        )}
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
        theme="light"
      />
    </div>
  );
};

export default Dashboard;
