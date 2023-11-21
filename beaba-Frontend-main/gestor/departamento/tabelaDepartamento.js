document.addEventListener("DOMContentLoaded", async function () {
  const departamento = document.getElementById("Departamento");
  const tabela = document.getElementById("bodyTabela");
  const squadId = await getSquadId();
  departamento.innerHTML = `Departamento: ${await getNomeDepartamento()}`;
  const response = await fetch(
    `http://localhost:3300/usuarios/squad/${squadId}`
  );
  const dados = (await response.json()).data;

  dados.forEach(async (item) => {
    const request = await fetch(`http://localhost:3300/cargos/${item.cargoId}`);
    const cargo = (await request.json()).data;

    if (cargo.nome == "Gestor" || cargo.nome == "Administrador") {
      const newRow = tabela.insertRow();
      newRow.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.matricula}</td>
                <td class="p-2">${cargo.nome}</td>
            `;
    } else {
      const newRow = tabela.insertRow();
      newRow.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.matricula}</td>
        <td>
        <select class="form-select tipoSelect">
        <option value="Comum" ${
          cargo.nome === "Comum" ? "selected" : ""
        }>Comum</option>
        <option value="Pendente" ${
          cargo.nome === "Pendente" ? "selected" : ""
        }>Pendente</option>
    </select>
        </td>
    `;

      const cargoSelect = newRow.querySelector(".tipoSelect");

      cargoSelect.addEventListener("change", async (event) => {
        const novoCargoNome = event.target.value;

        try {
          const cargos = await fetch("http://localhost:3300/cargos");
          const cargosPossiveis = await cargos.json();
          const novoCargo = cargosPossiveis.find(
            (cargo) => cargo.nome === novoCargoNome
          );

          if (novoCargo) {
            const response = await fetch(
              `http://localhost:3300/usuarios/${item.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  cargoId: novoCargo.id,
                }),
              }
            );

            if (response.ok) {
              Swal.fire({
                title: "Sucesso!",
                text: `Cargo do usuário ${item.nome} atualizado para ${novoCargo.nome}.`,
                icon: "success",
                confirmButtonText: "Entendi",
              });
            } else {
              Swal.fire({
                title: "Erro ao atualizar o cargo",
                text: "Ocorreu um erro ao atualizar o cargo do usuário. Por favor, tente novamente mais tarde.",
                icon: "error",
                confirmButtonText: "Entendi",
              });
            }
          }
        } catch (error) {
          Swal.fire({
            title: "Erro ao atualizar o cargo",
            text: "Ocorreu um erro ao atualizar o cargo do usuário. Por favor, tente novamente mais tarde.",
            icon: "error",
            confirmButtonText: "Entendi",
          });
        }
      });
    }
  });

  async function getSquadId() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3300/validaToken", {
      method: "POST",
      headers: {
        "x-access-token": token,
      },
    });
    return (await response.json()).squadId;
  }

  async function getNomeDepartamento() {
    const response = await fetch(`http://localhost:3300/squads/${squadId}`);
    const dados = (await response.json()).data;
    return dados.nome;
  }
});
