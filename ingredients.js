// ingredients.js
import { auth, db } from './firebase-init.js';
import { redirectIfNotLoggedIn } from './app.js';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

redirectIfNotLoggedIn();
let currentUser = null;
onAuthStateChanged(auth, user => { if (user) { currentUser = user; loadIngredients(); } });

document.getElementById('ingredientForm').addEventListener('submit', async e => {
    e.preventDefault();
    const itemName = document.getElementById('itemName').value.trim();
    const quantity = parseFloat(document.getElementById('quantity').value);
    const unit = document.getElementById('unit').value;
    const energy = parseFloat(document.getElementById('energy').value);
    const protein = parseFloat(document.getElementById('protein').value);
    await addDoc(collection(db,'ingredients'), { uid: currentUser.uid, itemName, quantity, unit, energy, protein, createdAt: serverTimestamp() });
    e.target.reset();
    loadIngredients();
});

async function loadIngredients() {
    const table = document.getElementById('ingredientTable');
    table.innerHTML = '';
    const snap = await getDocs(query(collection(db,'ingredients'), where('uid','==',currentUser.uid)));
    snap.forEach(docSnap => {
        const d = docSnap.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${d.itemName}</td><td>${d.quantity}</td><td>${d.unit}</td><td>${d.energy}</td><td>${d.protein}</td><td><button class="btn btn-sm btn-danger deleteBtn">Del</button></td>`;
        tr.querySelector('.deleteBtn').addEventListener('click', async () => {
            await deleteDoc(doc(db,'ingredients',docSnap.id));
            loadIngredients();
        });
        table.appendChild(tr);
    });
}