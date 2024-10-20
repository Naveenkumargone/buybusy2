import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7Jv17dmnHgkknreTTa9zl5-74T6veaaE",
  authDomain: "buybusy1-229de.firebaseapp.com",
  projectId: "buybusy1-229de",
  storageBucket: "buybusy1-229de.appspot.com",
  messagingSenderId: "176015827092",
  appId: "1:176015827092:web:55b5e89b41046b27921481",
  measurementId: "G-7HPV3G3VHN",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();