import { Cargo } from "../models/Cargo.js";

export async function listarCargos(req, res) {
  try {
    let cargos = await Cargo.findAll();
    res.status(200).json(cargos);
  } catch (error) {
    res.status(500).json({
      message: "Error ao obter os cargos",
    });
    console.log(error);
  }
}

export async function criarCargo(req, res) {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      message: "Requisição inválida",
    });
  }

  try {
    let novoCargo = await Cargo.create(
      {
        nome,
      },
      {
        fields: ["nome"],
      }
    );

    if (novoCargo) {
      return res.status(201).json({
        message: "Cargo criado com sucesso",
        data: novoCargo,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar um novo cargo",
      data: {},
    });
  }
}

export async function deletarCargo(req, res) {
  const { id } = req.params;
  try {
    let deletarCargo = await Cargo.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Cargo deletado com sucesso",
      count: deletarCargo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar o cargo",
      count: {},
    });
  }
}

export async function atualizarCargo(req, res) {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    let cargos = await Cargo.findAll({
      attributes: ["id", "nome"],
      where: {
        id,
      },
    });
    if (cargos.length > 0) {
      cargos.forEach(async (cargo) => {
        await cargo.update({
          nome,
        });
      });
    }
    return res.status(200).json({
      message: "Cargo atualizado com sucesso",
      data: cargos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao atualizar o cargo",
      data: {},
    });
  }
}

export async function acharNomeCargo(req, res) {
  const cargoId = req.params.cargoId;

  try {
    const cargo = await Cargo.findOne({
      attributes: ["nome"],
      where: {
        id: cargoId,
      },
    });

    if (!cargo) {
      return res.status(404).json({
        message: "Cargo não encontrado",
      });
    }

    return res.status(200).json({
      message: "Cargo encontrado",
      data: cargo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao encontrar o cargo",
      data: {},
    });
  }
}
