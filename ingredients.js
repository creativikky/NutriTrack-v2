// ingredients.js
import { auth, db } from './firebase-init.js';
import { redirectIfNotLoggedIn } from './app.js';

redirectIfNotLoggedIn();
// TODO: implement ingredients CRUD