// ingredients.js
import { auth, db } from './firebase-init.js';
import { redirectIfNotLoggedIn } from './app.js';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

redirectIfNotLoggedIn();

let currentUser = null;

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loadIngredients();
  }
});

document.getElementById('ingredientForm').addEventListener('submit', async e => {
  e.preventDefault();
  const itemName = document.getElementById('itemName').value.trim();
  const quantity = parseFloat(document.getElementById('quantity').value);
  const unit = document.getElementById('unit').value;
  const energy = parseFloat(document.getElementById('energy').value);
  const protein = parseFloat(document.getElementById('protein').value);
  try {
    await addDoc(collection(db, 'ingredients'), {
      uid: currentUser.uid,
      itemName,
      quantity,
      unit,
      energy,
      protein,
      createdAt: serverTimestamp()
    });
    e.target.reset();
    loadIngredients();
  } catch (err) {
    alert('Error adding ingredient: ' + err.message);
  }
});

async function loadIngredients() {
  const table = document.getElementById('ingredientTable');
  table.innerHTML = '';
  const q = query(collection(db, 'ingredients'), where('uid', '==', currentUser.uid));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${data.itemName}</td><td>${data.quantity}</td><td>${data.unit}</td><td>${data.energy}</td><td>${data.protein}</td>`;
    table.appendChild(tr);
  });
}