// js/auth.js
import { auth } from './firebase-init.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const googleBtn = document.getElementById('googleSignIn');
const emailBtn = document.getElementById('emailSignIn');
const alertBox = document.getElementById('alertBox');

function showError(msg) {
  alertBox.textContent = msg;
  alertBox.classList.remove('d-none');
}

googleBtn.addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    window.location = 'dashboard.html';
  } catch (e) {
    showError(e.message);
  }
});

emailBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const pw = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, pw).catch(async err => {
      if (err.code === 'auth/user-not-found') {
        return createUserWithEmailAndPassword(auth, email, pw);
      }
      throw err;
    });
    window.location = 'dashboard.html';
  } catch (e) {
    showError(e.message);
  }
});