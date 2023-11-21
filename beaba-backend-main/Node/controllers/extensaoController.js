import { Extensao } from "../models/Extensao.js";
import { Op } from "sequelize";

export async function listarExtensao(req, res) {
  try {
    let extensao = await Extensao.findAll();
    res.status(200).json(extensao);
  } catch (error) {
    res.status(500).json({
      message: "Error ao obter os extensao",
    });
    console.log(error);
  }
}

export async function criarExtensao(req, res) {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      message: "Requisição inválida",
    });
  }

  try {
    let novoExtensao = await Extensao.create(
      {
        nome,
      },
      {
        fields: ["nome"],
      }
    );

    if (novoExtensao) {
      return res.status(201).json({
        message: "Extensao criado com sucesso",
        data: novoExtensao,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar um novo extensao",
      data: {},
    });
  }
}

export async function deletarExtensao(req, res) {
  const { id } = req.params;
  try {
    let deletarExtensao = await Extensao.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Extensao deletado com sucesso",
      count: deletarExtensao,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao deletar o extensao",
      count: {},
    });
  }
}

export async function atualizarExtensao(req, res) {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    let extensao = await Extensao.findAll({
      attributes: ["id", "nome"],
      where: {
        id,
      },
    });
    if (extensao.length > 0) {
      extensao.forEach(async (extensao) => {
        await extensao.update({
          nome,
        });
      });
    }
    return res.status(200).json({
      message: "Extensao atualizado com sucesso",
      data: extensao,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao atualizar o extensao",
      data: {},
    });
  }
}

export async function obterExtensao(req, res) {
  const { nome } = req.params;
  try {
    const extensao = await Extensao.findOne({
      attributes: ["id"],
      where: {
        nome: {
          [Op.like]: `%${nome}%`,
        },
      },
    });
    res.status(200).json(extensao);
  } catch (error) {
    res.status(500).json({
      message: "Error ao obter o extensao",
    });
  }
}
