const dataa = JSON.parse(localStorage.getItem("data"));
const token = dataa.token;
document.addEventListener("DOMContentLoaded", async () => {
  await renderOrders();
});

const fetchOrders = () => {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:8084/tour-info", {
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
    orders.forEach((tourinfo) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                            <td>${tourinfo.id}</td>
                            <td>${tourinfo.name}</td>
                            <td>${tourinfo.description}</td>
                            <td>${tourinfo.createAt}</td>
                            <td>${tourinfo.price}</td>
                            <td>
                              <button class="btn-edit" data-id="${tourinfo.id}">Sửa</button>
                              <button class="btn-delete" data-id="${tourinfo.id}">Xóa</button>
                          </td>
      `;
      tbody.appendChild(tr);

      // Adding event listener to each "Edit" button
      const editButton = tr.querySelector(".btn-edit");
      editButton.addEventListener("click", () => {
        const tourinfoId = tourinfo.id;
        // Redirect to form-staff.html with staff_id parameter
        window.location.href = `form-tour-info.html?tour_info_id=${tourinfoId}`;
      });
      
      const deleteButton = tr.querySelector(".btn-delete");
      deleteButton.addEventListener("click", () => {
        const tourinfoId = tourinfo.id;
        const confirmation = confirm("Bạn có chắc muốn xoá nhân viên này không?");
        if (confirmation) {
          fetch(`http://localhost:8084/tour-info/${tourinfoId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (response.status === 200) {
                alert("Xoá thành công");
                location.reload(); // Reload the page after successful deletion
              } else {
                console.log(response);
                throw new Error("Delete request failed");
              }
            })
            .catch((error) => {
              console.error("Delete request error:", error);
              alert("Xoá không thành công");
            });
        }
      });
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
  window.location.href = "login.html";
});

document.getElementById("add-product-btn").addEventListener("click", function() {
  window.location.href = "form-tour-info.html";
});
