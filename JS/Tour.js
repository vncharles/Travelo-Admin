const dataa = JSON.parse(localStorage.getItem("data"));
const token = dataa.token;
document.addEventListener("DOMContentLoaded", async () => {
  await renderOrders();
});

const fetchOrders = () => {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:8084/tour/get-all", {
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

function formatCurrency(number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}
function formatLocalDatetime(datetimeString) {
  const date = new Date(datetimeString);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần +1
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}
const renderOrders = async () => {
  try {
    const orders = await fetchOrders();
    const tbody = document.querySelector("#category-list");

    // Remove all rows
    tbody.innerHTML = "";

    // Render each order as a row
    console.log("Data render: " + orders);
    orders.forEach((tour) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                            <td>${tour.id}</td>
                            <td>${tour.tourInfo.name}</td>
                            <td>${tour.createAt}</td>
                            <td>${formatLocalDatetime(tour.startDate)}</th>
                            <td>${formatLocalDatetime(tour.endDate)} </td>
                            <td>${formatCurrency(tour.price)}</th>
                            <td>${tour.stock} vé</th>
                            <td>
                              <button class="btn-edit" data-id="${tour.id}">Sửa</button>
                              <button class="btn-delete" data-id="${tour.id}">Xóa</button>
                          </td>
      `;
      tbody.appendChild(tr);

     // Adding event listener to each "Edit" button
      const editButton = tr.querySelector(".btn-edit");
      editButton.addEventListener("click", () => {
        const tourId = tour.id;
        // Redirect to form-staff.html with staff_id parameter
        window.location.href = `form-tour.html?tour_id=${tourId}`;
      });

      // Adding event listener to each "Delete" button
      const deleteButton = tr.querySelector(".btn-delete");
      deleteButton.addEventListener("click", () => {
        const tourId = tour.id;
        const confirmation = confirm("Bạn có chắc muốn xoá nhân viên này không?");
        if (confirmation) {
          fetch(`http://localhost:8084/tour/${tourId}`, {
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

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("data");
  localStorage.removeItem("token");
  window.location.href = "/HTML/login.html";
});

document.getElementById("add-product-btn").addEventListener("click", function() {
  window.location.href = "form-tour.html";
});