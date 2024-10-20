// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7Jv17dmnHgkknreTTa9zl5-74T6veaaE",
  authDomain: "buybusy1-229de.firebaseapp.com",
  projectId: "buybusy1-229de",
  storageBucket: "buybusy1-229de.appspot.com",
  messagingSenderId: "176015827092",
  appId: "1:176015827092:web:55b5e89b41046b27921481",
  measurementId: "G-7HPV3G3VHN"
};

// Initialize Firebase
export const FirbaseAuth = initializeApp(firebaseConfig);
const analytics = getAnalytics(FirbaseAuth);