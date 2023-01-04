import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKBjUr8DQZa8EBxuBBFyK-gIfhLEVT97E",
  authDomain: "curso-9a438.firebaseapp.com",
  projectId: "curso-9a438",
  storageBucket: "curso-9a438.appspot.com",
  messagingSenderId: "452540395205",
  appId: "1:452540395205:web:001a1a2f8c367e4af38aac",
  measurementId: "G-H7KW7KWGEB",
};

const firebaseapp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseapp);
const auth = getAuth(firebaseapp);

export { db, auth };
