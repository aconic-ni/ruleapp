import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// This pattern prevents re-initializing the app on every hot-reload.
// Firebase App Hosting automatically provides the necessary credentials via
// environment variables, so we don't need to pass any config to initializeApp().
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = getFirestore();

export { db };
