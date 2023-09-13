import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, where, getDocs, query, orderBy } from "firebase/firestore";
import { jsPDF } from "jspdf";


const Profile = () => {
  const styles = {
    container: {
      width: "50%",
      display: "flex",
      justifyContent: "center",
      marginLeft: "100px",
      marginTop: "50px",
    },
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [previousQuizMarks, setPreviousQuizMarks] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
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
  });

  const fetchUserData = async () => {
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
      const allUsersQuery = query(collection(db, "user_data"), orderBy("marks", "desc"));
      const allUsersSnapshot = await getDocs(allUsersQuery);
      const allUserMarks = allUsersSnapshot.docs.map((doc) => doc.data().marks);

      // Calculate user rank
      const userRank = allUserMarks.indexOf(userMarks[0]) + 1;
      setUserRank(userRank);

      // Update the state with the user's previous quiz marks and responses
      setPreviousQuizMarks(userMarks);
      setUserResponses(userResponses);
      setQuestions(questions);
      setCorrectAnswer(correctAnswer);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  // const fetchCorrectAnswersFromAPI = async (quizIndex) => {
  //   try {
  //     // Make an API request to fetch correct answers based on the quiz index
  //     const response = await fetch(`api.php/${quizIndex}`);
  //     const data = await response.json();

  //     // Extract the correct answers from the API response
  //     const correctAnswers = data.correct_answers;

  //     return correctAnswers;
  //   } catch (error) {
  //     console.error("Error fetching correct answers from the API: ", error);
  //     return [];
  //   }
  // };

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

    // const correctAnswers = quizData[quizIndex].correct_answers;
    // const correctAnswers = await fetchCorrectAnswersFromAPI(quizIndex);

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

    // userAnswers.forEach((userAnswer, i) => {
    //   doc.text(`Question ${i + 1}:`, 10, yPos);
    //   yPos += 10;
    //   doc.text(`Your Answer: ${userAnswer.userResponse}`, 20, yPos);
    //   yPos += 15; // Add some spacing between questions
    // });

    // Loop through the questions and add user's answers and correct answers
    // for (let i = 0; i < userAnswers.length; i++) {
    //   doc.text(`Question ${i + 1}:`, 10, 20 + i * yPos);
    //   doc.text(`Your Answer: ${userAnswers[i]}`, 20, 30 + i * yPos);
    //   doc.text(`Correct Answer: ${correctAnswers[i]}`, 20, 40 + i * yPos);
    // }

    // Save the PDF with a unique filename
    doc.save(`Quiz_${quizIndex + 1}_Results.pdf`);
  };

  return (
    <>
      <Card border="warning" style={styles.container}>
        <Card.Body>
          <Card.Title>Name</Card.Title>
          <Card.Text>{name}</Card.Text>
          <Card.Title>Email</Card.Title>
          <Card.Text>{email}</Card.Text>
          {userRank !== null && 
          <>
            <Card.Title>Your Rank</Card.Title>
            <Card.Text>Rank: {userRank}</Card.Text>
          </>
          }
          <Card.Title>Previous Quiz Marks</Card.Title>
          <Card.Text>
            {previousQuizMarks.length === 0 ? (
              <p>No quiz attended</p>
            ) : (
              <ul>
                {previousQuizMarks.map((marks, index) => (
                  <li key={index}>
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
    </>
  );
};

export default Profile;
