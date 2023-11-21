import { Status } from "../models/Status.js";

export async function listarStatus(req, res) {
  try {
    let status = await Status.findAll();
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({
      message: "Error ao obter os status",
    });
    console.log(error);
  }
}

export async function criarStatus(req, res) {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      message: "Requisição inválida",
    });
  }

  try {
    let novoStatus = await Status.create(
      {
        nome,
      },
      {
        fields: ["nome"],
      }
    );

    if (novoStatus) {
      return res.status(201).json({
        message: "Status criado com sucesso",
        data: novoStatus,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar um novo status",
      data: {},
    });
  }
}

export async function deletarStatus(req, res) {
  const { id } = req.params;
  try {
    let deletarStatus = await Status.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Status deletado com sucesso",
      count: deletarStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao deletar o status",
      count: {},
    });
  }
}

export async function atualizarStatus(req, res) {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    let status = await Status.findAll({
      attributes: ["id", "nome"],
      where: {
        id,
      },
    });
    if (status.length > 0) {
      status.forEach(async (status) => {
        await status.update({
          nome,
        });
      });
    }

    return res.status(200).json({
      message: "Status atualizado com sucesso",
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao atualizar o status",
      data: {},
    });
  }
}
