document.addEventListener("DOMContentLoaded", async function () {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      "x-access-token": token,
    };

    const response = await fetch("http://localhost:3300/validaToken", {
      method: "POST",
      headers: headers,
    });

    const resposta = await response.json();

    if (resposta.message === "Administrador") {
    } else if (resposta.message === "Gestor") {
      window.location.href = "../../gestor/templatesGestor/template.html";
    } else if (resposta.message === "Comum") {
      window.location.href = "../../usuarioComum/templatesComum/templates.html";
    } else if (resposta.message === "Pendente") {
      window.location.href = "../../cadastroPendente/cadastroPendente.html";
    } else {
      window.location.href = "../../login/login.html";
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    window.location.href = "../../login/login.html";
  }
});
