let editIndex = -1;
let products = JSON.parse(localStorage.getItem("products")) || [];


function addProduct() {
  let name = document.getElementById("pName").value;
  let price = document.getElementById("pPrice").value;
  let category = document.getElementById("pCategory").value;
  let imageInput = document.getElementById("pImage");

  if (!name || !price) {
    alert("Please fill all fields");
    return;
  }

  // 👉 UPDATE MODE
  if (editIndex !== null) {
    let product = products[editIndex];

    product.name = name;
    product.price = Number(price);
    product.category = category;

    // 🔥 Only change image if NEW image selected
    if (imageInput.files.length > 0) {
      let reader = new FileReader();
      reader.onload = function () {
        product.image = reader.result;
        saveAndReset();
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      // ✔ keep old image
      saveAndReset();
    }

    return;
  }

  // 👉 ADD MODE
  if (imageInput.files.length === 0) {
    alert("Please choose an image");
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
  reader.readAsDataURL(imageInput.files[0]);
}

function saveAndReset() {
  localStorage.setItem("products", JSON.stringify(products));
  displaySellerProducts();

  document.getElementById("pName").value = "";
  document.getElementById("pPrice").value = "";
  document.getElementById("pCategory").value = "Silk";
  document.getElementById("pImage").value = "";

  document.getElementById("addBtn").innerText = "Add Product";
  editIndex = null;
}


function displaySellerProducts() {
  let div = document.getElementById("sellerProducts");
  div.innerHTML = "";

  products.forEach(p => {
    div.innerHTML += `
      <div style="margin-bottom:15px">
        <img src="${p.image}" width="80"><br>
        ${p.name} - ₹${p.price} (${p.category})
      </div>
    `;
  });
}

displaySellerProducts();
function displaySellerProducts() {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let container = document.getElementById("sellerProducts");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products added yet.</p>";
    return;
  }

  products.forEach((p, index) => {
    container.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px">
        <img src="${p.image}" width="100"><br>
        <b>${p.name}</b><br>
        ₹${p.price} (${p.category})<br><br>

       <button onclick="editProduct(${index})" style="background:orange;color:white">
        Edit
      </button>

        <button onclick="deleteProduct(${index})" style="background:red;color:white">
          Delete
        </button>
      </div>
    `;
  });
}
displaySellerProducts();
function editProduct(index) {
  editIndex = index;
  let product = products[index];

  document.getElementById("pName").value = product.name;
  document.getElementById("pPrice").value = product.price;
  document.getElementById("pCategory").value = product.category;

  // ✔ VERY IMPORTANT
  document.getElementById("pImage").value = "";

  document.getElementById("addBtn").innerText = "Update Product";
}



function deleteProduct(index) {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  if (confirm("Are you sure you want to delete this product?")) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displaySellerProducts();
    alert("Product deleted!");
  }
}
