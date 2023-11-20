const data = JSON.parse(localStorage.getItem("data"));
const token = data.token;
function loadCategories() {
  fetch("http://localhost:8080/api/category", {
    headers: {
      Authorization: "Bearer <your-bearer-token>",
    },
  })
    .then((response) => response.json())
    .then((categories) => {
      const categoryList = document.getElementById("category-list");
      categoryList.innerHTML = ""; // Xóa bảng cũ
      categories.forEach((category) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td>
                        <button class="btn-edit" data-id="${category.id}">Sửa</button>
                    </td>
                    <td>
                        <button class="btn-delete" data-id="${category.id}">Xóa</button>
                    </td>
                `;
        categoryList.appendChild(tr);
      });
    })
    .catch((error) => console.error(error));
}

// Thêm sự kiện cho nút Sửa
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-edit")) {
    const categoryId = event.target.dataset.id;
    const newName = prompt("Nhập tên mới cho loại hàng");
    if (newName) {
      fetch(`http://localhost:8080/api/category/${categoryId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: categoryId,
          name: newName,
        }),
      })
        .then((response) => {
          console.log(response);
          if (response.ok) {
            alert("Sửa tên loại hàng thành công");
            loadCategories(); // Load lại danh sách loại hàng
          } else {
            alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
          }
        })
        .catch((error) => console.error(error));
    }
  }
});

// Load danh sách loại hàng khi trang vừa được tải lên
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-delete")) {
    const categoryId = event.target.dataset.id;

    fetch(`http://localhost:8080/api/category/${categoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          alert("Xóa thành công");
          loadCategories(); // Load lại danh sách loại hàng
        } else {
          alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      })
      .catch((error) => console.error(error));
  }
});

// Load danh sách loại hàng khi trang vừa được tải lên
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
});
////
const addProductBtn = document.getElementById("add-product-btn");
const addProductForm = document.getElementById("add-product-form");
const productNameInput = document.getElementById("product-name");
const cancelAddProductBtn = document.getElementById("cancel-add-product-btn");

// Hiển thị form để thêm sản phẩm mới
addProductBtn.addEventListener("click", () => {
  addProductForm.style.display = "block";
});

// Ẩn form để thêm sản phẩm mới
cancelAddProductBtn.addEventListener("click", () => {
  addProductForm.style.display = "none";
});

// Thêm sản phẩm mới
addProductForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const productName = productNameInput.value;

  fetch("http://localhost:8080/api/category", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: productName }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Thêm sản phẩm mới thành công");
        loadCategories();
        addProductForm.style.display = "none"; // Ẩn form thêm sản phẩm mới
      } else {
        alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    })
    .catch((error) => console.error(error));
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("data");
  localStorage.removeItem("token");
  window.location.href = "/HTML/login.html";
});
