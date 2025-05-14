// js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCR6nCfeYFrkv6oTiEdORfqdGvzK_6G_60",
  authDomain: "nutritrack-v2.firebaseapp.com",
  projectId: "nutritrack-v2",
  storageBucket: "nutritrack-v2.appspot.com",
  messagingSenderId: "480529382915",
  appId: "1:480529382915:web:56704a22550d5b13909836",
  measurementId: "G-07KD79ZW41"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };