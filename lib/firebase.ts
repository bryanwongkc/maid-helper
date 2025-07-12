// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIVEJkwpW84fW96vDEWuIRl9e8De3IcNA",
  authDomain: "maid-helper.firebaseapp.com",
  projectId: "maid-helper",
  storageBucket: "maid-helper.firebasestorage.app",
  messagingSenderId: "894423505564",
  appId: "1:894423505564:web:44b217e8fef0c260886b59",
  measurementId: "G-33SY2KLWCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);