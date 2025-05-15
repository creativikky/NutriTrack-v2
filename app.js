// app.js
import { auth } from './firebase-init.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

export function redirectIfNotLoggedIn() {
  onAuthStateChanged(auth, user => {
    if (!user) window.location = 'index.html';
  });
}

export function logout() {
  signOut(auth).then(() => window.location = 'index.html');
}