import React, { useEffect, useState, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from '../../firebase';
import {
  collection,
  where,
  getDocs,
  query,
  orderBy,
  doc,
  setDoc,
} from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { jsPDF } from 'jspdf';
import classes from './Profile.module.css';
import notify from '../../config/Notify';
import { ToastContainer } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    uid: '',
    previousQuizMarks: [],
    userResponses: [],
    questions: [],
    correctAnswer: [],
    userRank: null,
    profilePicture: null,
  });
  const { name, email, uid, previousQuizMarks, userResponses, questions, correctAnswer, userRank, profilePicture } = userData;
  const theme = useTheme();
  const profilePictureInputRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userName = user.displayName;
        const userEmail = user.email;
        const uid = user.uid;

        // Fetch user data when authentication changes
        fetchUserData(uid);

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        const profilePictureURL = userData?.profilePicture || null;
        setUserData({
          name: userName,
          email: userEmail,
          uid: uid,
          previousQuizMarks: previousQuizMarks,
          userResponses: userResponses,
          questions: questions,
          correctAnswer: correctAnswer,
          userRank: userRank,
          profilePicture: profilePictureURL,
        });
      }
    });
  },);

  const fetchUserData = async () => {
    try {
      // Query the Firestore collection for user data
      const userQuery = query(
        collection(db, 'user_data'),
        where('uid', '==', uid),
      );

      // Get the documents that match the query
      const querySnapshot = await getDocs(userQuery);

      // Extract the marks and responses from the documents
      const userMarks = [];
      const userResponsesData = [];
      const questionsData = [];
      const correctAnswerData = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userMarks.push(userData.marks);
        questionsData.push(userData.questionsWithAnswers);
        correctAnswerData.push(userData.questionsWithAnswers);
        userResponsesData.push(userData.questionsWithAnswers);
      });
      const allUsersQuery = query(
        collection(db, 'user_data'),
        orderBy('marks', 'desc'),
      );
      const allUsersSnapshot = await getDocs(allUsersQuery);
      const allUserMarks = allUsersSnapshot.docs.map((doc) => doc.data().marks);

      // Calculate user rank
      const userRank = allUserMarks.indexOf(userMarks[0]) - 1;

      setUserData({
        ...userData,
        previousQuizMarks: userMarks,
        userResponses: userResponsesData,
        questions: questionsData,
        correctAnswer: correctAnswerData,
        userRank: userRank,
      });
    } catch (error) {
      console.error('Error fetching user data: ', error);
      notify('Error fetching previous quiz marks', true);
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

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profilePictures/${uid}/${file.name}`);

      try {
        // Upload the profile picture to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Store the profile picture URL in Firestore
        const userDocRef = doc(db, 'users', uid); // 'users' is the Firestore collection name
        await setDoc(
          userDocRef,
          { profilePicture: downloadURL },
          { merge: true },
        );

        // Set the profilePicture state with the URL of the uploaded image
        setUserData({
          ...userData,
          profilePicture: downloadURL,
        });
      } catch (error) {
        console.error('Error uploading profile picture: ', error);
        notify('Error uploading profile picture', true);
      }
    }
  };

  const handleProfilePictureClick = () => {
    // Trigger a click event on the hidden input field
    profilePictureInputRef.current.click();
  };

  return (
    <>
      <Card className={classes.container}>
        <div onClick={handleProfilePictureClick} className={classes.profilePicture}>
          <img
            src={profilePicture || '/blank.jpg'}
            alt="Profile"
            className={classes.profileImage}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            ref={profilePictureInputRef}
            className={classes.profileImageInput}
          />
        </div>
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
            {previousQuizMarks.length === 0 ? (
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
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </>
  );
};

export default Profile;

