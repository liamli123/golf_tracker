import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addRound = async (roundData) => {
  try {
    const docRef = await addDoc(collection(db, 'rounds'), {
      ...roundData,
      date: Timestamp.fromDate(new Date(roundData.date)),
      created_at: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding round:', error);
    return { success: false, error: error.message };
  }
};

export const getRounds = async () => {
  try {
    const q = query(collection(db, 'rounds'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const rounds = [];
    querySnapshot.forEach((doc) => {
      rounds.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        created_at: doc.data().created_at.toDate()
      });
    });
    return { success: true, data: rounds };
  } catch (error) {
    console.error('Error getting rounds:', error);
    return { success: false, error: error.message };
  }
};

export const deleteRound = async (roundId) => {
  try {
    await deleteDoc(doc(db, 'rounds', roundId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting round:', error);
    return { success: false, error: error.message };
  }
};

export const updateRound = async (roundId, data) => {
  try {
    const roundRef = doc(db, 'rounds', roundId);
    const updateData = { ...data };
    if (data.date) {
      updateData.date = Timestamp.fromDate(new Date(data.date));
    }
    await updateDoc(roundRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating round:', error);
    return { success: false, error: error.message };
  }
};

export { db };
