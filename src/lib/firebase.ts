'use client';

// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1FRq-4hJyn5PUph1-pRljiCHMQm1m0BM",
  authDomain: "rule-app-c5dcc.firebaseapp.com",
  projectId: "rule-app-c5dcc",
  storageBucket: "rule-app-c5dcc.firebasestorage.app",
  messagingSenderId: "434068008906",
  appId: "1:434068008906:web:6c04933830e77a5c152933",
  measurementId: "G-GK2Z7K5LVC"
};


// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const analytics: Analytics | null = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, db, auth, analytics };
