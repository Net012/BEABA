document.addEventListener("DOMContentLoaded", async function () {
  const numeroCamposInput = document.getElementById("numCampos");
  const tabelaCampos = document.getElementById("tabelaCampos");
  const criarTemplateBtn = document.getElementById("criarTemplateBtn");

  numeroCamposInput.addEventListener("change", async function () {
    const numCampos = parseInt(numeroCamposInput.value);
    tabelaCampos.innerHTML = "";

    const campos = await getCampos();

    for (let i = 1; i <= numCampos; i++) {
      const novaDiv = document.createElement("div");
      novaDiv.className = "campo-container";

      const divNome = document.createElement("div");
      const labelNome = document.createElement("label");
      labelNome.textContent = `Campo ${i}:`;
      divNome.appendChild(labelNome);
      novaDiv.appendChild(divNome);

      const divSelectENulo = document.createElement("div");

      const celulaSelect = document.createElement("div");
      const select = document.createElement("select");
      select.className = "form-select";
      select.name = `campo${i}`;

      campos.forEach((campo) => {
        const option = document.createElement("option");
        option.value = campo.id;
        option.text = campo.nome;
        option.dataset.tipoId = campo.tipoId;
        select.appendChild(option);
      });

      celulaSelect.appendChild(select);
      divSelectENulo.appendChild(celulaSelect);
      novaDiv.appendChild(divSelectENulo);
      tabelaCampos.appendChild(novaDiv);
    }
  });

  async function getCampos() {
    const response = await fetch("http://localhost:3300/campos");
    const campos = await response.json();
    return campos;
  }

  async function getInformacoesUsuario() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3300/validaToken", {
      method: "POST",
      headers: {
        "x-access-token": token,
      },
    });

    const resposta = await response.json();

    const informacoesUsuario = {
      id: resposta.id,
      squadId: resposta.squadId,
    };

    return informacoesUsuario;
  }

  async function getTemplateExtensao(formatoArquivo) {
    const response = await fetch(
      `http://localhost:3300/extensoes/${formatoArquivo}`
    );
    const extensão = await response.json();

    console.log(extensão);

    console.log(extensão.id);

    return extensão.id;
  }

  criarTemplateBtn.addEventListener("click", async function () {
    const nomeTemplate = document.getElementById("nomeTemplate").value;
    const numCampos = parseInt(numeroCamposInput.value);

    if (!nomeTemplate || nomeTemplate === "") {
      Swal.fire({
        title: "Por favor, insira um nome para o template.",
        icon: "error",
        confirmButtonText: "Entendi",
      });
      return;
    }

    if (isNaN(numCampos) || numCampos <= 0) {
      Swal.fire({
        title: "Por favor, insira um número válido de campos.",
        icon: "error",
        confirmButtonText: "Entendi",
      });
      return;
    }

    const camposArray = [];

    for (let i = 1; i <= numCampos; i++) {
      const campoSelect = document.querySelector(`select[name="campo${i}"]`);

      const campoId = campoSelect.value;

      camposArray.push(campoId);
    }

    const informacoesUsuario = await getInformacoesUsuario();

    const usuarioId = informacoesUsuario.id;
    const squadId = informacoesUsuario.squadId;

    const formatoArquivo = document.getElementById("formatoArquivo").value;

    const extensaoId = await getTemplateExtensao(formatoArquivo);

    body = {
      nome: nomeTemplate,
      extensaoId,
      campos: camposArray,
      usuarioId,
      statusId: 1,
      squadId,
    };

    const response = await fetch("http://localhost:3300/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nomeTemplate,
        extensaoId,
        campos: camposArray,
        usuarioId,
        statusId: 1,
        squadId,
      }),
    });

    const resposta = await response.json();

    if (resposta.message == "Template criado com sucesso") {
      Swal.fire({
        title: "Sucesso!",
        text: "Template criado com sucesso.",
        icon: "success",
        confirmButtonText: "Entendi",
      });
    } else {
      Swal.fire({
        title: "Erro ao criar o template",
        text: resposta.message,
        icon: "error",
        confirmButtonText: "Entendi",
      });
    }
  });
});
