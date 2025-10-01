// Load products
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    const slider = document.getElementById("product-slider");
    data.forEach(product => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
      `;
      slider.appendChild(div);
    });
  });

// Cart
let cart = [];

function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({id, name, price, quantity: 1});
  }
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function changeQuantity(id, delta) {
  const item = cart.find(p => p.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    }
    updateCart();
  }
}

function updateCart() {
  document.getElementById("cart-count").textContent = cart.reduce((sum, p) => sum + p.quantity, 0);

  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} - $${item.price} x ${item.quantity}</span>
      <div class="cart-controls">
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });
  document.getElementById("cart-total").textContent = `Total: $${total}`;
}

// Sidebar toggle
document.getElementById("cart-icon").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("cart-sidebar").classList.toggle("active");
});

// Checkout
document.getElementById("checkout-btn").addEventListener("click", () => {
  alert("Checkout not implemented yet!");
});
