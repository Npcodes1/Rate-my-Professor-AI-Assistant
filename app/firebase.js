// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'; // Ensure this import is correct

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKiLzIKjbflUbvD84ktSbSbCzm65iSokY",
  authDomain: "rate-my-professor-8d155.firebaseapp.com",
  projectId: "rate-my-professor-8d155",
  storageBucket: "rate-my-professor-8d155.appspot.com",
  messagingSenderId: "953220179905",
  appId: "1:953220179905:web:fc26c88bdb9cfb9ae2f140",
  measurementId: "G-M9K17WR7SL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth };
