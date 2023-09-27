import React, { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, where, getDocs, query, orderBy } from "firebase/firestore";
import { jsPDF } from "jspdf";
import classes from "./Profile.module.css";
import notify from "../../config/Notify";
import { ToastContainer } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [previousQuizMarks, setPreviousQuizMarks] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userName = user.displayName;
        const userEmail = user.email;
        const uid = user.uid;
        setName(userName);
        setEmail(userEmail);
        setUid(uid);
  
        // Fetch user data when authentication changes
        fetchUserData(uid);
      }
    });
  
    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array to run this effect only once
  

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Query the Firestore collection for user data
      const userQuery = query(
        collection(db, "user_data"),
        where("uid", "==", uid)
      );

      // Get the documents that match the query
      const querySnapshot = await getDocs(userQuery);

      // Extract the marks and responses from the documents
      const userMarks = [];
      const userResponses = [];
      const questions = [];
      const correctAnswer = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userMarks.push(userData.marks);
        questions.push(userData.questionsWithAnswers);
        correctAnswer.push(userData.questionsWithAnswers);
        userResponses.push(userData.questionsWithAnswers);
      });
      const allUsersQuery = query(
        collection(db, "user_data"),
        orderBy("marks", "desc")
      );
      const allUsersSnapshot = await getDocs(allUsersQuery);
      const allUserMarks = allUsersSnapshot.docs.map((doc) => doc.data().marks);

      // Calculate user rank
      const userRank = allUserMarks.indexOf(userMarks[0]) - 1;
      setUserRank(userRank);

      // Update the state with the user's previous quiz marks and responses
      setPreviousQuizMarks(userMarks);
      setUserResponses(userResponses);
      setQuestions(questions);
      setCorrectAnswer(correctAnswer);
    } catch (error) {
      console.error("Error fetching user data: ", error);
      notify("Error fetching previous quiz marks", true);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const generateQuizPDF = async (quizIndex) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    let yPos = 20;

    // Add quiz title
    doc.text(`Quiz ${quizIndex + 1} Results`, 10, 10);
    yPos += 10;
    // Add user's answers and correct answers
    const userAnswers = userResponses[quizIndex];
    const quizQuestions = questions[quizIndex];
    const correctAnswers = correctAnswer[quizIndex];

    quizQuestions.forEach((question, i) => {
      doc.text(`Question ${i + 1}:`, 10, yPos);
      yPos += 10;
      doc.text(`Question: ${question.question}`, 20, yPos);
      yPos += 10;
      doc.text(`Your Answer: ${userAnswers[i].userResponse}`, 20, yPos);
      yPos += 10;
      doc.text(`Correct Answer: ${correctAnswers[i].correctAnswer}`, 20, yPos);
      yPos += 15; // Add some spacing between questions
    });

    // Save the PDF with a unique filename
    doc.save(`Quiz_${quizIndex + 1}_Results.pdf`);
  };

  return (
    <>
      <Card  border="warning" className={classes.container}>
        <Card.Body>
          <Card.Title>Name</Card.Title>
          <Card.Text>{name}</Card.Text>
          <Card.Title>Email</Card.Title>
          <Card.Text>{email}</Card.Text>
          {/* {userRank !== null && (
            <>
              <Card.Title>Your Rank</Card.Title>
              <Card.Text>Rank: {userRank}</Card.Text>
            </>
          )} */}
          <Card.Title>Previous Quiz Marks</Card.Title>
          <Card.Text>
          { previousQuizMarks.length === 0 ? (
              <p>No quiz attended</p>
            ) : (
              <ul>
                {previousQuizMarks.map((marks, index) => (
                  <li className={classes.result} key={index}>
                    Quiz {index + 1}: {marks}
                    <Button
                      variant="secondary"
                      onClick={() => generateQuizPDF(index)}
                    >
                      Download PDF
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
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
        theme={theme === "dark" ? "dark" : "light"}
      />
    </>
  );
};

export default Profile;
