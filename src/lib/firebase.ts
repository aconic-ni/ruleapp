// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// In a real app, you should store this in environment variables for security.
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
// This pattern prevents re-initializing the app on hot-reloads.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Initialize Analytics if running in the browser
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, db, analytics };
