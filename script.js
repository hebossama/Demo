// Load products
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    const productList = document.getElementById("product-list");
    data.forEach(product => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
      `;
      productList.appendChild(div);
    });
  });

// Cart
let cart = [];

function addToCart(id, name, price) {
  cart.push({id, name, price});
  updateCart();
}

function updateCart() {
  document.getElementById("cart-count").textContent = cart.length;

  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    cartItems.appendChild(li);
    total += item.price;
  });
  document.getElementById("cart-total").textContent = `Total: $${total}`;
}

// Sidebar toggle
document.getElementById("cart-icon").addEventListener("click", () => {
  document.getElementById("cart-sidebar").classList.toggle("active");
});

// Checkout
document.getElementById("checkout-btn").addEventListener("click", () => {
  alert("Checkout not implemented yet!");
});
