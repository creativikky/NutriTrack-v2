// meals.js
import { auth, db } from './firebase-init.js';
import { redirectIfNotLoggedIn } from './app.js';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

redirectIfNotLoggedIn();

let currentUser = null;
let ingredientList = [];

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loadIngredientsList();
    loadMeals();
  }
});

async function loadIngredientsList() {
  const snapshot = await getDocs(query(collection(db, 'ingredients'), where('uid', '==', currentUser.uid)));
  ingredientList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  document.querySelectorAll('.ingredientSelect').forEach(select => {
    select.innerHTML = '<option value="">Select Ingredient</option>' +
      ingredientList.map(i => `<option value="${i.id}">${i.itemName}</option>`).join('');
  });
}

document.getElementById('addRow').addEventListener('click', () => {
  const row = document.querySelector('#ingredientRows .input-group').cloneNode(true);
  row.querySelector('.ingredientQty').value = '';
  row.querySelector('.unitLabel').textContent = '';
  document.getElementById('ingredientRows').appendChild(row);
});

document.getElementById('mealForm').addEventListener('submit', async e => {
  e.preventDefault();
  const mealNumber = parseInt(document.getElementById('mealNumber').value);
  const rows = Array.from(document.querySelectorAll('#ingredientRows .input-group'));
  const items = rows.map(row => {
    const select = row.querySelector('.ingredientSelect');
    const qtyInput = row.querySelector('.ingredientQty');
    const ing = ingredientList.find(i => i.id === select.value);
    const qty = parseFloat(qtyInput.value);
    return ing ? {
      ingredientId: ing.id,
      ingredientName: ing.itemName,
      quantity: qty,
      unit: ing.unit,
      energy: qty * ing.energy / ing.quantity,
      protein: qty * ing.protein / ing.quantity
    } : null;
  }).filter(item => item);
  const totalEnergy = items.reduce((sum,i) => sum + i.energy, 0);
  const totalProtein = items.reduce((sum,i) => sum + i.protein, 0);
  try {
    await addDoc(collection(db, 'meals'), {
      uid: currentUser.uid,
      mealNumber,
      items,
      totalEnergy,
      totalProtein,
      createdAt: serverTimestamp()
    });
    e.target.reset();
    loadMeals();
  } catch (err) {
    alert('Error adding meal: ' + err.message);
  }
});

async function loadMeals() {
  const table = document.getElementById('mealTable');
  table.innerHTML = '';
  const snapshot = await getDocs(query(collection(db, 'meals'), where('uid', '==', currentUser.uid)));
  snapshot.docs.forEach(doc => {
    const m = doc.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${m.mealNumber}</td><td>${m.items.map(i => i.ingredientName).join(', ')}</td><td>${m.items.reduce((sum,i)=>sum+i.quantity,0)}</td><td>${m.totalEnergy.toFixed(2)}</td><td>${m.totalProtein.toFixed(2)}</td><td></td>`;
    table.appendChild(tr);
  });
}