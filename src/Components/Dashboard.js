import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Modal } from "react-bootstrap";

import Rules from "./Rules";

const Dashboard = () => {
  const styles = {
    button1: {
      marginLeft: "37%",
      justifyContent: "center",
    },
    button2:{
      justifyContent: "center",
      marginLeft: "10%",
      margin: "20px"
    },
    heading: {
      marginLeft: "20px",
    },
  };

  const [quizData, setQuizData] = useState([]);
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [startQuiz, setStartQuiz] = useState(false);
  const [userResponses, setUserResponses] = useState([]);
  const [userMarks, setUserMarks] = useState(null); // State for user marks
  const [showRules, setShowRules] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180);
  const [initialTime, setInitialTime] = useState(180);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  // const [correctAnswers, setCorrectAnswers] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAcceptRules = () => {
    setShowRules(false); // Close the rules modal
    setStartQuiz(true); // Start the quiz
    setInitialTime(180);
    startTimer();
    setShowResultModal(false);
  };
  const handleShowResultModal = () => {
    setShowResultModal(true);
  };
  // const handleStartQuiz = () => {
  //   setShowRules(false); // Close the rules modal
  //   setStartQuiz(true); // Start the quiz
  //   setInitialTime(180);
  //   startTimer();
  // };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    setTimeout(() => {
      if(startQuiz){
        clearInterval(timer);
        handleSubmit(); // Automatically submit the quiz when time is up
      }
    
    }, initialTime * 1000); // 3 minutes in milliseconds
    setTimerInterval(timer);
  };
  const stopTimer = () => {
    clearInterval(timerInterval); // Clear the interval to stop the timer
    setTimeLeft(initialTime)
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

  // const fetchApiData = async () => {
  //   try {
  //     const res = await fetch("https://opentdb.com/api.php?amount=10");
  //     const data = await res.json();
  //     setQuizData(data.results);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
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
      const res = await fetch("https://opentdb.com/api.php?amount=6");
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
      console.log(error.message);
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
    handleShowResultModal();
    // const questionsWithAnswers = quizData.map((question, index) => ({
    //   question: question.question,
    //   correctAnswer: question.correct_answer,
    //   userResponse: userResponses[index], // Add user's response
    // }));

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
    // if (timeLeft > 0) {
    //   handleShowResultModal(); // Show the result modal
    //   const userData = {
    //     marks: marks,
    //     questionsWithAnswers: quizData.map((question, index) => ({
    //       question: question.question,
    //       correctAnswer: question.correct_answer,
    //       userResponse: userResponses[index],
    //     })),
    //     uid: uid,
    //   };
    // }
    // const userData = {
    //   marks: marks,

    //   // responses: userResponses,
    //   questionsWithAnswers: questionsWithAnswers,
    //   uid: uid,
    // };

    try {
      // Add user data to Firestore
      const docRef = await addDoc(collection(db, "user_data"), userData);
      console.log("User data submitted with ID: ", docRef.id);
    
    } catch (error) {
      console.error("Error submitting user data: ", error);
    }
  };

  return (
    <div>
      <div>
        <h1 style={styles.heading} className="mt-4">
          Welcome to the Dashboard, {name}
        </h1>
        {!startQuiz && (
          <Button
            variant="primary"
            style={styles.button2}
            onClick={() => setShowRules(true)}
          >
            View Rules
          </Button>
        )}
        {/* Display the rules modal */}
        <Rules
          show={showRules}
          onHide={() => setShowRules(false)}
          onAccept={handleAcceptRules}
        />
        {!startQuiz ? (
          <Button
            variant="primary"
           
            onClick={handleAcceptRules}
          >
            Start Quiz
          </Button>
        ) : (
          <div>
            {quizData.length === 0 ? (
              <p>Loading questions...</p>
            ) : (
              <div>
                {quizData.map((question, questionIndex) => (
                  <Card key={questionIndex} className="mt-3">
                    <Card.Body>
                      <Card.Title>Question {questionIndex + 1}</Card.Title>
                      <Card.Text>{question.question}</Card.Text>
                      <ul className="list-group">
                        {question.incorrect_answers.map(
                          (option, optionIndex) => (
                            <li
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

                        {/* <li
                          key="correct"
                          className={
                            userResponses[questionIndex] === question.correct_answer
                              ? "list-group-item list-group-item-success"
                              : "list-group-item list-group-item"
                          }
                         
                        >
                          {question.correct_answer}
                        </li> */}
                      </ul>
                    </Card.Body>
                  </Card>
                ))}
                <Button
                  variant="success"
                  className="mt-3"
                  style={styles.button1}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                {userMarks !== null && (
                    <Modal
                    show={showResultModal}
                    onHide={() => setShowResultModal(false)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Your Quiz Result</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>
                        You scored {userMarks} out of {quizData.length}
                      </p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="primary"
                        onClick={() => setShowResultModal(false)}
                      >
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                )} 
              
                {/* {userMarks !== null && (
                  <p className="mt-3">
                    You scored {userMarks} out of {quizData.length}
                  </p>
                )} */}
              </div>
            )}
          </div>
        )}
      </div>
      <div style={styles.button2}>
        <p>Time Left: {timeLeft} seconds</p>
      </div>
    </div>
  );
};

export default Dashboard;
