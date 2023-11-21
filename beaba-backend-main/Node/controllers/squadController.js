import { Squad } from "../models/Squad.js";

export async function listarSquads(req, res) {
  try {
    let squads = await Squad.findAll();
    res.status(200).json(squads);
  } catch (error) {
    res.status(500).json({
      message: "Error ao obter os squads",
    });
    console.log(error);
  }
}

export async function criarSquad(req, res) {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      message: "Requisição inválida",
    });
  }

  try {
    let novoSquad = await Squad.create(
      {
        nome,
      },
      {
        fields: ["nome"],
      }
    );

    if (novoSquad) {
      return res.status(201).json({
        message: "Squad criado com sucesso",
        data: novoSquad,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error ao criar o squad",
    });
    console.log(error);
  }
}

export async function editarSquad(req, res) {
  const { id } = req.params;
  const { nome } = req.body;

  if (!id || !nome) {
    return res.status(400).json({
      message: "Requisição inválida",
    });
  }

  try {
    const squad = await Squad.findOne({
      where: {
        id,
      },
    });

    if (!squad) {
      return res.status(400).json({
        message: "Squad não encontrado",
      });
    }

    await squad.update({
      nome,
    });

    return res.status(200).json({
      message: "Squad atualizado com sucesso",
      data: squad,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao atualizar o squad",
    });
    console.log(error);
  }
}

export async function excluirSquad(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Requisição inválida",
    });
  }

  try {
    const squad = await Squad.findOne({
      where: {
        id,
      },
    });

    if (!squad) {
      return res.status(400).json({
        message: "Squad não encontrado",
      });
    }

    await squad.destroy();

    return res.status(200).json({
      message: "Squad excluído com sucesso",
      data: squad,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao excluir o squad",
    });
    console.log(error);
  }
}

export async function acharNomeSquad(req, res) {
  const squadId = req.params.squadId;

  try {
    const squad = await Squad.findOne({
      attributes: ["nome"],
      where: {
        id: squadId,
      },
    });

    if (!squad) {
      return res.status(404).json({
        message: "Squad não encontrado",
      });
    }

    return res.status(200).json({
      message: "Squad encontrado",
      data: squad,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao encontrar o squad",
    });
  }
}
