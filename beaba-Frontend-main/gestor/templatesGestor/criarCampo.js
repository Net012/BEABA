document.addEventListener("DOMContentLoaded", async function () {
  const modal = document.getElementById("criarCampoModal");

  const criarCampoModal = new bootstrap.Modal(modal);

  const criarCampoBtn = document.getElementById("criarCampoBtn");
  criarCampoBtn.addEventListener("click", function () {
    criarCampoModal.show();
  });

  const salvarCampoBtn = document.querySelector(
    "#criarCampoModal button.btn-success"
  );
  salvarCampoBtn.addEventListener("click", async function () {

    const nomeCampo = document.getElementById("nomeCampo").value;
    const tipoCampo = document.getElementById("tipoCampo").value;

    if (nomeCampo === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "O nome do campo não pode ser vazio!",
      });
      return;
    }

    if (tipoCampo === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "O tipo do campo não pode ser vazio!",
      });
      return;
    }

    const tipoCriar = await getTipoId(tipoCampo);

    const request = await fetch("http://localhost:3300/campos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nomeCampo,
        tipoId: tipoCriar,
      }),
    });

    const response = await request.json();

    if (!response.message == "Campo criado com sucesso") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo deu errado!",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Campo criado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    criarCampoModal.hide();

    document.getElementById("nomeCampo").value = "";
    document.getElementById("tipoCampo").value = "texto";
  });

  async function getTipoId(nomeTipo) {
    if (nomeTipo === "numero") {
      nomeTipo = "Número";
    }

    const request = await fetch(`http://localhost:3300/tipos/${nomeTipo}`);

    const response = await request.json();

    console.log(response);

    return response.data.id;
  }
});
