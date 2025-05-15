// dashboard.js
import { redirectIfNotLoggedIn, logout } from './app.js';
redirectIfNotLoggedIn();
document.getElementById('logoutBtn').addEventListener('click', logout);
// TODO: implement dashboard data fetch and rendering