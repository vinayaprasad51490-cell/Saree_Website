function addProduct() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const imageInput = document.getElementById("image");

    if (!name || !price || imageInput.files.length === 0) {
        alert("Please fill all fields");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        const newProduct = {
            id: Date.now(),
            name: name,
            price: Number(price),
            image: reader.result
        };

        let products = JSON.parse(localStorage.getItem("products")) || [];
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));

        alert("Product added successfully!");
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        imageInput.value = "";
    };

    reader.readAsDataURL(imageInput.files[0]);
}
