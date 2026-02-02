let products = JSON.parse(localStorage.getItem("products")) || [];

function addProduct() {
  let name = document.getElementById("pName").value;
  let price = document.getElementById("pPrice").value;
  let category = document.getElementById("pCategory").value;
  let imageInput = document.getElementById("pImage");

  if (!name || !price || imageInput.files.length === 0) {
    alert("Please fill all fields");
    return;
  }

  let reader = new FileReader();
  reader.onload = function () {
    let product = {
      id: Date.now(),
      name: name,
      price: Number(price),
      category: category,
      image: reader.result
    };

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));

    displaySellerProducts();
    alert("Product added successfully ✅");

    document.getElementById("pName").value = "";
    document.getElementById("pPrice").value = "";
    imageInput.value = "";
  };

  reader.readAsDataURL(imageInput.files[0]);
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
        <button onclick="deleteProduct(${index})" style="background:red;color:white">
          Delete
        </button>
      </div>
    `;
  });
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
displaySellerProducts();

