const botaoExcluir = document.querySelector(".btn-danger");
botaoExcluir.addEventListener("click", () => {
  const confirmacaoExclusaoModal = new bootstrap.Modal(
    document.getElementById("confirmacaoExclusaoModal")
  );
  confirmacaoExclusaoModal.show();
});

const botaoConfirmarExclusao = document.getElementById("confirmarExclusao");
botaoConfirmarExclusao.addEventListener("click", async () => {
  const matriculaExclusao = document.getElementById("matriculaExclusao").value;
  console.log(matriculaExclusao);

  try {
    const resposta = await fetch(
      `http://localhost:3300/usuarios/${matriculaExclusao}`,
      {
        method: "DELETE",
      }
    );

    console.log(resposta);

    if (resposta.ok) {
      alert("Usuário excluído com sucesso!");
    } else if (resposta.status == 404) {
      alert(`Usuário com matrícula ${matriculaExclusao} não encontrado!`);
    }
  } catch (erro) {
    console.log(erro);
  }
  const confirmacaoExclusaoModal = bootstrap.Modal.getInstance(
    document.getElementById("confirmacaoExclusaoModal")
  );
  confirmacaoExclusaoModal.hide();
});
