import {
  collection,
  where,
  query,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const deleteQuizData = async (user) => {
  const userUid = user.uid;
  const quizDataCollection = collection(db, 'user_data');

  const userQuizDataQuery = query(
    quizDataCollection,
    where('uid', '==', userUid),
  );
  const querySnapshot = await getDocs(userQuizDataQuery);

  console.log('User:', user);
  console.log('QuerySnapshot size:', querySnapshot.size);

  // Use Promise.all to delete all documents in parallel
  const deletionPromises = querySnapshot.docs.map(async (doc) => {
    console.log('Deleting doc ID:', doc.id);
    await deleteDoc(doc.ref);
  });

  await Promise.all(deletionPromises);
};

export default deleteQuizData;
