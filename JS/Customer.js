const dataa = JSON.parse(localStorage.getItem("data"));
const token = dataa.token;
document.addEventListener("DOMContentLoaded", async () => {
  await renderOrders();
});

const fetchOrders = () => {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:8084/customer", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw (
            (new Error("Network response was not ok"), console.log(response))
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        resolve(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        reject(error);
      });
  });
};
const renderOrders = async () => {
  try {
    const orders = await fetchOrders();
    const tbody = document.querySelector("#category-list");

    // Remove all rows
    tbody.innerHTML = "";

    // Render each order as a row
    console.log("Data render: " + orders);
    orders.forEach((customer) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                            <td>${customer.id}</td>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td>${customer.address  }</td>
                            <td>
                              <button class="btn-edit" data-id="${customer.id}">Sửa</button>
                              <button class="btn-delete" data-id="${customer.id}">Xóa</button>
                             </td>
      `;
      tbody.appendChild(tr);

      // // Add event listener for "Sửa" button
      // const btnEdit = tr.querySelector(".btnEdit");
      // btnEdit.addEventListener("click", () => {
      //   // Get the fields to be edited
      //   const numberPhoneTd = tr.querySelector(".numberPhone");
      //   const nameReceiverTd = tr.querySelector(".nameReceiver");
      //   const addressTd = tr.querySelector(".address");

      //   // Replace the fields with input fields
      //   numberPhoneTd.innerHTML = `
      //     <form>
      //       <input type="text" id="inputNb" value="${order.numberPhone}">
      //     </form>
      //   `;
      //   const inputNb = numberPhoneTd.querySelector("#inputNb");

      //   nameReceiverTd.innerHTML = `
      //     <form>
      //       <input type="text" id="inputName" value="${order.nameReceiver}">
      //     </form>
      //   `;
      //   const inputName = nameReceiverTd.querySelector("#inputName");

      //   addressTd.innerHTML = `
      //     <form>
      //       <input type="text" id="inputAdd" value="${order.address}">
      //     </form>
      //   `;
      //   const inputAdd = addressTd.querySelector("#inputAdd");

      //   // Change the button to "Lưu"
      //   btnEdit.textContent = "Lưu";
      //   btnEdit.dataset.flag = "save";

      //   // Get the "Lưu" button
      //   const btnSave = tr.querySelector(".btnEdit[data-flag='save']");

      //   // Add event listener for "Lưu" button
      //   btnSave.addEventListener("click", async () => {
      //     // Get the values of the inputs
      //     const newNumberPhone = inputNb.value;
      //     const newNameReceiver = inputName.value;
      //     const newAddress = inputAdd.value;

      //     // Call the API to update the order
      //     const response = await fetch(
      //       `http://localhost:8080/api/order/update?id=${order.id}`,
      //       {
      //         method: "PUT",
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //           "Content-Type": "application/json",
      //         },
      //         body: JSON.stringify({
      //           numberPhone: newNumberPhone,
      //           nameReceiver: newNameReceiver,
      //           address: newAddress,
      //         }),
      //       }
      //     );

      //     // If the update is successful, reload

      //     // If the update is successful, reload the orders
      //     if (response.ok) {
      //       window.location.reload();
      //     }
      //   });
      // });
    });
  } catch (error) {
    console.error(error);
  }
};

//===
setTimeout(() => {
  const buttons = document.querySelectorAll(".btnDetail");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const orderId = event.target.dataset.id;
      fetch(`http://localhost:8080/api/order/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.items);
          items = data.items;
          const tableBody = document.querySelector(".childTable");
          const Body = document.querySelector(".bodyChild");
          Body.innerHTML = "";
          items.map((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.product.name}</td>
            <td>${item.quantity}</td>
            <td>${item.product.price}</td>
            <td>${item.price}</td>
           
          `;
            Body.appendChild(row);
          });
        });
    });
  });
}, 1000);
//name
const user = document.querySelector("#userName");
user.innerText = dataa.fullName;

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("data");
  localStorage.removeItem("token");
  window.location.href = "/HTML/login.html";
});
