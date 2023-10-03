// UserDataFetcher.js
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, where, getDocs, query, orderBy } from 'firebase/firestore';

const UserDataFetcher = ({ uid, children }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    previousQuizMarks: [],
    userResponses: [],
    questions: [],
    correctAnswer: [],
    userRank: null,
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userName = user.displayName;
        const userEmail = user.email;

        // Fetch user data when authentication changes
        fetchUserData(user.uid, userName, userEmail);
      }
    });
  }, []);

  const fetchUserData = async (uid, userName, userEmail) => {
    try {
      // Query the Firestore collection for user data
      const userQuery = query(collection(db, 'user_data'), where('uid', '==', uid));

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
      const allUsersQuery = query(collection(db, 'user_data'), orderBy('marks', 'desc'));
      const allUsersSnapshot = await getDocs(allUsersQuery);
      const allUserMarks = allUsersSnapshot.docs.map((doc) => doc.data().marks);

      // Calculate user rank
      const userRank = allUserMarks.indexOf(userMarks[0]) - 1;

      setUserData({
        name: userName,
        email: userEmail,
        previousQuizMarks: userMarks,
        userResponses: userResponses,
        questions: questions,
        correctAnswer: correctAnswer,
        userRank: userRank,
      });
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  return children(userData);
};

export default UserDataFetcher;


