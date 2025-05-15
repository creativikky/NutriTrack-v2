import { db, auth } from './firebase-init.js';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { redirectIfNotLoggedIn } from './auth.js';

let currentUser = null;
auth.onAuthStateChanged(user => {
  if (!user) redirectIfNotLoggedIn();
  else {
    currentUser = user;
    loadIngredients();
  }
});

const form = document.getElementById('ingredientForm');
const alertBox = document.getElementById('alertBox');
const tableBody = document.querySelector('#ingredientsTable tbody');

form.addEventListener('submit', async e => {
  e.preventDefault();
  alertBox.classList.add('d-none');
  alertBox.classList.remove('alert-danger','alert-success');
  try {
    alertBox.textContent = 'Adding…';
    alertBox.classList.remove('d-none','alert-danger');
    alertBox.classList.add('alert','alert-info');
    const itemName = document.getElementById('itemName').value.trim();
    const quantity = parseFloat(document.getElementById('quantity').value);
    const unit = document.getElementById('unit').value.trim();
    const energy = parseFloat(document.getElementById('energy').value);
    const protein = parseFloat(document.getElementById('protein').value);

    await addDoc(collection(db, 'ingredients'), {
      uid: currentUser.uid,
      itemName,
      quantity,
      unit,
      energy,
      protein,
      createdAt: serverTimestamp()
    });

    alertBox.textContent = 'Ingredient added!';
    alertBox.classList.replace('alert-info','alert-success');
    form.reset();
  } catch(err) {
    console.error(err);
    alertBox.textContent = err.message;
    alertBox.classList.replace('alert-info','alert-danger');
  } finally {
    loadIngredients();
  }
});

function loadIngredients() {
  tableBody.innerHTML = '';
  const q = query(
    collection(db, 'ingredients'),
    where('uid', '==', currentUser.uid),
    orderBy('createdAt', 'desc')
  );
  onSnapshot(q, snapshot => {
    tableBody.innerHTML = '';
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${data.itemName}</td>
        <td>${data.quantity}</td>
        <td>${data.unit}</td>
        <td>${data.energy}</td>
        <td>${data.protein}</td>
        <td><button data-id="${docSnap.id}" class="deleteBtn">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });
    document.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        await deleteDoc(doc(db, 'ingredients', btn.dataset.id));
      });
    });
  });
}