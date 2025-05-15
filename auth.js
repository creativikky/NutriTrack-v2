// auth.js
import { auth } from './firebase-init.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const googleBtn = document.getElementById('googleSignIn');
const submitBtn = document.getElementById('submitBtn');
const alertBox = document.getElementById('alertBox');

function showError(msg) {
  alertBox.textContent = msg;
  alertBox.classList.remove('d-none');
}

// Google Sign-In
googleBtn.addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithPopup(auth, provider);
    window.location = 'dashboard.html';
  } catch (e) {
    showError(e.message);
  }
});

// Combined Email Sign-In / Register
submitBtn.addEventListener('click', async () => {
  alertBox.classList.add('d-none');
  const email = document.getElementById('email').value.trim();
  const pw = document.getElementById('password').value;

  if (!email || !pw) {
    return showError('Please enter both email and password.');
  }

  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.includes('password')) {
      await signInWithEmailAndPassword(auth, email, pw);
    } else if (methods.length === 0) {
      await createUserWithEmailAndPassword(auth, email, pw);
    } else {
      throw new Error(`This email is registered via ${methods.join(',')}. Use Google.`);
    }
    window.location = 'dashboard.html';
  } catch (e) {
    showError(e.message);
  }
});