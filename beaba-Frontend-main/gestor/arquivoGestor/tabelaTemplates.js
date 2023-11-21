document.addEventListener("DOMContentLoaded", async function () {
  let usuarioId;

  let squadId;

  const dados = await GetTemplates();

  const formatos = await fetch("http://localhost:3300/extensoes");

  const formatosPossiveis = await formatos.json();

  async function GetTemplates() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3300/validaToken", {
      method: "POST",
      headers: {
        "x-access-token": token,
      },
    });

    const serverResponse = await response.json();

    usuarioId = serverResponse.id;

    squadId = serverResponse.squadId;

    try {
      const response = await fetch(
        `http://localhost:3300/templates/comum/squad/${squadId}`
      );
      if (response.ok) {
        const dados = await response.json();
        return dados;
      } else {
        Swal.fire({
          title: 'Erro ao obter dados do banco de dados',
          text: 'Ocorreu um erro ao obter os dados do banco de dados. Por favor, tente novamente mais tarde.',
          icon: 'error',
          confirmButtonText: 'Entendi'
      });
      }
    } catch (error) {
      Swal.fire({
        title: 'Erro ao obter dados do banco de dados',
        text: 'Ocorreu um erro ao obter os dados do banco de dados. Por favor, tente novamente mais tarde.',
        icon: 'error',
        confirmButtonText: 'Entendi'
    });
    }
  }

  async function preencherTabelaComDados() {
    const tabela = document.getElementById("bodyTabela");

    tabela.innerHTML = "";

    dados.forEach((item) => {
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
              <button class="btn btn-secondary visualizar-template" data-template-id="${item.id}">Visualizar</button>
          </td>
          <td class="">
              <button class="btn btn-success" data-template-id="${item.id}">Enviar</button>
          </td>
      `;

      const botaoVisualizar = newRow.querySelector(".visualizar-template");

      botaoVisualizar.addEventListener("click", async () => {
        const templateId = botaoVisualizar.getAttribute("data-template-id");

        const templates = dados;

        const template = templates.find(
          (template) => template.id == templateId
        ).id;

        preencherModalComDados(template);
      });

      const botaoEnviar = newRow.querySelector(".btn-success");

      botaoEnviar.addEventListener("click", async () => {
        const templateId = botaoEnviar.getAttribute("data-template-id");
        const itemParaEnviar = dados.find((item) => item.id == templateId);

        if (itemParaEnviar) {
          const headerTitle = document.getElementById(
            "enviarArquivoModalLabel"
          );
          headerTitle.textContent =
            "Template Escolhido: " + itemParaEnviar.nome;

          const modalEnviarArquivo =
            document.getElementById("enviarArquivoModal");
          modalEnviarArquivo.dataset.templateId = templateId;

          const bootstrapModalEnviarArquivo = new bootstrap.Modal(
            modalEnviarArquivo
          );
          bootstrapModalEnviarArquivo.show();
        }
      });
    });
  }

  async function preencherModalComDados(id) {
    const item = dados.find((item) => item.id == id);

    console.log(item);

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

      thead.innerHTML = "";
      tbody.innerHTML = "";

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

      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  document
    .getElementById("enviarArquivoButton")
    .addEventListener("click", async () => {
      const arquivoInput = document.getElementById("arquivoInput");
      const arquivo = arquivoInput.files[0];

      if (arquivo) {
        const nomeArquivo = arquivo.name;

        if (
          nomeArquivo.endsWith(".xlsx") ||
          nomeArquivo.endsWith(".xls") ||
          nomeArquivo.endsWith(".csv")
        ) {
          const testeArquivo = await fetch(
            `http://localhost:3300/uploads/${nomeArquivo}`
          );

          const testeArquivoResponse = await testeArquivo.json();

          if (testeArquivoResponse.message == "Arquivo já existe") {
            Swal.fire({
              title: 'Arquivo já existe',
              text: 'O arquivo que você está tentando enviar já existe no banco de dados. Por favor, renomeie o arquivo e tente novamente.',
              icon: 'warning',
              confirmButtonText: 'Entendi'
          });
          } else {
            const templateId =
              document.getElementById("enviarArquivoModal").dataset.templateId;

            const dadosEnvio = {
              templateId,
              arquivo,
            };

            enviarArquivo(dadosEnvio);
          }
        } else {
          Swal.fire({
            title: 'Formato de arquivo inválido',
            text: 'O arquivo que você está tentando enviar não possui um formato válido. Por favor, selecione um arquivo com formato .xlsx, .xls ou .csv.',
            icon: 'warning',
            confirmButtonText: 'Entendi'
        });
        }
      } else {
        Swal.fire({
          title: 'Arquivo não selecionado',
          text: 'Por favor, selecione um arquivo para enviar.',
          icon: 'warning',
          confirmButtonText: 'Entendi'
      });
      }
    });

  async function enviarArquivo(dadosEnvio) {
    const diretorio = document.getElementById("diretorioInput").value;

    const templateId = dadosEnvio.templateId;

    const arquivo = dadosEnvio.arquivo;

    const nomeArquivo = arquivo.name;

    const formData = new FormData();
    formData.append("templateId", templateId);
    formData.append("arquivo", arquivo);
    formData.append("nomeArquivo", nomeArquivo);
    formData.append("usuarioId", usuarioId);
    formData.append("squadId", squadId);
    formData.append("diretorio", diretorio);

    const request = await fetch("http://localhost:3300/uploads", {
      method: "POST",
      body: formData,
    });

    const response = await request.json();

    if(response.message == "Verificação e Upload do arquivo realizado com sucesso"){
      Swal.fire({
        title: 'Arquivo enviado com sucesso',
        text: 'O arquivo foi validado e salvo com sucesso no banco de dados.',
        icon: 'success',
        confirmButtonText: 'Entendi'
    });
    } else{
      Swal.fire({
        title: 'Erro ao enviar arquivo',
        text: response.message,
        icon: 'error',
        confirmButtonText: 'Entendi'
    });
    }
  }

  preencherTabelaComDados();
});
