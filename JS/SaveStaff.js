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
const fetchStaffData = async () => {
  const staffId = getParameterByName("staff_id");

  if (staffId) {
    try {
      const response = await fetch(`http://localhost:8084/staff/${staffId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

const getGenderString = (gender) => {
  return gender ? "male" : "female";
};

// Function to populate the form fields with the fetched data
const populateForm = (data) => {
  document.getElementById("staffName").value = data.name || "";
  document.getElementById("staffEmail").value = data.email || "";
  document.getElementById("staffPhone").value = data.phone || "";
  document.getElementById("staffIDCard").value = data.personId || "";
  document.getElementById("staffAddress").value = data.address || "";
  document.getElementById("staffGender").value = getGenderString(data.gender);
  document.getElementById("staffDOB").value = data.birthday || "";
};

// Fetch data when the page loads
window.addEventListener("DOMContentLoaded", () => {
  fetchStaffData();
});

// Function to get form data
const getFormData = () => {
  return {
    name: document.getElementById("staffName").value,
    email: document.getElementById("staffEmail").value,
    phone: document.getElementById("staffPhone").value,
    personId: document.getElementById("staffIDCard").value,
    address: document.getElementById("staffAddress").value,
    gender: document.getElementById("staffGender").value === "male", // assuming the value 'male' indicates 'Nam'
    birthday: document.getElementById("staffDOB").value,
  };
};

// Function to handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  const staffId = getParameterByName("staff_id");
  const formData = getFormData();

  try {
    let url = "http://localhost:8084/staff";
    let method = "POST";

    if (staffId) {
      url += `/${staffId}`;
      method = "PUT";
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert("Lưu thành công!");
      window.location.href = "../HTML/Staff.html";
    } else {
      alert("Không thể lưu được!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi lưu!");
  }
};

// Event listener for form submission
document.getElementById("createStaffForm").addEventListener("submit", handleSubmit);
