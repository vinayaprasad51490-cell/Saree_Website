let products = JSON.parse(localStorage.getItem("products")) || [];
let editingProductId = null;

function addProduct() {
  let name = document.getElementById("pName").value.trim();
  let price = document.getElementById("pPrice").value;
  let category = document.getElementById("pCategory").value;
  let imageInput = document.getElementById("pImage");

  if (!name || !price) {
    alert("Please fill all fields");
    return;
  }

  // ✅ declare file ONLY ONCE
  let file = imageInput.files.length > 0 ? imageInput.files[0] : null;

  // 🔁 UPDATE MODE
  if (editingProductId !== null) {
  let index = products.findIndex(p => p.id === editingProductId);
  if (index === -1) return;

  products[index].name = name;
  products[index].price = Number(price);
  products[index].category = category;

  if (file) {
    let reader = new FileReader();
    reader.onload = function () {
      products[index].image = reader.result;
      saveAndReset();
    };
    reader.readAsDataURL(file);
  } else {
    saveAndReset();
  }
  return;
}


  // ➕ ADD MODE
  if (!file) {
    alert("Please select an image");
    return;
  }

  let reader = new FileReader();
  reader.onload = function () {
    let product = {
      id: Date.now(),
      name,
      price: Number(price),
      category,
      image: reader.result
    };

    products.push(product);
    saveAndReset();
  };
  reader.readAsDataURL(file);
}


function saveAndReset() {
  localStorage.setItem("products", JSON.stringify(products));
  displaySellerProducts();

  document.getElementById("pName").value = "";
  document.getElementById("pPrice").value = "";
  document.getElementById("pCategory").value = "Silk";
  document.getElementById("pImage").value = "";

  document.getElementById("addBtn").innerText = "Add Product";
  editingProductId = null;
}


function displaySellerProducts() {
  let container = document.getElementById("sellerProducts");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products added yet.</p>";
    return;
  }

  products.forEach(p => {
    container.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px">
        <img src="${p.image}" width="100"><br>
        <b>${p.name}</b><br>
        ₹${p.price} (${p.category})<br><br>

        <button onclick="editProduct(${p.id})" style="background:orange;color:white">
          Edit
        </button>

        <button onclick="deleteProduct(${p.id})" style="background:red;color:white">
          Delete
        </button>
      </div>
    `;
  });
}

displaySellerProducts();

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById("pName").value = product.name;
  document.getElementById("pPrice").value = product.price;
  document.getElementById("pCategory").value = product.category;

  document.getElementById("pImage").value = ""; // browser security

  editingProductId = id;
  document.getElementById("addBtn").innerText = "Update Product";
}


function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  products = products.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  displaySellerProducts();
}
