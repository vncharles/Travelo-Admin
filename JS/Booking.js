const dataa = JSON.parse(localStorage.getItem("data"));
const token = dataa.token;
document.addEventListener("DOMContentLoaded", async () => {
  await renderOrders();
});

const fetchOrders = () => {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:8084/booking", {
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
    
    orders.forEach((booking) => {
      let status;
      if(booking.status==="NEW") status = "Đã khởi tạo"
      else if(booking.status==="UNPAID") status = "Chưa thanh toán"
      else if(booking.status==="PAID") status = "Đã thanh toán"
      else if(booking.status==="DONE") status = "Hoàn thành"
      else status = "Đã hủy"

      const tr = document.createElement("tr");
      tr.innerHTML = `
                            <td>${booking.id}</td>
                            <td>${booking.tour.tourInfo.name}</td>
                            <td>${booking.numberPerson} người</td>
                            <td>${booking.createdAt}</td>
                            <td>${status}</td>
                            <td>${formatCurrency(booking.totalPrice)}</td>
                            <td>${booking.customer.email}</td>
                            <td>${formatLocalDatetime(booking.tour.startDate)}</td>
                            <td>${formatLocalDatetime(booking.tour.endDate)}</td>
                            <td style="display: flex; align-items: center; gap: 10px;">
                              <button class="btn-edit" data-id="${booking.id}">Sửa</button>
                              <button class="btn-delete" data-id="${booking.id}">Cancel</button>
                          </td>
      `;
      tbody.appendChild(tr);

     // Adding event listener to each "Edit" button
     const editButton = tr.querySelector(".btn-edit");
     editButton.addEventListener("click", () => {
       const bookingId = booking.id;
       // Redirect to form-staff.html with staff_id parameter
       window.location.href = `form-booking.html?booking_id=${bookingId}`;
     });

     // Adding event listener to each "Delete" button
     const deleteButton = tr.querySelector(".btn-delete");
     deleteButton.addEventListener("click", () => {
      const bookingId = booking.id;
      const confirmation = confirm("Bạn có chắc muốn xoá thông tin tour này không?");
      
      if (confirmation) {
        fetch(`http://localhost:8084/booking/${bookingId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              alert("Xoá thành công");
              location.reload(); // Reload the page after successful deletion
            } else {
              return response.json(); // Parse response body as JSON
            }
          })
          .then((errorData) => {
            if (errorData) {
              console.log(errorData); // Log the error data received from the server
              alert(`Xoá không thành công. Lỗi: ${errorData.message}`);
            }
          })
          .catch((error) => {
            console.error("Delete request error:", error);
            alert("Xoá không thành công " + error.message);
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
 window.location.href = "login.html";
});

document.getElementById("add-product-btn").addEventListener("click", function() {
 window.location.href = "form-booking.html";
});