import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { getAuth } from 'firebase/auth';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: "AIzaSyAFG5D0fCyDJj3zFBkuOxPmbhcEBB9E_cA",
  authDomain: "buybusy2-be5d4.firebaseapp.com",
  projectId: "buybusy2-be5d4",
  storageBucket: "buybusy2-be5d4.appspot.com",
  messagingSenderId: "364521705169",
  appId: "1:364521705169:web:7cda0f16b5840c99b47ff0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

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