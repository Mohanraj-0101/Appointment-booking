// firebase.js ✅ bulletproof version

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config
//it is  in local txt file

// Prevent re-initialization during hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
