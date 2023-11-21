const pesquisaInput = document.getElementById("Pesquisa");

pesquisaInput.addEventListener("keyup", function () {
  const tabela = document.getElementById("bodyTabelaUsuarios");
  const linhas = Array.from(tabela.querySelectorAll("tr"));

  linhas.forEach((linha) => {
    const nome = linha.cells[1].textContent;
    linha.style.display = nome
      .toLowerCase()
      .includes(pesquisaInput.value.toLowerCase())
      ? "table-row"
      : "none";
  });
});
