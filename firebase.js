// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8m74uf4SRn5tbcXkLEdg84ryfH-W_hoM",
  authDomain: "flashcards-bb055.firebaseapp.com",
  projectId: "flashcards-bb055",
  storageBucket: "flashcards-bb055.appspot.com",
  messagingSenderId: "907322778808",
  appId: "1:907322778808:web:d530b17f3842fd3c11804d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}