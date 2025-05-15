// auth.js
import { auth } from './firebase-init.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  /* signInWithRedirect, */           // uncomment to use redirect fallback
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

// — Google Sign-in with explicit logging
googleBtn.addEventListener('click', async () => {
  console.log('👉 Google button clicked');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  try {
    // Popup flow:
    const result = await signInWithPopup(auth, provider);
    console.log('✅ popup result:', result);
    window.location = 'dashboard.html';

    // Redirect fallback (uncomment to use):
    // console.log('👉 Redirecting for Google sign-in');
    // await signInWithRedirect(auth, provider);

  } catch (e) {
    console.error('❌ Google sign-in error:', e.code, e.message);
    showError(`Google sign-in failed: ${e.message}`);
  }
});

// — Email/Password Sign-In
signInBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const pw    = document.getElementById('password').value;

  console.log(`👉 Attempting email sign-in for ${email}`);
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    console.log('   Available sign-in methods:', methods);
    
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

// — Email/Password Registration
registerBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const pw    = document.getElementById('password').value;

  console.log(`👉 Attempting registration for ${email}`);
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    console.log('   Existing sign-in methods:', methods);

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
