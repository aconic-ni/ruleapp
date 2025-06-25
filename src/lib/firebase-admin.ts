import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// This pattern prevents re-initializing the app on every hot-reload.
// Firebase App Hosting automatically provides the necessary credentials via
// environment variables, but explicitly providing the projectId can resolve 
// some environment-specific auth issues.
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'rule-app-c5dcc',
  });
}

const db = getFirestore();

export { db };
