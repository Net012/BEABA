form = document.getElementById("login-form");
const token = localStorage.getItem("token");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const matricula = document.getElementById("Matricula").value;
  const senha = document.getElementById("Senha").value;
  const body = JSON.stringify({ matricula, senha });

  try {
    const response = await fetch("http://localhost:3300/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    const resposta = await response.json();

    if (response.status === 200) {
      const token = resposta.token;

      if (token != localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }

      localStorage.setItem("token", token);

      try {
        const headers = {
          "x-access-token": token,
        };

        const response = await fetch("http://localhost:3300/validaToken", {
          method: "POST",
          headers: headers,
        });

        const resposta = await response.json();

        if (resposta.message === "Administrador") {
          window.location.href = "../admin/perfisDeUsuario/perfisUsuario.html";
        } else if (resposta.message === "Gestor") {
          window.location.href = "../gestor/dashboard/dashboard.html";
        } else if (resposta.message === "Comum") {
          window.location.href =
            "../usuarioComum/templatesComum/templates.html";
        } else if (resposta.message === "Pendente") {
          window.location.href = "../cadastroPendente/cadastroPendente.html";
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Usuario não encontrado, verifique suas credenciais.",
          });
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Erro ao fazer login. Tente novamente mais tarde.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Usuario não encontrado, verifique suas credenciais.",
      });
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Erro ao fazer login. Tente novamente mais tarde.",
    });
  }
});
