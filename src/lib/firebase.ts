import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHK0-hnAlIuOjsTwYcJj_ZLJCBUpA8En0",
  authDomain: "laniedu-strategy.firebaseapp.com",
  projectId: "laniedu-strategy",
  storageBucket: "laniedu-strategy.firebasestorage.app",
  messagingSenderId: "986653692176",
  appId: "1:986653692176:web:543c60d5154239d4e01595",
  measurementId: "G-21L75E3S54"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
