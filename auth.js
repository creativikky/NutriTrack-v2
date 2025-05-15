// auth.js
import { auth } from './firebase-init.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const googleBtn   = document.getElementById('googleSignIn');
const signInBtn   = document.getElementById('signInBtn');
const registerBtn = document.getElementById('registerBtn');
const alertBox    = document.getElementById('alertBox');

function showError(msg) {
  alertBox.textContent = msg;
  alertBox.classList.remove('d-none');
}

// Google Sign-in
googleBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    window.location = 'dashboard.html';
  } catch (e) {
    showError(e.message);
  }
});

// Email/Password Sign In
signInBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const pw    = document.getElementById('password').value;
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.includes('password')) {
      await signInWithEmailAndPassword(auth, email, pw);
      window.location = 'dashboard.html';
    } else if (methods.length === 0) {
      throw new Error('No account found—please register first.');
    } else {
      throw new Error(
        `This email is registered via ${methods.join(', ')}. Use the appropriate sign-in method.`
      );
    }
  } catch (e) {
    showError(e.message);
  }
});

// Email/Password Register
registerBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const pw    = document.getElementById('password').value;
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      throw new Error('An account already exists—please sign in instead.');
    }
    await createUserWithEmailAndPassword(auth, email, pw);
    window.location = 'dashboard.html';
  } catch (e) {
    showError(e.message);
  }
});