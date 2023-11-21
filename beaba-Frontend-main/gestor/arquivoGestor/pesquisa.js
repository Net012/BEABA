document.addEventListener("DOMContentLoaded", function () {
  const campoPesquisa = document.getElementById("Pesquisa");

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
