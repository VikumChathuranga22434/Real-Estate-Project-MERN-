// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-e9ac8.firebaseapp.com",
  projectId: "mern-estate-e9ac8",
  storageBucket: "mern-estate-e9ac8.appspot.com",
  messagingSenderId: "696199174379",
  appId: "1:696199174379:web:120e76549a3f8ae89e06ae"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);