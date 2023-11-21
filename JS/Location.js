const dataa = JSON.parse(localStorage.getItem("data"));
const token = dataa.token;
document.addEventListener("DOMContentLoaded", async() => {
    await renderOrders();
});

const fetchOrders = () => {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:8084/location", {
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
const renderOrders = async() => {
    try {
        const orders = await fetchOrders();
        const tbody = document.querySelector("#category-list");

        // Remove all rows
        tbody.innerHTML = "";

        // Render each order as a row
        console.log("Data render: " + orders);
        orders.forEach((location) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                            <td>${location.id}</td>
                            <td>${location.province}</td>
                            <td>${location.description}</td>
                            <td>
                              <button class="btn-edit" data-id="${location.id}">Sửa</button>
                          </td>
      `;
            tbody.appendChild(tr);

            // Adding event listener to each "Edit" button
            const editButton = tr.querySelector(".btn-edit");
            editButton.addEventListener("click", () => {
                const locationId = location.id;
                // Redirect to form-staff.html with staff_id parameter
                window.location.href = `form-location.html?location_id=${locationId}`;
            });
            // Adding event listener to each "Delete" button
            // const deleteButton = tr.querySelector(".btn-delete");
            // deleteButton.addEventListener("click", () => {
            //     const locationId = location.id;
            //     const confirmation = confirm(
            //         "Bạn có chắc muốn xoá nhân viên này không?"
            //     );
            //     if (confirmation) {
            //         fetch(`http://localhost:8084/location/${locationId}`, {
            //                 method: "DELETE",
            //                 headers: {
            //                     Authorization: `Bearer ${token}`,
            //                 },
            //             })
            //             .then((response) => {
            //                 if (response.status === 200) {
            //                     alert("Xoá thành công");
            //                     location.reload(); // Reload the page after successful deletion
            //                 } else {
            //                     console.log(response);
            //                     throw new Error("Delete request failed");
            //                 }
            //             })
            //             .catch((error) => {
            //                 console.error("Delete request error:", error);
            //                 alert("Xoá không thành công");
            //             });
            //     }
            // });
        });
    } catch (error) {
        console.error(error);
    }
};