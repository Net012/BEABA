document.addEventListener("DOMContentLoaded", function () {
  const campoPesquisa = document.getElementById("Pesquisa");

  // Função para filtrar os dados da tabela por status
  async function filtrarDadosPorStatus(status) {
    const tabela = document.getElementById("bodyTabela");
    const linhas = Array.from(tabela.querySelectorAll("tr"));

    linhas.forEach((linha) => {
      const statusCelula = linha.cells[2].querySelector("select").value;
      linha.style.display =
        statusCelula === status || status === "todos" ? "table-row" : "none";
    });
  }

  document
    .getElementById("statusAtivo")
    .addEventListener("click", async function () {
      filtrarDadosPorStatus("Ativo");
    });

  document
    .getElementById("statusInativo")
    .addEventListener("click", async function () {
      filtrarDadosPorStatus("Inativo");
    });

  document
    .getElementById("statusTodos")
    .addEventListener("click", async function () {
      filtrarDadosPorStatus("todos");
    });

  document
    .getElementById("statusPendente")
    .addEventListener("click", async function () {
      filtrarDadosPorStatus("Pendente");
    });

  campoPesquisa.addEventListener("input", realizarPesquisa);

  async function realizarPesquisa() {
    const termoPesquisa = campoPesquisa.value.trim().toLowerCase();
    const tabela = document.getElementById("bodyTabela");
    const linhas = tabela.getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {
      const nomeTemplate = linhas[i].getElementsByTagName("td")[0];
      if (nomeTemplate) {
        const textoNome = nomeTemplate.textContent.trim().toLowerCase();
        if (textoNome.includes(termoPesquisa)) {
          linhas[i].style.display = "";
        } else {
          linhas[i].style.display = "none";
        }
      }
    }
  }
});
