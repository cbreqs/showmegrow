// Replace with your Firebase project config from Firebase Console > Project settings > General
// For security, allow only email writes in Firestore with appropriate security rules.
export let isConfigured = false;

export let firebaseApp = null;
export let db = null;

try {
  const config = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  if (!Object.values(config).some(v => String(v).startsWith('YOUR_'))) {
    firebaseApp = firebase.initializeApp(config);
    db = firebase.firestore();
    isConfigured = true;
  }
} catch (e) {
  console.warn('Firebase not available until deployed with config.', e);
}