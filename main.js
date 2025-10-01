let cart = [];

// Load products from JSON
async function loadProducts() {
  const response = await fetch('products.json');
  const products = await response.json();

  const productContainer = document.getElementById('product-list');
  productContainer.innerHTML = '';

  products.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product-card');
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productContainer.appendChild(div);
  });
}

// Add item to cart
async function addToCart(id) {
  const response = await fetch('products.json');
  const products = await response.json();
  const product = products.find(p => p.id === id);

  cart.push(product);
  updateCartCount();
}

// Update cart button
function updateCartCount() {
  document.getElementById('cart-btn').innerText = `Cart (${cart.length})`;
}

// Show cart items
function viewCart() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    let items = cart.map(p => `${p.name} - $${p.price}`).join("\n");
    alert("Your Cart:\n" + items);
  }
}

// Load products on page load
window.onload = loadProducts;
