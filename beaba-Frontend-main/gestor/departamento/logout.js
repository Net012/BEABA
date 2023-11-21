document.addEventListener("DOMContentLoaded", async function () {
  const logoutBtn = document.getElementById("sair");

  logoutBtn.addEventListener("click", async () => {
    localStorage.removeItem("token");
    window.location.href = "../../login/login.html";
  });
});
