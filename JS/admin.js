const name = document.querySelector(".user-name");
const data = JSON.parse(localStorage.getItem("data"));
console.log(data);
name.innerText = data.fullName;
console.log(name);

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("data");
  localStorage.removeItem("token");
  window.location.href = "/HTML/login.html";
});
