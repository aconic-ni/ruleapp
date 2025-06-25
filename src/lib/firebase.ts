'use client';

// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";

// Use environment variables for Firebase config for security and flexibility.
// These variables must be prefixed with NEXT_PUBLIC_ to be exposed to the browser.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
// This pattern prevents re-initializing the app on hot-reloads,
// and ensures it only runs on the client side.
// If the config is not available, Firebase services will be null.
const app: FirebaseApp | null = typeof window !== 'undefined' && firebaseConfig.apiKey
    ? !getApps().length ? initializeApp(firebaseConfig) : getApp()
    : null;

const db: Firestore | null = app ? getFirestore(app) : null;
const auth: Auth | null = app ? getAuth(app) : null;
const analytics: Analytics | null = app && typeof window !== 'undefined' ? getAnalytics(app) : null;

if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
    console.warn("Firebase API key is missing. The app will run in a limited state. Please make sure NEXT_PUBLIC_FIREBASE_* environment variables are set.");
}

export { app, db, auth, analytics };
