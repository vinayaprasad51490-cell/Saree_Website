let products = JSON.parse(localStorage.getItem("products")) || [];
let editingProductId = null;

function addProduct() {
  let name = document.getElementById("pName").value.trim();
  let price = document.getElementById("pPrice").value;
  let category = document.getElementById("pCategory").value;
  let imageInput = document.getElementById("pImage");
  let files = imageInput.files;

  if (!name || !price) {
    alert("Please fill all fields");
    return;
  }

  // 🔁 UPDATE MODE
  if (editingProductId !== null) {
    let index = products.findIndex(p => p.id === editingProductId);
    if (index === -1) return;

    products[index].name = name;
    products[index].price = Number(price);
    products[index].category = category;

    // if new images selected → replace images
    if (files.length > 0) {
      let images = [];
      let loaded = 0;

      for (let i = 0; i < files.length; i++) {
        let reader = new FileReader();
        reader.onload = function () {
          images.push(reader.result);
          loaded++;
          if (loaded === files.length) {
            products[index].images = images;
            saveAndReset();
          }
        };
        reader.readAsDataURL(files[i]);
      }
    } else {
      saveAndReset();
    }
    return;
  }

  // ➕ ADD MODE
  if (files.length === 0) {
    alert("Please select at least one image");
    return;
  }

  let images = [];
  let loaded = 0;

  for (let i = 0; i < files.length; i++) {
    let reader = new FileReader();
    reader.onload = function () {
      images.push(reader.result);
      loaded++;

      if (loaded === files.length) {
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
    };
    reader.readAsDataURL(files[i]);
  }
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
        ${p.images.map(img => `<img src="${img}" width="80" style="margin:5px">`).join("")}
        <br>
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
