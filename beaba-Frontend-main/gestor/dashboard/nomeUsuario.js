document.addEventListener("DOMContentLoaded", async function () {
  const userDiv = document.querySelector(".user");

  const h5Element = userDiv.querySelector("h5");

  const nomeUsuario = await verificarToken();

  if (nomeUsuario) {
    h5Element.textContent = nomeUsuario;
  } else {
    console.error("Não foi possível obter o nome do usuário.");
  }
});

async function verificarToken() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      return null;
    }

    const headers = {
      "x-access-token": token,
    };

    const response = await fetch("http://localhost:3300/validaToken", {
      method: "POST",
      headers: headers,
    });

    if (response.status === 200) {
      const data = await response.json();
      if (data) {
        return data.nomeUsuario;
      }
    } else {
      console.error("Erro ao verificar o token:", response.statusText);
    }

    return null;
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return null;
  }
}
