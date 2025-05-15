// meals.js
import { auth, db } from './firebase-init.js';
import { redirectIfNotLoggedIn } from './app.js';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

redirectIfNotLoggedIn();
let currentUser = null, ingredientList = [];

onAuthStateChanged(auth, user => {
    if (user) {
        currentUser = user;
        loadIngredientsList();
        loadMeals();
    }
});

async function loadIngredientsList() {
    const snap = await getDocs(query(collection(db,'ingredients'), where('uid','==',currentUser.uid)));
    ingredientList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    document.querySelectorAll('.ingredientSelect').forEach(sel => {
        sel.innerHTML = '<option value="">Select Ingredient</option>' + ingredientList.map(i => `<option value="${i.id}">${i.itemName}</option>`).join('');
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
    const items = rows.map(r => {
        const sel = r.querySelector('.ingredientSelect');
        const qty = parseFloat(r.querySelector('.ingredientQty').value);
        const ing = ingredientList.find(i => i.id === sel.value);
        return ing ? {
            ingredientId: ing.id,
            ingredientName: ing.itemName,
            quantity: qty,
            unit: ing.unit,
            energy: qty * ing.energy / ing.quantity,
            protein: qty * ing.protein / ing.quantity
        } : null;
    }).filter(x => x);
    try {
        await addDoc(collection(db,'meals'), {
            uid: currentUser.uid,
            mealNumber,
            items,
            totalEnergy: items.reduce((s,i) => s+i.energy,0),
            totalProtein: items.reduce((s,i) => s+i.protein,0),
            createdAt: serverTimestamp()
        });
        e.target.reset();
        loadMeals();
    } catch(e) {
        console.error(e);
    }
});

async function loadMeals() {
    const table = document.getElementById('mealTable');
    table.innerHTML = '';
    const snap = await getDocs(query(collection(db,'meals'), where('uid','==',currentUser.uid)));
    snap.docs.forEach(d => {
        const m = d.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${m.mealNumber}</td><td>${m.items.map(i => i.ingredientName).join(', ')}</td><td>${m.items.reduce((s,i)=>s+i.quantity,0)}</td><td>${m.totalEnergy.toFixed(2)}</td><td>${m.totalProtein.toFixed(2)}</td>`;
        table.appendChild(tr);
    });
}