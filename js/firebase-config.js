// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9TwtGcDQJrJgYlcpUmtggJxvcF6MTlCk",
  authDomain: "showmegrowinfo.firebaseapp.com",
  databaseURL: "https://showmegrowinfo-default-rtdb.firebaseio.com",
  projectId: "showmegrowinfo",
  storageBucket: "showmegrowinfo.firebasestorage.app",
  messagingSenderId: "317414799927",
  appId: "1:317414799927:web:81a6a76b52511bbad51db2"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
