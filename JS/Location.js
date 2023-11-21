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
                            <td style="display: flex; align-items: center;">
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
        });
    } catch (error) {
        console.error(error);
    }
};

document.getElementById("add-product-btn").addEventListener("click", function() {
    window.location.href = "form-location.html";
   });