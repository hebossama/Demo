let cart = [];

// Load Products
async function loadProducts() {
  const res = await fetch('products.json');
  const products = await res.json();
  const container = document.getElementById('product-slider');

  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

// Add to Cart
function addToCart(id, name, price) {
  cart.push({ id, name, price });
  document.getElementById('cart-count').textContent = cart.length;
  renderCart();
}

// Toggle Cart
function toggleCart() {
  document.getElementById('cart').classList.toggle('hidden');
}

// Render Cart
function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach(item => {
    total += item.price;
    cartItems.innerHTML += `<p>${item.name} - $${item.price}</p>`;
  });

  cartTotal.textContent = `Total: $${total}`;
}

// Slider arrows
function scrollSlider(direction) {
  const slider = document.getElementById('product-slider');
  const scrollAmount = 250; // pixels per click
  slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

loadProducts();
