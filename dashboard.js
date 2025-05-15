// dashboard.js
import { redirectIfNotLoggedIn, logout } from './app.js';
redirectIfNotLoggedIn();
document.getElementById('logoutBtn').addEventListener('click', logout);
console.log('Dashboard loaded');