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

document.addEventListener('DOMContentLoaded', () => {
  const tourInfoId = getParameterByName("tour_info_id");
  if (tourInfoId) {
    fetchTourInfoData(tourInfoId);
    
  } else {
    // Nếu không có tour_info_id, cho phép người dùng tạo mới
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    document.getElementById('createStaffForm').addEventListener('submit', handleFormSubmit);
  }
  fetchLocationData();
});

const fetchTourInfoData = async (tourInfoId) => {
  try {
    const response = await fetch(`http://localhost:8084/tour-info/${tourInfoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      populateForm(data);
    } else {
      console.error("Failed to fetch tour info data");
    }
  } catch (error) {
    console.error("Error fetching tour info data:", error);
  }
};

const fetchLocationData = async () => {
  try {
    const response = await fetch(`http://localhost:8084/location`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      populateFormLocation(data);
    } else {
      console.error("Failed to fetch tour info data");
    }
  } catch (error) {
    console.error("Error fetching tour info data:", error);
  }
};

let currentLocation;
const populateForm = (data) => {
  if (data) {
    currentLocation = data.location.province;
    document.getElementById("tourName").value = data.name || "";
    document.getElementById("tourDescription").value = data.description || "";
    document.getElementById("price").value = data.price || "";
    document.getElementById("tourItinerary").value = data.itinerary || "";
    displayImages(data.images);
  }
};

const populateFormLocation = (data) => {
  let selected = document.getElementById("tourLocation");
  const tourInfoId = getParameterByName("tour_info_id");

  data.forEach(item => {
    // Tạo option mới
    let option = document.createElement("option");
            
    // Set giá trị và text
    option.value = item.id;
    option.text = item.province;
    
    // Thêm vào select
    selected.appendChild(option);
    if(tourInfoId) selectOptionByName("tourLocation", currentLocation);
  })
}

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

const displayImages = (images) => {
  const imageList = document.getElementById('imageList');
  imageList.innerHTML = '';

  console.log("Images: "+ images);

  images.forEach(image => {
    const imageElement = document.createElement('img');
    imageElement.src = image.imageUri;
    imageElement.classList.add('uploaded-image');
    imageList.appendChild(imageElement);
  });
};

const handleImageUpload = (e) => {
  const files = e.target.files;
  displayImagesFromFiles(files);
};

const displayImagesFromFiles = (files) => {
  const imageList = document.getElementById('imageList');
  imageList.innerHTML = '';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function(e) {
      const imageElement = document.createElement('img');
      imageElement.src = e.target.result;
      imageElement.classList.add('uploaded-image');
      imageList.appendChild(imageElement);
    };

    reader.readAsDataURL(file);
  }
};

const getFormData = () => {
  return {
    name: document.getElementById("tourName").value,
    description: document.getElementById("tourDescription").value,
    price: document.getElementById("price").value,
    itinerary: document.getElementById("tourItinerary").value,
    locationId: document.getElementById("tourLocation").value
    // Lấy dữ liệu địa điểm và ảnh từ form
    // ... 
  };
};

const handleFormSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('data', JSON.stringify(getFormData())); // Adding JSON data

  const tourInfoId = getParameterByName("tour_info_id");
  const apiUrl = tourInfoId
    ? `http://localhost:8084/tour-info/${tourInfoId}`
    : "http://localhost:8084/tour-info";

  const imageUpload = document.getElementById("imageUpload");
  for (let i = 0; i < imageUpload.files.length; i++) {
    formData.append('images', imageUpload.files[i]); // Adding each image file
  }

  const method = tourInfoId ? "PUT" : "POST";

  try {
    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert("Lưu thành công!");
      window.location.href = "TourInfo.html";
    } else {
      alert("Không thể lưu được!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi lưu!");
  }
};

document.getElementById("createStaffForm").addEventListener("submit", handleFormSubmit);
