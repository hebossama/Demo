let cart = [];

// Fetch products and build slider
fetch("products.json")
  .then(res => res.json())
  .then(products => {
    const slider = document.getElementById("slider");
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      slider.appendChild(card);
    });
  });

// Add to cart
function addToCart(id) {
  fetch("products.json")
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === id);
      cart.push(product);
      updateCart();
    });
}

function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartCount.textContent = cart.length;
  cartItems.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: $${total}`;
}

// Cart Modal
const modal = document.getElementById("cartModal");
const btn = document.getElementById("cartBtn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = () => (modal.style.display = "block");
span.onclick = () => (modal.style.display = "none");
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

document.getElementById("checkoutBtn").onclick = () => {
  alert("Order placed successfully!");
  cart = [];
  updateCart();
  modal.style.display = "none";
};
