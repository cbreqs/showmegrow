// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9TwtGcDQJrJgYlcpUmtggJxvcF6MTlCk",
  authDomain: "showmegrowinfo.firebaseapp.com",
  projectId: "showmegrowinfo",
  storageBucket: "showmegrowinfo.appspot.com"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
