document.addEventListener("DOMContentLoaded", async function () {
  const tabelaUsuarios = document.getElementById("bodyTabelaUsuarios");
  const departamentoSelect = document.getElementById("departamento");

  async function carregarDadosDaTabelaUsuarios() {
    try {
      const response = await fetch("http://localhost:3300/usuarios");
      if (response.ok) {
        const dados = await response.json();
        preencherTabelaUsuarios(dados);
      } else {
        Swal.fire({
          title: "Erro ao obter dados de usuários do servidor",
          text: "Ocorreu um erro ao obter os dados de usuários do servidor. Por favor, tente novamente mais tarde.",
          icon: "Error",
          confirmButtonText: "Entendi",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erro ao obter dados de usuários do servidor",
        text: "Ocorreu um erro ao obter os dados de usuários do servidor. Por favor, tente novamente mais tarde.",
        icon: "Error",
        confirmButtonText: "Entendi",
      });
      console.log(error);
    }
  }

  departamentoSelect.addEventListener("change", () => {
    carregarDadosDaTabelaUsuarios();
  });

  tabelaUsuarios.addEventListener("change", async (event) => {
    if (event.target.classList.contains("tipoSelect")) {
      const select = event.target;
      const selectedOption = select.options[select.selectedIndex];

      const cargos = await fetch("http://localhost:3300/cargos");
      const cargosPossiveis = await cargos.json();
      const novoCargo = cargosPossiveis.find(
        (cargo) => cargo.nome === selectedOption.value
      ).id;

      const tr = select.closest("tr");

      const matriculaCell = tr.querySelector(".matricula");

      const matricula = matriculaCell.textContent.trim();

      const response = await fetch(
        `http://localhost:3300/usuarios/${matricula}`
      );

      const usuario = await response.json();

      const usuarioId = usuario.data.id;

      try {
        const response = await fetch(
          `http://localhost:3300/usuarios/${usuarioId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cargoId: novoCargo,
            }),
          }
        );
        if (response.ok) {
          Swal.fire({
            title: "Sucesso!",
            text: `Cargo do usuário ${usuario.data.nome} atualizado para ${selectedOption.value}.`,
            icon: "success",
            confirmButtonText: "Entendi",
          });
        } else {
          Swal.fire({
            title: "Erro ao atualizar o cargo",
            text: "Ocorreu um erro ao atualizar o cargo do usuário. Por favor, tente novamente mais tarde.",
            icon: "Error",
            confirmButtonText: "Entendi",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Erro ao atualizar o cargo",
          text: "Ocorreu um erro ao atualizar o cargo do usuário. Por favor, tente novamente mais tarde.",
          icon: "Error",
          confirmButtonText: "Entendi",
        });
      }
    }
  });

  async function preencherTabelaUsuarios(dados) {
    const cargos = await fetch("http://localhost:3300/cargos");
    const cargosPossiveis = await cargos.json();

    const departamentos = await fetch("http://localhost:3300/squads");
    const departamentosPossiveis = await departamentos.json();

    tabelaUsuarios.innerHTML = "";

    dados.forEach((usuario) => {
      const cargo = cargosPossiveis.find(
        (cargo) => cargo.id === usuario.cargoId
      ).nome;

      if (cargo === "Administrador") {
        return;
      }

      const departamento = departamentosPossiveis.find(
        (departamento) => departamento.id === usuario.squadId
      ).nome;

      if (departamentoSelect.value === "Todos") {
        const newRow = tabelaUsuarios.insertRow();
        newRow.innerHTML = `
            <td>${usuario.nome}</td>
            <td class="matricula">${usuario.matricula}</td>
            <td>
              <select class="form-select tipoSelect">
                <option value="Gestor" ${
                  cargo === "Gestor" ? "selected" : ""
                }>Gestor</option>
                <option value="Comum" ${
                  cargo === "Comum" ? "selected" : ""
                }>Comum</option>
                <option value="Pendente" ${
                  cargo === "Pendente" ? "selected" : ""
                }>Pendente</option>
              </select>
            </td>
            <td> ${departamento} </td>
        `;
      } else if (departamentoSelect.value === departamento) {
        const newRow = tabelaUsuarios.insertRow();
        newRow.innerHTML = `
                <td>${usuario.nome}</td>
                <td class="matricula">${usuario.matricula}</td>
                <td>
                  <select class="form-select tipoSelect"">
                    <option value="Gestor" ${
                      cargo === "Gestor" ? "selected" : ""
                    }>Gestor</option>
                    <option value="Comum" ${
                      cargo === "Comum" ? "selected" : ""
                    }>Comum</option>
                    <option value="Pendente" ${
                      cargo === "Pendente" ? "selected" : ""
                    }>Pendente</option>
                  </select>
                </td>
                <td> ${departamento} </td>
            `;
      } else {
        return;
      }
    });
  }

  carregarDadosDaTabelaUsuarios();
});
