const form = document.getElementById("cadastroForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const matricula = document.getElementById("Matricula").value;
  const nome = document.getElementById("Nome").value;
  const email = document.getElementById("Email").value;
  const senha = document.getElementById("Senha").value;
  const repSenha = document.getElementById("repSenha").value;
  const squadInput = document.getElementById("Departamento").value;

  const squads = await fetch("http://localhost:3300/squads");
  const squadsJson = await squads.json();
  const squadId = squadsJson.find((squad) => squad.nome === squadInput).id;

  if (senha !== repSenha) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Senhas não coincidem!",
    });
    return;
  }

  const data = {
    nome,
    matricula,
    email,
    senha,
    cargoId: 4,
    squadId,
  };

  fetch("http://localhost:3300/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        if (data.message === "Usuário criado com sucesso") {
          window.location.href = "../cadastroPendente/cadastroPendente.html";
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Erro ao enviar dados para o servidor",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Erro ao enviar dados para o servidor",
      });
    });
});
