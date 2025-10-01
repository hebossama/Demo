let cart = [];

// Load products
fetch("products.json")
  .then(res => res.json())
  .then(products => {
    const list = document.getElementById("product-list");
    products.forEach(product => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
          Add to Cart
        </button>
      `;
      list.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Error loading products.json", err);
  });

// Add to Cart
function addToCart(id, name, price, image) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  updateCart();
}

// Update Cart
function updateCart() {
  document.getElementById("cart-count").innerText = cart.reduce((a, b) => a + b.qty, 0);

  const items = document.getElementById("cart-items");
  items.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <p>${item.name}</p>
        <p>$${item.price} x ${item.qty}</p>
      </div>
      <button onclick="removeFromCart(${item.id})">❌</button>
    `;
    items.appendChild(div);
  });

  document.getElementById("cart-total").innerText = total;
}

// Remove from Cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Toggle Cart Sidebar
function toggleCart() {
  document.getElementById("cart-sidebar").classList.toggle("open");
}
