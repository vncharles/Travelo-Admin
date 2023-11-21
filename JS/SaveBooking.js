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
    const bookingId = getParameterByName("booking_id");

    if (bookingId) {
        try {
            const response = await fetch(`http://localhost:8084/booking/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                populateForm(data);
            } else {
                console.error("Failed to fetch staff data");
                const errData = response.json();
                alert("Lỗi " + errData.message);
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
        const bookingId = getParameterByName("booking_id");
        let urlRequest;
        if(bookingId) urlRequest = "http://localhost:8084/tour-info";
        else urlRequest = "http://localhost:8084/tour"
        const response = await fetch(urlRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            populateFormTourInfo(data);
            populateStatusBooking();
            console.log(data);
        } else {
            console.error("Failed to fetch staff data");
            const errData = response.json();
            alert("Lỗi " + errData.message);
        }
    } catch (error) {
        console.error("Error fetching staff data:", error);
    }

};

const getGenderString = (gender) => {
    return gender ? "male" : "female";
};
let tourInfoName;
let currentBookingStatus;
// Function to populate the form fields with the fetched data
const populateForm = (data) => {
    tourInfoName = data.tour.tourInfo.name;
    currentBookingStatus = data.status;
    console.log(data.tour.tourInfo.name);
    console.log(data);
    if (data) {
        // document.getElementById("tourCreateAt").value = data.createAt || "";
        document.getElementById("bookingEmail").value = data.customer.email || "";
        document.getElementById("bookingName").value = data.customer.name || "";
        document.getElementById("bookingPhone").value = data.customer.phone || "";
        document.getElementById("bookingAddress").value = data.customer.address || "";
        document.getElementById("bookingNumberPerson").value = data.numberPerson || "";
        // document.getElementById("staffDOB").value = data.birthday || "";
    }
};
// Lấy theo tourInfo name
const populateFormTourInfo = (data) => {
        let selectEl = document.getElementById('bookingNameTour');
        const bookingId = getParameterByName("booking_id");
        // Duyệt qua các phần tử trong data
        data.forEach(item => {

            // Tạo option mới
            let option = document.createElement("option");
            
            if(bookingId) {
                option.value = item.id;
                option.text = item.name;
            } else {
                option.value = item.tourInfo.id;
                option.text = item.tourInfo.name;
            }
            
            
            // Thêm vào select
            selectEl.appendChild(option);
            selectOptionByName("bookingNameTour", tourInfoName);
        })
};

// set status
const populateStatusBooking = () => {
    let selectEl = document.getElementById('bookingStatus');


        // Tạo option mới
        let option1 = document.createElement("option");
        option1.value = "NEW";
        option1.text = "Đã khởi tạo";
        selectEl.appendChild(option1);

        let option2 = document.createElement("option");
        option2.value = "UNPAID";
        option2.text = "Chưa thanh toán";
        selectEl.appendChild(option2);

        let option3 = document.createElement("option");
        option3.value = "PAID";
        option3.text = "Đã thanh toán";
        selectEl.appendChild(option3);

        let option4 = document.createElement("option");
        option4.value = "DONE";
        option4.text = "Hoàn thành";
        selectEl.appendChild(option4);

        let option5 = document.createElement("option");
        option5.value = "CANCEL";
        option5.text = "Đã hủy";
        selectEl.appendChild(option5);

        selectOptionStatus("bookingStatus", currentBookingStatus);
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

  function selectOptionStatus(selectId, name) {
    console.log("Name status: " + name);
    let selectEl = document.getElementById(selectId);
    
    selectEl.selectedIndex = -1;
  
    let options = selectEl.options;

    for(let i = 0; i < options.length; i++) {
      if(options[i].value === name) {
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
            // createAt: document.getElementById("tourCreateAt").value,
            email: document.getElementById("bookingEmail").value,
            name: document.getElementById("bookingName").value,
            phone: document.getElementById("bookingPhone").value,
            address: document.getElementById("bookingAddress").value,
            tourId: document.getElementById("bookingNumberPerson").value,
            numberPerson: document.getElementById("bookingNumberPerson").value,
            status: document.getElementById("bookingStatus").value
        };
    };


    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const staffId = getParameterByName("booking_id");
        const formData = getFormData();

        try {
            let url = "http://localhost:8084/booking";
            let method = "POST";

            if (staffId) {
                url += `/${staffId}`;
                method = "PUT";
            } else url += "/staff-create";

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
                window.location.href = "Booking.html";
            } else {
                const errData = await response.json();
                console.log(errData);
                alert("Lỗi " + errData.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Có lỗi xảy ra khi lưu!");
        }
    };

    // Event listener for form submission
    document.getElementById("createBookingForm").addEventListener("submit", handleSubmit);
