document.addEventListener("DOMContentLoaded", async function () {
  const squadId = await getSquadId();

  const uploads = await GetUploads();

  async function getSquadId() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3300/validaToken", {
      method: "POST",
      headers: {
        "x-access-token": token,
      },
    });

    const serverResponse = await response.json();

    return serverResponse.squadId;
  }

  async function GetUploads() {
    try {
      const response = await fetch(
        `http://localhost:3300/uploads/squad/${squadId}`
      );

      const dados = await response.json();

      return dados;
    } catch (error) {
      console.error("Erro ao obter dados de uploads do banco de dados:", error);
    }
  }

  async function GetUsuarios() {
    try {
      const response = await fetch("http://localhost:3300/usuarios");

      const dados = await response.json();

      return dados;
    } catch (error) {
      console.error(
        "Erro ao obter dados de usuarios do banco de dados:",
        error
      );
    }
  }

  async function preencherTabelaComDados() {
    const tabela = document.getElementById("bodyTabela");

    const extensoes = await fetch("http://localhost:3300/extensoes");

    const extensoesDados = await extensoes.json();

    tabela.innerHTML = "";

    const dados = uploads.data;

    const usuarios = await GetUsuarios();

    dados.forEach((item) => {
      const usuario = usuarios.find(
        (usuario) => usuario.id == item.usuarioId
      ).nome;

      const dataBanco = item.data_envio;

      const data = new Date(dataBanco);

      const dataFormatada =
        data.toLocaleDateString("pt-BR") +
        " " +
        data.toLocaleTimeString("pt-BR");

      const newRow = tabela.insertRow();
      newRow.innerHTML = `
            <tr>
        <td scope="row">${item.nome}</td>
        <td>${dataFormatada}</td>
        <td>
        ${usuario}
        </td>
        <td class="linha-final">
            <button class="btn btn-success download-arquivo" data-upload-id="${item.id}">Download</button>
        </td>
    </tr>
    `;

      const botaoDownload = newRow.querySelector(".download-arquivo");

      botaoDownload.addEventListener("click", async function () {
        const nomeArquivo = item.nome;

        const upload = await fetch(
          `http://localhost:3300/uploads/${nomeArquivo}`
        );

        const uploadDados = await upload.json();

        const diretorio = uploadDados.data.diretorio;
        try {
          const arquivo = await fetch(
            `http://127.0.0.1:5000/arquivos/download/${diretorio}/${nomeArquivo}`
          );

          const arquivoClone = arquivo.clone();

          try {
            const response = await arquivo.json();
            if (response.message === "Arquivo não encontrado!") {
              Swal.fire({
                title: "Arquivo não encontrado",
                text: "O arquivo não foi encontrado no servidor. Por favor, tente novamente mais tarde.",
                icon: "error",
                confirmButtonText: "Entendi",
              });
              return;
            }
          } catch (error) {
            console.log(error);
          }

          try {
            const arquivoDados = await arquivoClone.blob();

            const link = document.createElement("a");

            link.href = URL.createObjectURL(arquivoDados);

            link.download = `${nomeArquivo}`;

            link.click();
          } catch (error) {
            console.log(error);
            Swal.fire({
              title: "Erro ao obter arquivo",
              text: "Ocorreu um erro ao obter o arquivo. Por favor, tente novamente mais tarde.",
              icon: "error",
              confirmButtonText: "Entendi",
            });
          }
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "Erro ao obter arquivo",
            text: "Ocorreu um erro ao obter o arquivo. Por favor, tente novamente mais tarde.",
            icon: "error",
            confirmButtonText: "Entendi",
          });
        }
      });
    });
  }

  preencherTabelaComDados();
});
