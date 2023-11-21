const dataa = JSON.parse(localStorage.getItem("data"));
const token = dataa.token;

// Function to extract parameters from the URL
const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

// Function to fetch data and populate the form
const fetchStaffData = async() => {
    const locationId = getParameterByName("location_id");

    if (locationId) {
        try {
            const response = await fetch(
                `http://localhost:8084/location/${locationId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                populateForm(data);
            } else {
                console.error("Failed to fetch staff data");
            }
        } catch (error) {
            console.error("Error fetching staff data:", error);
        }
    }
};

// const getGenderString = (gender) => {
//     return gender ? "male" : "female";
// };

// Function to populate the form fields with the fetched data
const populateForm = (data) => {
    if (data) {
        document.getElementById("locationProvince").value = data.province || "";
        document.getElementById("locationDescription").value =
            data.description || "";
    }
};

// Fetch data when the page loads
window.addEventListener("DOMContentLoaded", () => {
    fetchStaffData();
});

// Function to get form data
const getFormData = () => {
    return {
        province: document.getElementById("locationProvince").value,
        description: document.getElementById("locationDescription").value,
    };
};

// Function to handle form submission
const handleSubmit = async(event) => {
    event.preventDefault();

    const locationId = getParameterByName("location_id");
    const formData = getFormData();

    try {
        let url = "http://localhost:8084/location";
        let method = "POST";

        if (locationId) {
            url += `/${locationId}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        console.log(formData);

        if (response.ok) {
            alert("Lưu thành công!");
            window.location.href = "Location.html";
        } else {
            alert("Không thể lưu được!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Có lỗi xảy ra khi lưu!");
    }
};

// Event listener for form submission
document
    .getElementById("createStaffForm")
    .addEventListener("submit", handleSubmit);