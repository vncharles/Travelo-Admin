const local = JSON.parse(localStorage.getItem("data"));
const token = local.token;

const createProductForm = document.querySelector("#createProductForm");
createProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const productName = document.querySelector("#productName").value;
  const productImage = document.querySelector("#productImage").files[0];
  const productDescription = document.querySelector(
    "#productDescription"
  ).value;
  const productPrice = document.querySelector("#productPrice").value;
  const productSize = document.querySelector("#productSize").value;
  const productQuantity = document.querySelector("#productQuantity").value;
  const productType = document.querySelector("#productType").value;

  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      name: productName,
      description: productDescription,
      price: productPrice,
      stock: productQuantity,

      size: productSize,
      categoryId: productType,
    })
  );
  formData.append("image", productImage);

  try {
    const response = await fetch("http://localhost:8080/api/product/create", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Something went wrong!");
    }

    const data = await response.json();
    console.log(data);
    // Thực hiện các thao tác sau khi tạo sản phẩm thành công
  } catch (error) {
    console.error(error);
  }
});
const name = document.querySelector("#username");
console.log(name);
name.innerText = local.fullName;
