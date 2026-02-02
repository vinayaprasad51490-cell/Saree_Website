const defaultProducts = [
    { id: 1, name: "Red Silk Saree", price: 1500, category: "Silk", image: "images/red.jpeg" },
    { id: 2, name: "Cream Cotton Saree", price: 1200, category: "Cotton", image: "images/cream.jpeg" },
    { id: 3, name: "Green Designer Saree", price: 2200, category: "Designer", image: "images/green.jpeg" }
];


const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
const products = [...defaultProducts, ...storedProducts];



let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("productList");
const cartDiv = document.getElementById("cart");


// Load products
function displayProducts(list) {
    productList.innerHTML = "";

    list.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <img src="${p.image}">
            <h3>${p.name}</h3>
            <p>${p.category}</p>
            <p>₹${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        `;
        // click image or name to open product page
        div.querySelector("img").onclick = () => openProduct(p);
        div.querySelector("h3").onclick = () => openProduct(p);
       
        productList.appendChild(div);
    });
}

displayProducts(products);


function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
}

function showCart() {
    cartDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
         total += item.price * (item.quantity || 1);
        cartDiv.innerHTML += `
            <p>
                ${item.name} - ₹${item.price}
                <button onclick="removeItem(${index})">❌</button>
            </p>
        `;
    });

    document.getElementById("total").innerText = "Total: ₹" + total;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
}

// Load cart on page load
showCart();


function buyNow() {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let total = 0;
  cart.forEach(item => {
    total += item.price * (item.quantity || 1);
  });
    alert("✅ Order placed successfully!\nTotal Amount: ₹" + total);

    cart = [];
    localStorage.removeItem("cart");
    showCart();
}

function filterProducts(category) {
    if (category === "All") {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}
function searchProducts() {
    const text = document.getElementById("searchBox").value.toLowerCase();

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(text) ||
        p.category.toLowerCase().includes(text)
    );

    displayProducts(filtered);
}
function sortProducts(order) {
    let sorted = [...products];

    if (order === "low") {
        sorted.sort((a, b) => a.price - b.price);
    } 
    else if (order === "high") {
        sorted.sort((a, b) => b.price - a.price);
    }

    displayProducts(sorted);
}
function openProduct(product) {
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "product.html";
}
function placeOrder() {
  let name = document.getElementById("custName").value;
  let phone = document.getElementById("custPhone").value;
  let address = document.getElementById("custAddress").value;

  if (!name || !phone || !address) {
    alert("Please fill all customer details");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  let message = `Hello, I want to place an order:%0A%0A`;
  message += `Name: ${name}%0A`;
  message += `Phone: ${phone}%0A`;
  message += `Address: ${address}%0A%0A`;

  let total = 0;

  cart.forEach(item => {
    message += `${item.name} x ${item.quantity} - ₹${item.price * item.quantity}%0A`;
    total += item.price * item.quantity;
  });

  message += `%0A*Total Amount: ₹${total}*`;

  let phoneNumber = "916363546295"; // replace with your number
  let whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

  window.open(whatsappURL, "_blank");
}
//let products = JSON.parse(localStorage.getItem("products")) || [];

