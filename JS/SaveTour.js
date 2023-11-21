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
    const tourId = getParameterByName("tour_id");

    if (tourId) {
        try {
            const response = await fetch(`http://localhost:8084/tour/${tourId}`, {
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

const fetchStaffDataTourInfo = async () => {
    // const tourId = getParameterByName("tour_id");

    // if (tourId) {
    try {
        const response = await fetch(`http://localhost:8084/tour-info`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            populateFormTourInfo(data);
        } else {
            console.error("Failed to fetch staff data");
        }
    } catch (error) {
        console.error("Error fetching staff data:", error);
    }

};

const getGenderString = (gender) => {
    return gender ? "male" : "female";
};
let tourInfoName;
// Function to populate the form fields with the fetched data
const populateForm = (data) => {
    tourInfoName = data.tourInfo.name;
    console.log(data.tourInfo.name);
    if (data) {
        document.getElementById("tourCreateAt").value = data.createAt || "";
        document.getElementById("tourstartDate").value = data.startDate || "";
        document.getElementById("tourEndDate").value = data.endDate || "";
        document.getElementById("tourPrice").value = data.price || "";
        document.getElementById("tourStock").value = data.stock || "";
        // document.getElementById("staffDOB").value = data.birthday || "";
    }
};
// Lấy theo tourInfo name
const populateFormTourInfo = (data) => {
        let selectEl = document.getElementById('tourNameTest');

        // Duyệt qua các phần tử trong data
        data.forEach(item => {

            // Tạo option mới
            let option = document.createElement("option");
            
            // Set giá trị và text
            option.text = item.name;
            
            // Thêm vào select
            selectEl.appendChild(option);
            selectOptionByName("tourNameTest", tourInfoName);
        })
};

function selectOptionByName(selectId, name) {

    let selectEl = document.getElementById(selectId);
    
    selectEl.selectedIndex = -1;
  
    let options = selectEl.options;

    for(let i = 0; i < options.length; i++) {
      if(options[i].text === name) {
        options[i].selected = true;
        return;
      }
    }
  
    options[0].selected = true; // Mặc định option đầu tiên
  
  }




    // Fetch data when the page loads
    window.addEventListener("DOMContentLoaded", () => {
        fetchStaffData();
        fetchStaffDataTourInfo();
    });

    // Function to get form data
    const getFormData = () => {
        return {
            createAt: document.getElementById("tourCreateAt").value,
            startDate: document.getElementById("tourstartDate").value,
            endDate: document.getElementById("tourEndDate").value,
            price: document.getElementById("tourPrice").value,
            stock: document.getElementById("tourStock").value,
        };
    };


    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const staffId = getParameterByName("tour_id");
        const formData = getFormData();

        try {
            let url = "http://localhost:8084/tour";
            let method = "POST";

            if (staffId) {
                url += `/${staffId}`;
                method = "PUT";
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });



            console.log(formData);

            if (response.ok) {
                alert("Lưu thành công!");
                window.location.href = "Tour.html";
            } else {
                alert("Không thể lưu được!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Có lỗi xảy ra khi lưu!");
        }
    };

    // Event listener for form submission
    document.getElementById("createTourForm").addEventListener("submit", handleSubmit);
