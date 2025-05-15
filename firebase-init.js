// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// ← Replace these values with your actual Firebase project config:
const firebaseConfig = {
  apiKey: "AIzaSyCR6nCfeYFrkv6oTiEdORfqdGvzK_6G_60",
  authDomain: "nutritrack-v2.firebaseapp.com",
  projectId: "nutritrack-v2",
  storageBucket: "nutritrack-v2.appspot.com",
  messagingSenderId: "480529382915",
  appId: "1:480529382915:web:56704d22550d5b13909836",
  measurementId: "G-07KD79ZW41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Named exports used throughout the app
export const auth = getAuth(app);
export const db   = getFirestore(app);
