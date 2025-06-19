// firebase.js ✅ bulletproof version

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCVYqjpqlUcBsIjc7LzTDUFRK0l7mnRGLw",
  authDomain: "appointment-booking-af98f.firebaseapp.com",
  projectId: "appointment-booking-af98f",
  storageBucket: "appointment-booking-af98f.appspot.com",
  messagingSenderId: "203593465418",
  appId: "1:203593465418:web:b5809c5d1eabbaef80b0b3"
};

// Prevent re-initialization during hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
