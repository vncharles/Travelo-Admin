const productTables = document.querySelector(".bodyChild");
const local = JSON.parse(localStorage.getItem("data"));
const token = local.token;
async function getProducts() {
  try {
    const response = await fetch("http://localhost:8080/api/product");
    const data = await response.json();

    data.forEach(async (product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td><img src="${product.image}" alt="product image" width="100px"></td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.size}</td>
        <td>${product.stock}</td>
        <td>${product.category.name}</td>
        <td> <button class="btnEdit" data-id="${product.id}">Sửa</button></td>
        <td> <button class="btnDelete" data-id="${product.id}">Xóa</button></td>
      `;

      const imageResponse = await fetch(
        `http://localhost:8080/api/product/${product.id}/image`
      );
      const imageBlob = await imageResponse.blob();
      const imageURL = URL.createObjectURL(imageBlob);
      row.querySelector("img").setAttribute("src", imageURL);

      productTables.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}

getProducts();

// ==============
// Khai báo biến lưu trữ ID của sản phẩm được chọn để sửa

async function getCategoryList() {
  const response = await fetch("http://localhost:8080/api/category");
  if (!response.ok) {
    throw new Error("Failed to retrieve category list");
  }
  const data = await response.json();
  return data;
}

// Get reference to the table
let productTable = document.querySelector(".bodyChild");

// Attach event listener to the table
productTable.addEventListener("click", async (event) => {
  // Check if the clicked element is a "Sửa" button
  if (event.target.classList.contains("btnEdit")) {
    // Get the product ID from the data-id attribute of the button
    const productId = event.target.dataset.id;

    // Find the row that contains the product
    const row = event.target.closest("tr");

    // Find the cells in the row that contain the product data
    const nameCell = row.querySelector("td:nth-child(2)");
    const imageCell = row.querySelector("td:nth-child(3)");
    const descriptionCell = row.querySelector("td:nth-child(4)");
    const priceCell = row.querySelector("td:nth-child(5)");
    const sizeCell = row.querySelector("td:nth-child(6)");
    const stockCell = row.querySelector("td:nth-child(7)");
    const categoryCell = row.querySelector("td:nth-child(8)");

    // Get the current values of the product data
    const name = nameCell.textContent;
    const image = imageCell.querySelector("img").getAttribute("src");
    const description = descriptionCell.textContent;
    const price = priceCell.textContent;
    const size = sizeCell.textContent;
    const stock = stockCell.textContent;
    const categoryName = categoryCell.textContent;

    // Replace the cells with input elements containing the current values
    nameCell.innerHTML = `<input type="text" id="editName" value="${name}">`;
    imageCell.innerHTML = `<input type="file" id ="editImage" value="${image}">`;
    descriptionCell.innerHTML = `<textarea id = "editDescription">${description}</textarea>`;
    priceCell.innerHTML = `<input type="number" id = "editPrice" value="${price}">`;
    sizeCell.innerHTML = `<input type="text" id="editSize" value="${size}">`;
    stockCell.innerHTML = `<input type="number" id="editQuantity" value="${stock}">`;
    // categoryCell.innerHTML = `<input type="text" id="editType" value="${categoryName}">`;
    // Lấy danh sách category
    const categoryList = await getCategoryList();

    // Tạo danh sách chọn
    let selectHtml = '<select id="editType">';
    categoryList.forEach((category) => {
      selectHtml += `<option value="${category.id}" ${
        categoryName === category.name ? "selected" : ""
      }>${category.name}</option>`;
    });
    selectHtml += "</select>";

    // Gán giá trị của categoryCell bằng thẻ select
    categoryCell.innerHTML = selectHtml;

    // Replace the "Sửa" button with a "Lưu" button

    const editBtn = row.querySelector(".btnEdit");
    editBtn.classList.remove("btnEdit");
    editBtn.classList.add("btnSave");
    editBtn.textContent = "Lưu";
    editBtn.setAttribute("data-id", productId);

    productTable = document.querySelector(".btnSave");
  }
});
//=========

productTable.addEventListener("click", async (event) => {
  // Check if the clicked element is a "Sửa" button
  if (!event.target.classList.contains("btnSave")) {
    return;
    // Check if the clicked element is a "Lưu" button
  } else if (event.target.classList.contains("btnSave")) {
    try {
      const productId = event.target.dataset.id;
      const row = event.target.closest("tr");

      const formData1 = new FormData();
      var newName = document.querySelector("#editName").value;
      var newImage = document.querySelector("#editImage").files[0];

      var newDescription = document.querySelector("#editDescription").value;
      var newPrice = document.querySelector("#editPrice").value;
      var newSize = document.querySelector("#editSize").value;
      var newQuantity = document.querySelector("#editQuantity").value;
      var newType = document.querySelector("#editType").value;

      formData1.append(
        "data",
        JSON.stringify({
          name: newName,
          description: newDescription,
          price: newPrice,
          stock: newQuantity,
          size: newSize,
          categoryId: newType,
        })
      );
      formData1.append("id", productId);
      if (document.querySelector("#editImage").files[0]) {
        formData1.append("image", newImage);
      }

      const response = await fetch(`http://localhost:8080/api/product/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData1,
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Something went wrong!");
      }

      const editButton = row.querySelector(".btnSave");
      editButton.classList.remove("btnSave");
      editButton.classList.add("btnEdit");
      editButton.textContent = "Sửa";
      console.log(editButton);
      alert("Sửa sản phẩm thành công");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }
});

// ====
const user = document.querySelector("#userName");
user.innerText = local.fullName;
//========= xóa
// Get the delete button element
// Get all delete button elements
// Get the table element
const table = document.querySelector("#product-table");

// Add a click event listener to the table
table.addEventListener("click", function (event) {
  // Check if the clicked element was a delete button
  if (event.target.classList.contains("btnDelete")) {
    // Get the product ID from the data-id attribute
    const productId = event.target.getAttribute("data-id");

    // Send a DELETE request to the server API
    fetch(`http://localhost:8080/api/product/delete?id=${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Product deleted successfully, do something
          alert("Xóa sản phẩm thành công");
          window.location.reload();
        } else {
          // Product deletion failed, handle the error
          alert("Có lỗi xảy ra");
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        alert("Có lỗi xảy ra : ", error);
      });
  }
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
 localStorage.removeItem("data");
 localStorage.removeItem("token");
 window.location.href = "login.html";
});
