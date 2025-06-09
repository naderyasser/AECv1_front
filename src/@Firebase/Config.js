// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  GoogleAuthProvider,
  getAuth,
  FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVqILfN1q25W9O529-H-vMN3_gH0-sI5k",
  authDomain: "markets-system.firebaseapp.com",
  projectId: "markets-system",
  storageBucket: "markets-system.appspot.com",
  messagingSenderId: "497181616396",
  appId: "1:497181616396:web:f599c6d61ba388db7c4129",
  measurementId: "G-YKVE0KJP9L",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();
export const facebookAuth = new FacebookAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
