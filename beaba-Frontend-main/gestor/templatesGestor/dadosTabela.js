document.addEventListener("DOMContentLoaded", async function () {
  const formatos = await fetch("http://localhost:3300/extensoes");

  const formatosPossiveis = await formatos.json();

  const dados = await GetTemplates();

  async function GetTemplates() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3300/validaToken", {
      method: "POST",
      headers: {
        "x-access-token": token,
      },
    });

    const squadId = (await response.json()).squadId;

    try {
      const response = await fetch(
        `http://localhost:3300/templates/squad/${squadId}`
      );
      if (response.ok) {
        const dados = await response.json();
        return dados;
      } else {
        console.error("Falha ao obter dados do banco de dados");
      }
    } catch (error) {
      console.error("Erro ao obter dados do banco de dados:", error);
    }
  }

  async function preencherTabelaComDados() {
    const tabela = document.getElementById("bodyTabela");

    tabela.innerHTML = "";

    const status = await fetch("http://localhost:3300/status");
    const statusPossiveis = await status.json();

    dados.forEach((item) => {
      const status = statusPossiveis.find(
        (status) => status.id === item.statusId
      ).nome;

      const dataBanco = item.data_criacao;

      const data = new Date(dataBanco);

      const dataFormatada =
        data.toLocaleDateString("pt-BR") +
        " " +
        data.toLocaleTimeString("pt-BR");

      const newRow = tabela.insertRow();
      newRow.innerHTML = `
        <td>${item.nome}</td>
        <td>${dataFormatada}</td>
        <td>
            <select class="form-select" id="statusSelect">
                <option value="Ativo" ${
                  status === "Ativo" ? "selected" : ""
                }>Ativo</option>
                <option value="Inativo" ${
                  status === "Inativo" ? "selected" : ""
                }>Inativo</option>
                <option value="Pendente" ${
                  status === "Pendente" ? "selected" : ""
                }>Pendente</option>
            </select>
        </td>
        <td class="linha-final">
            <button class="btn btn-secondary visualizar-template" data-template-id="${
              item.id
            }">Visualizar</button>
        </td>
    `;

      const botaoVisualizar = newRow.querySelector(".visualizar-template");
      botaoVisualizar.addEventListener("click", async () => {
        const templateId = botaoVisualizar.getAttribute("data-template-id");

        const templates = await GetTemplates();

        const template = templates.find(
          (template) => template.id == templateId
        ).id;

        preencherModalComDados(template);
      });

      const statusSelect = newRow.querySelector("#statusSelect");
      statusSelect.addEventListener("change", async () => {
        const statusInput = statusSelect.value;
        const status = await fetch("http://localhost:3300/status");
        const statusPossiveis = await status.json();
        const novoStatus = statusPossiveis.find(
          (status) => status.nome === statusInput
        ).id;
        const nomeTemplate = newRow.cells[0].textContent;
        try {
          const response = await fetch("http://localhost:3300/templates", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome: nomeTemplate,
              status: novoStatus,
            }),
          });

          if (response.status === 200) {
            console.log(
              `Status do template ${nomeTemplate} atualizado para: ${novoStatus}`
            );
          } else {
            Swal.fire({
              title: "Erro!",
              text: "Erro ao atualizar status do template.",
              icon: "error",
              confirmButtonText: "Entendi",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Erro!",
            text: "Erro ao atualizar status do template.",
            icon: "error",
            confirmButtonText: "Entendi",
          });
        }
      });
    });
  }

  async function preencherModalComDados(id) {
    const item = dados.find((item) => item.id == id);

    if (item) {
      const camposTemplates = await fetch(
        `http://localhost:3300/templatesCampos/${item.id}`
      );

      const camposTemplatesResponse = await camposTemplates.json();

      const modal = document.getElementById("visualizarTemplateModal");
      const modalFormatoArquivo = modal.querySelector("#modal-formatoArquivo");
      const modalNomeTemplate = modal.querySelector("#modal-nome-template");

      const thead = document.getElementById("modal-theadCampos");

      const tbody = document.getElementById("modal-tabelaCampos");

      const tfooter = document.getElementById("modal-footer");

      thead.innerHTML = "";
      tbody.innerHTML = "";
      tfooter.innerHTML = "";

      const formatoArquivo = formatosPossiveis.find(
        (formato) => formato.id === item.extensaoId
      ).nome;

      modalFormatoArquivo.textContent = formatoArquivo;
      modalNomeTemplate.textContent = item.nome;

      thead.innerHTML = `
            <tr>
                <th>Nome do Campo</th>
                <th>Tipo do Campo</th>
            </tr>
            `;

      const tipos = await fetch("http://localhost:3300/tipos");

      const tiposPossiveis = await tipos.json();

      camposTemplatesResponse.forEach(async (campo) => {
        const criadoPor = document.getElementById("criadoPor");

        const responseUsuario = await fetch(
          `http://localhost:3300/usuarios/id/${item.usuarioId}`
        );

        const usuario = await responseUsuario.json();

        criadoPor.textContent = "Criado por: " + usuario.data.nome;

        const campoId = campo.campoId;

        const response = await fetch(`http://localhost:3300/campos/${campoId}`);
        const campoResponse = await response.json();

        const tipo = tiposPossiveis.find(
          (tipo) => tipo.id === campoResponse.tipoId
        ).nome;

        const newRow = tbody.insertRow();

        newRow.innerHTML = `
                <td>${campoResponse.nome}</td>
                <td>${tipo}</td>
                `;
      });

        tfooter.innerHTML = `
        <button id="excluirBtn" type="button" class="btn btn-danger">
                    Excluir
                  </button>
                  <button
                    id="downloadBtn"
                    type="button"
                    class="btn btn-success"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Fechar
                  </button>
        `;

        const excluirBtn = document.getElementById("excluirBtn");
        const downloadBtn = document.getElementById("downloadBtn");

      excluirBtn.addEventListener("click", async () => {
        const templateId = item.id;

        const tryDelete = await fetch(
          `http://localhost:3300/templates/${templateId}`,
          {
            method: "DELETE",
          }
        );

        const response = await tryDelete.json();

        if (response.message === "Template deletado com sucesso") {
          Swal.fire({
            title: "Sucesso!",
            text: "Template excluído com sucesso.",
            icon: "success",
            confirmButtonText: "Entendi",
          });
          window.location.reload();
        } else {
          Swal.fire({
            title: "Erro!",
            text: "Erro ao excluir template.",
            icon: "error",
            confirmButtonText: "Entendi",
          });
        }
      });

      downloadBtn.addEventListener("click", async () => {
        const templateId = item.id;

        const nomeTemplate = dados.find(
          (template) => template.id == templateId
        ).nome;

        const extensaoId = dados.find(
          (template) => template.id == templateId
        ).extensaoId;

        const nomeExtensao = formatosPossiveis.find(
          (formato) => formato.id === extensaoId
        ).nome;

        const response = await fetch(
          `http://127.0.0.1:5000/download/${templateId}/${extensaoId}`
        );

        const blob = await response.blob();

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = nomeTemplate + "." + nomeExtensao;

        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  preencherTabelaComDados();
});
