// js/ingredients.js
import { auth, db } from './firebase-init.js';
import { redirectIfNotLoggedIn } from './app.js';
// Import Firestore methods as needed
// import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

redirectIfNotLoggedIn();

// TODO: Implement add ingredient logic on #ingredientForm submit
// TODO: Load and display ingredients in #ingredientTable