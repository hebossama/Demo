const BACKEND_URL = "https://demo-7g3i.onrender.com"; 

// Load products from backend
fetch(`${BACKEND_URL}/products`)
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
  })
  .catch(err => console.error("Failed to load products:", err));

// Cart
let cart = [];

function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
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
document.getElementById("checkout-btn").addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const customer = {
    name: prompt("Enter your name:"),
    email: prompt("Enter your email:")
  };

  try {
    const res = await fetch(`${BACKEND_URL}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, customer })
    });
    const data = await res.json();

    if (data.success) {
      alert(`Order successful!\nAI Message: ${data.aiMessage || "No AI message"}`);
      cart = [];
      updateCart();
    } else {
      alert("Checkout failed. See console for details.");
      console.error(data);
    }
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Checkout failed. See console.");
  }
});
