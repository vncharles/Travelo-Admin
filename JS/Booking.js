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
const renderOrders = async () => {
  try {
    const orders = await fetchOrders();
    const tbody = document.querySelector("#category-list");

    // Remove all rows
    tbody.innerHTML = "";

    // Render each order as a row
    console.log("Data render: " + orders);
    orders.forEach((booking) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                            <td>${booking.id}</td>
                            <td>${booking.numberPerson}</td>
                            <td>${booking.createdAt}</td>
                            <td>${booking.status}</td>
                            <td>${booking.totalPrice}</td>
                            <td>${booking.customer.email}</td>
                            <td>${booking.tour.tourInfo.name}</td>
                            <td>${booking.tour.startDate}</td>
                            <td>${booking.tour.endDate}</td>
                            <td>
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
       const confirmation = confirm("Bạn có chắc muốn xoá nhân viên này không?");
       if (confirmation) {
         fetch(`http://localhost:8084/booking/${bookingId}`, {
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
 window.location.href = "form-booking.html";
});