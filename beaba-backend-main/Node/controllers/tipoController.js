import { Tipo } from "../models/Tipo.js";
import { Op } from "sequelize";

export async function listarTipos(req, res) {
  try {
    let tipos = await Tipo.findAll();
    res.status(200).json(tipos);
  } catch (error) {
    res.status(500).json({
      message: "Error ao obter os tipos",
    });
    console.log(error);
  }
}

export async function criarTipo(req, res) {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      message: "Requisição inválida",
    });
  }

  try {
    let novoTipo = await Tipo.create(
      {
        nome,
      },
      {
        fields: ["nome"],
      }
    );

    if (novoTipo) {
      return res.status(201).json({
        message: "Tipo criado com sucesso",
        data: novoTipo,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar um novo tipo",
      data: {},
    });
  }
}

export async function deletarTipo(req, res) {
  const { id } = req.params;
  try {
    let deletarTipo = await Tipo.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Tipo deletado com sucesso",
      count: deletarTipo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao deletar o tipo",
    });
  }
}

export async function atualizarTipo(req, res) {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    let tipos = await Tipo.findAll({
      attributes: ["id", "nome"],
      where: {
        id,
      },
    });
    if (tipos.length > 0) {
      tipos.forEach(async (tipo) => {
        await tipo.update({
          nome,
        });
      });
    }
    return res.status(200).json({
      message: "Tipo atualizado com sucesso",
      data: tipos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao atualizar o tipo",
    });
  }
}

export async function acharTipoPorNome(req, res) {
  const { nome } = req.params;
  try {
    const tipo = await Tipo.findOne({
      attributes: ["id"],
      where: {
        nome: {
          [Op.iLike]: nome,
        },
      },
    });
    return res.status(200).json({
      message: "Tipo encontrado com sucesso",
      data: tipo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao encontrar o tipo",
    });
  }
}
