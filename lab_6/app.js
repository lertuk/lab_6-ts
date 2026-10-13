"use strict";
// Початковий стан із тестовими даними
let products = [
    { id: 1, name: 'Acer Nitro 5 (AN515-57)', price: 34999, description: 'Ігровий ноутбук' },
    { id: 2, name: 'Redmi Note 13 Pro', price: 11999, description: 'Смартфон на базі HyperOS' }
];
// Ідентифікатор товару, який зараз редагується (якщо null — режим додавання)
let currentEditId = null;
// Отримання елементів DOM
const form = document.getElementById('product-form');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const descInput = document.getElementById('description');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const productsBody = document.getElementById('products-body');
// Відображення списку товарів (READ)
function renderProducts() {
    productsBody.innerHTML = '';
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price.toLocaleString('uk-UA')} ₴</td>
            <td>${product.description}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${product.id}">Редагувати</button>
                <button class="action-btn delete-btn" data-id="${product.id}">Видалити</button>
            </td>
        `;
        productsBody.appendChild(tr);
    });
}
// Обробка форми: Додавання або Оновлення (CREATE / UPDATE)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const description = descInput.value.trim();
    if (currentEditId !== null) {
        // Оновлення існуючого товару
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            products[index] = { id: currentEditId, name, price, description };
        }
        resetFormState();
    }
    else {
        // Створення нового товару з генерацією ID
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, price, description });
    }
    form.reset();
    renderProducts();
});
// Делегування подій для кнопок "Редагувати" та "Видалити"
productsBody.addEventListener('click', (e) => {
    const target = e.target;
    const idStr = target.getAttribute('data-id');
    if (!idStr)
        return;
    const id = parseInt(idStr, 10);
    if (target.classList.contains('edit-btn')) {
        // Підготовка до редагування
        const product = products.find(p => p.id === id);
        if (product) {
            nameInput.value = product.name;
            priceInput.value = product.price.toString();
            descInput.value = product.description;
            currentEditId = product.id;
            submitBtn.textContent = 'Зберегти зміни';
            cancelBtn.classList.remove('hidden');
        }
    }
    else if (target.classList.contains('delete-btn')) {
        // Видалення товару (DELETE)
        if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
            products = products.filter(p => p.id !== id);
            renderProducts();
        }
    }
});
// Скасування режиму редагування
cancelBtn.addEventListener('click', () => {
    form.reset();
    resetFormState();
});
// Повернення форми у початковий вигляд
function resetFormState() {
    currentEditId = null;
    submitBtn.textContent = 'Додати товар';
    cancelBtn.classList.add('hidden');
}
// Ініціалізація додатку при завантаженні
renderProducts();
