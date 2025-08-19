// Replace with your Firebase project config from Firebase Console > Project settings > General
// For security, allow only email writes in Firestore with appropriate security rules.
export let isConfigured = false;

export let firebaseApp = null;
export let db = null;

try {
   const config = {
    apiKey: "AIzaSyB9TwtGcDQJrJgYlcpUmtggJxvcF6MTlCk",
    authDomain: "showmegrowinfo.firebaseapp.com",
    databaseURL: "https://showmegrowinfo-default-rtdb.firebaseio.com",
    projectId: "showmegrowinfo",
    storageBucket: "showmegrowinfo.firebasestorage.app",
    messagingSenderId: "317414799927",
    appId: "1:317414799927:web:81a6a76b52511bbad51db2"
  };
  if (!Object.values(config).some(v => String(v).startsWith('YOUR_'))) {
    firebaseApp = firebase.initializeApp(config);
    db = firebase.firestore();
    isConfigured = true;
  }
} catch (e) {
  console.warn('Firebase not available until deployed with config.', e);
}