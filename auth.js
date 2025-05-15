// auth.js
console.log('🔗 auth.js loaded');  // ← this should appear immediately on page load

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
  console.log('👉 Google button clicked');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('✅ popup result:', result);
    window.location = 'dashboard.html';
  } catch (e) {
    console.error('❌ Google sign-in error:', e.code, e.message);
    showError(`Google sign-in failed: ${e.message}`);
  }
});

// Email Sign-in
signInBtn.addEventListener('click', async () => {
  console.log('👉 Email sign-in click');
  const email = document.getElementById('email').value;
  const pw    = document.getElementById('password').value;

  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    console.log('   Available methods:', methods);
    if (methods.includes('password')) {
      await signInWithEmailAndPassword(auth, email, pw);
      console.log('✅ Email sign-in success');
      window.location = 'dashboard.html';
    } else if (methods.length === 0) {
      throw new Error('No account found—please register first.');
    } else {
      throw new Error(
        `This email is registered via ${methods.join(', ')}. Use that method.`
      );
    }
  } catch (e) {
    console.error('❌ Email sign-in error:', e.message);
    showError(e.message);
  }
});

// Email Registration
registerBtn.addEventListener('click', async () => {
  console.log('👉 Register click');
  const email = document.getElementById('email').value;
  const pw    = document.getElementById('password').value;

  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    console.log('   Existing methods:', methods);
    if (methods.length > 0) {
      throw new Error('An account already exists—please sign in instead.');
    }
    await createUserWithEmailAndPassword(auth, email, pw);
    console.log('✅ Registration success');
    window.location = 'dashboard.html';
  } catch (e) {
    console.error('❌ Registration error:', e.message);
    showError(e.message);
  }
});
