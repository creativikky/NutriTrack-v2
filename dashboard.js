// dashboard.js
import { auth, db } from './firebase-init.js';
import { redirectIfNotLoggedIn } from './app.js';

redirectIfNotLoggedIn();
// TODO: implement dashboard data fetch and rendering