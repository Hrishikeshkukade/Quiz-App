// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwl3YCptkv95TgkLqGYMLVvfwFG9bU-0c",
  authDomain: "quizapp-c1ad0.firebaseapp.com",
  projectId: "quizapp-c1ad0",
  storageBucket: "quizapp-c1ad0.appspot.com",
  messagingSenderId: "1033043516546",
  appId: "1:1033043516546:web:d5ffb14bd0c6b49122289b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);



// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if false;
//     }
//   }
// }