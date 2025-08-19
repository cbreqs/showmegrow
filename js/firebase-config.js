// js/firebase-config.js  (compat style, matches your index setup)
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

  // requires these script tags in index.html (compat):
  // <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
  // <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>

  firebaseApp = firebase.initializeApp(config);
  db = firebase.firestore();
  isConfigured = true;
} catch (e) {
  console.warn("Firebase init error:", e);
}
