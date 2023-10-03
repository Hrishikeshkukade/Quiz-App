// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgzjquPEZNb1TL0YMOGXfttIkPAD0fkCc",
  authDomain: "quizapp-789e1.firebaseapp.com",
  projectId: "quizapp-789e1",
  storageBucket: "quizapp-789e1.appspot.com",
  messagingSenderId: "731878429350",
  appId: "1:731878429350:web:43c68d85bc15660b831a67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
