let products = JSON.parse(localStorage.getItem("products")) || [];
let editingProductId = null;

async function addProduct() {
  let name = document.getElementById("pName").value.trim();
  let price = document.getElementById("pPrice").value;
  let category = document.getElementById("pCategory").value;
  let imageInput = document.getElementById("pImage");
  let files = Array.from(imageInput.files); // Convert FileList to an Array

  if (!name || !price) {
    alert("Please fill all fields");
    return;
  }

  let images = [];

  // If new files are selected, read them all
  if (files.length > 0) {
    // This "maps" every file to a Promise (a task to be finished)
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    // WAIT here until every single image is converted to text
    images = await Promise.all(imagePromises);
  }

  if (editingProductId !== null) {
    // UPDATE MODE
    let index = products.findIndex(p => p.id === editingProductId);
    products[index].name = name;
    products[index].price = Number(price);
    products[index].category = category;
    
    // Only update images if the user actually picked new ones
    if (images.length > 0) {
      products[index].images = images;
    }
    saveAndReset();

  } else {
    // ADD MODE
    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    let product = {
      id: Date.now(),
      name,
      price: Number(price),
      category,
      images: images // This is now your array of multiple images
    };
    products.push(product);
    saveAndReset();
  }
}
function createNewProduct(name, price, category, images) {
  let product = {
    id: Date.now(),
    name,
    price: Number(price),
    category,
    images
  };
  products.push(product);
  saveAndReset();
}

function updateProductData(name, price, category, images) {
  let index = products.findIndex(p => p.id === editingProductId);
  if (index !== -1) {
    products[index].name = name;
    products[index].price = Number(price);
    products[index].category = category;
    if (images) products[index].images = images; // only update images if new ones were picked
    saveAndReset();
  }
}

function saveAndReset() {
  try {
    localStorage.setItem("products", JSON.stringify(products));
    displaySellerProducts();
    // Clear inputs
    document.getElementById("pName").value = "";
    document.getElementById("pPrice").value = "";
    document.getElementById("pImage").value = "";
    document.getElementById("addBtn").innerText = "Add Product";
    editingProductId = null;
  } catch (e) {
    alert("Storage Full! Try using fewer or smaller images.");
    console.error("LocalStorage Error:", e);
  }
}

function displaySellerProducts() {
  let container = document.getElementById("sellerProducts");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products added yet.</p>";
    return;
  }

  products.forEach(p => {
    // FIX: Added backticks ( ` ) here for the template literal
    container.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px">
        ${p.images.map(img => `<img src="${img}" width="80" style="margin:5px">`).join("")}
        <br>
        <b>${p.name}</b><br>
        ₹${p.price} (${p.category})<br><br>
        <button onclick="editProduct(${p.id})" style="background:orange;color:white">Edit</button>
        <button onclick="deleteProduct(${p.id})" style="background:red;color:white">Delete</button>
      </div>
    `;
  });
}

// ... keep your editProduct and deleteProduct functions as they were

function editProduct(id) {
  let product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById("pName").value = product.name;
  document.getElementById("pPrice").value = product.price;
  document.getElementById("pCategory").value = product.category;
  document.getElementById("pImage").value = "";

  editingProductId = id;
  document.getElementById("addBtn").innerText = "Update Product";
}

function deleteProduct(id) {
  if (!confirm("Are you sure?")) return;
  products = products.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  displaySellerProducts();
}

displaySellerProducts();
