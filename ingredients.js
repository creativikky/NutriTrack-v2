// ingredients.js
import { auth, db } from './firebase-init.js';
import { redirectIfNotLoggedIn } from './app.js';
import {
  collection, addDoc, getDocs, query, where, serverTimestamp,
  updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

redirectIfNotLoggedIn();

const form = document.getElementById('ingredientForm');
const alertBox = document.getElementById('alertBox');
const submitBtn = document.getElementById('submitBtn');
const tableBody = document.getElementById('ingredientTable');

let currentUser = null;
let editDocId = null;

function showLoading(msg) {
  alertBox.className = 'alert alert-info';
  alertBox.textContent = msg;
  alertBox.classList.remove('d-none');
}
function showSuccess(msg) {
  alertBox.className = 'alert alert-success';
  alertBox.textContent = msg;
  alertBox.classList.remove('d-none');
  setTimeout(() => alertBox.classList.add('d-none'), 3000);
}
function showError(msg) {
  alertBox.className = 'alert alert-danger';
  alertBox.textContent = msg;
  alertBox.classList.remove('d-none');
}

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loadIngredients();
  }
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const itemName = document.getElementById('itemName').value.trim();
  const quantity = parseFloat(document.getElementById('quantity').value);
  const unit = document.getElementById('unit').value;
  const energy = parseFloat(document.getElementById('energy').value);
  const protein = parseFloat(document.getElementById('protein').value);

  if (!itemName) {
    showError('Item name required');
    return;
  }
  showLoading(editDocId ? 'Updating...' : 'Adding...');
  const data = { uid: currentUser.uid, itemName, quantity, unit, energy, protein, updatedAt: serverTimestamp() };
  try {
    if (editDocId) {
      await updateDoc(doc(db, 'ingredients', editDocId), data);
      showSuccess('Ingredient updated');
      submitBtn.textContent = 'Add Ingredient';
      editDocId = null;
    } else {
      await addDoc(collection(db, 'ingredients'), { ...data, createdAt: serverTimestamp() });
      showSuccess('Ingredient added');
    }
    form.reset();
    loadIngredients();
  } catch (err) {
    showError('Error: ' + err.message);
  }
});

async function loadIngredients() {
  tableBody.innerHTML = '';
  const q = query(collection(db, 'ingredients'), where('uid', '==', currentUser.uid));
  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${data.itemName}</td>
      <td>${data.quantity}</td>
      <td>${data.unit}</td>
      <td>${data.energy}</td>
      <td>${data.protein}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary editBtn">Edit</button>
        <button class="btn btn-sm btn-outline-danger deleteBtn">Delete</button>
      </td>`;
    tr.querySelector('.editBtn').addEventListener('click', () => {
      document.getElementById('itemName').value = data.itemName;
      document.getElementById('quantity').value = data.quantity;
      document.getElementById('unit').value = data.unit;
      document.getElementById('energy').value = data.energy;
      document.getElementById('protein').value = data.protein;
      submitBtn.textContent = 'Update Ingredient';
      editDocId = docSnap.id;
    });
    tr.querySelector('.deleteBtn').addEventListener('click', async () => {
      if (confirm('Delete this ingredient?')) {
        await deleteDoc(doc(db, 'ingredients', docSnap.id));
        loadIngredients();
      }
    });
    tableBody.appendChild(tr);
  });
}