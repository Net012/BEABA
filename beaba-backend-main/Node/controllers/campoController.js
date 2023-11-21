import { Campo } from "../models/Campo.js";
import { Op } from "sequelize";

export async function listarCampos(req, res) {
  try {
    const campos = await Campo.findAll({
      attributes: ["id", "nome", "tipoId"],
    });
    res.status(200).json(campos);
  } catch (error) {
    res.status(500).json({
      message: "Error ao obter os campos",
    });
    console.log(error);
  }
}

export async function acharCampo(req, res) {
  const id = req.params.id;

  try {
    const campo = await Campo.findOne({
      attributes: ["id", "nome", "tipoId"],
      where: {
        id,
      },
    });
    res.status(200).json(campo);
  } catch (error) {
    res.status(500).json({
      message: "Error ao obter o campo",
    });
    console.log(error);
  }
}

export async function criarCampo(req, res) {
  const { nome, tipoId } = req.body;

  console.log(req.body);

  console.log(nome, tipoId);

  if (!nome || !tipoId) {
    return res.status(400).json({
      message: "Requisição inválida",
    });
  }

  try {
    const campo = await Campo.findOne({
      where: {
        nome: {
          [Op.iLike]: nome,
        },
      },
    });

    if (campo) {
      return res.status(400).json({
        message: "Campo já cadastrado",
      });
    }

    const novoCampo = await Campo.create(
      {
        nome,
        tipoId,
      },
      {
        fields: ["nome", "tipoId"],
      }
    );

    if (novoCampo) {
      return res.status(201).json({
        message: "Campo criado com sucesso",
        data: novoCampo,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar um novo campo",
      data: {},
    });
  }
}

export async function deletarCampo(req, res) {
  const { id } = req.params;
  try {
    let deletarCampo = await Campo.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Campo deletado com sucesso",
      count: deletarCampo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao deletar o campo",
    });
  }
}
