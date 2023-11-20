const form = document.getElementById("login-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = {
    password,
    email: username,
  };

  try {
    const response = await fetch("http://localhost:8084/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to login.");
    }

    const responseData = await response.json();
    if (responseData.role !== "ROLE_ADMIN") {
      alert("Bạn không có quyền truy cập trang này.");
      return;
    }
    localStorage.setItem("data", JSON.stringify(responseData));
    window.location.href = "../HTML/Booking.html";
  } catch (error) {
    console.error(error);
    alert(
      "Đăng nhập không thành công. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu."
    );
  }
});
