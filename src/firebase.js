import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // استبدلها بمفتاح الـ apiKey الخاص بك
  authDomain: "whatchtoearn-85f39.firebaseapp.com",
  projectId: "whatchtoearn-85f39",
  storageBucket: "whatchtoearn-85f39.firebasestorage.app",
  messagingSenderId: "64563915590",
  appId: "1:64563915590:web:963d412b527cebc...",
  measurementId: "G-1B9HEPMJ5P"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
