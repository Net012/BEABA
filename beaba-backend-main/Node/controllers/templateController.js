import { Template } from "../models/Template.js";
import { Op } from "sequelize";
import { TemplateCampo } from "../models/TemplateCampo.js";
import { sequelize } from "../database/conecta.js";

export async function criarTemplate(req, res) {
  const { nome, extensaoId, campos, usuarioId, statusId, squadId } = req.body;

  console.log(req.body);

  const dataAtual = new Date();

  if (!nome || !extensaoId || !campos || !usuarioId || !statusId || !squadId) {
    return res.status(400).json({
      message: "Dados incompletos",
    });
  }

  const template = await Template.findOne({
    where: {
      nome: {
        [Op.iLike]: nome,
      },
    },
  });

  if (template) {
    return res.status(400).json({
      message: "Template já existe",
    });
  }

  try {
    const t = await sequelize.transaction();

    const novoTemplate = await Template.create({
      nome,
      data_criacao: dataAtual,
      extensaoId,
      usuarioId,
      statusId,
      squadId,
    });

    if (novoTemplate) {
      campos.forEach(async (campo) => {
        console.log(campo);

        const novoTemplateCampo = await TemplateCampo.create({
          templateId: novoTemplate.id,
          campoId: campo,
          templateExcluido: "false",
        });
        if (!novoTemplateCampo) {
          await t.rollback();
          return res.status(400).json({
            message: "Erro ao campos no template",
          });
        }
      });

      await t.commit();

      return res.status(201).json({
        message: "Template criado com sucesso",
        data: novoTemplate,
      });
    } else {
      await t.rollback();
      return res.status(400).json({
        message: "Erro ao criar o template",
      });
    }
  } catch (error) {
    await t.rollback();

    console.error(error);
    res.status(500).json({
      message: "Erro ao criar o template",
      data: {},
    });
  }
}

export async function deletarTemplate(req, res) {
  const { id } = req.params;
  try {
    let deletarTemplate = await Template.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Template deletado com sucesso",
      count: deletarTemplate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao deletar o template",
      count: {},
    });
  }
}

export async function atualizarStatusTemplate(req, res) {
  const { nome, status } = req.body;

  try {
    const template = await Template.findOne({
      where: {
        nome,
      },
    });

    if (!template) {
      return res.status(404).json({
        message: "Template não encontrado",
      });
    }

    await template.update({
      statusId: status,
    });

    return res.status(200).json({
      message: "Status do template atualizado com sucesso",
      data: template,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao atualizar o status do template",
      data: {},
    });
  }
}

export async function listarTemplates(req, res) {
  try {
    const templates = await Template.findAll({
      attributes: [
        "id",
        "nome",
        "data_criacao",
        "extensaoId",
        "usuarioId",
        "statusId",
        "squadId",
      ],
    });
    res.status(200).json(templates);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erro ao listar os templates",
      data: {},
    });
  }
}

export async function acharTemplate(req, res) {
  const nome = req.params.nome;
  try {
    const template = await Template.findOne({
      attributes: ["id"],
      where: {
        nome,
      },
    });
    res.status(200).json(template);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erro ao listar os templates",
      data: {},
    });
  }
}

export async function acharTemplateId(req, res) {
  const id = req.params.id;

  try {
    const template = await Template.findOne({
      attributes: ["nome", "extensaoId"],
      where: {
        id,
      },
    });
    res.status(200).json(template);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erro ao listar os templates",
      data: {},
    });
  }
}

export async function deletarTodos(req, res) {
  try {
    let deletarTemplate = await Template.destroy({
      where: {},
      truncate: true,
    });
    res.status(200).json({
      message: "Todos os templates deletados com sucesso",
      count: deletarTemplate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao deletar todos os templates",
      count: {},
    });
  }
}

export async function listarTemplatesSquad(req, res) {
  const squadId = req.params.squadId;
  console.log(squadId);
  try {
    const templates = await Template.findAll({
      attributes: [
        "id",
        "nome",
        "data_criacao",
        "extensaoId",
        "usuarioId",
        "statusId",
        "squadId",
      ],
      where: {
        squadId,
      },
    });
    res.status(200).json(templates);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erro ao listar os templates",
      data: {},
    });
  }
}

export async function listarTemplateSquadUsuarioComum(req, res) {
  const squadId = req.params.squadId;
  const statusId = 1;

  try {
    const templates = await Template.findAll({
      attributes: [
        "id",
        "nome",
        "data_criacao",
        "extensaoId",
        "usuarioId",
        "statusId",
        "squadId",
      ],
      where: {
        squadId,
        statusId,
      },
    });
    res.status(200).json(templates);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erro ao listar os templates",
      data: {},
    });
  }
}
