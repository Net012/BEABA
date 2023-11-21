import { Usuario } from "../models/Usuario.js";

export async function listarUsuarios(req, res) {
  try {
    let usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({
      message: "Error ao obter os usuarios",
    });
    console.log(error);
  }
}

export async function criarUsuario(req, res) {
  const { nome, matricula, email, senha, cargoId, squadId } = req.body;

  if (!nome || !matricula || !email || !senha || !cargoId || !squadId) {
    return res.status(400).json({
      message: "Requisição inválida",
    });
  }

  try {
    const usuarioComMatricula = await Usuario.findOne({
      where: { matricula: matricula },
    });

    const usuarioComEmail = await Usuario.findOne({
      where: { email: email },
    });

    if (usuarioComMatricula && usuarioComEmail) {
      return res.status(400).json({
        message: "Matrícula e email já cadastrados",
      });
    } else if (usuarioComMatricula) {
      return res.status(400).json({
        message: "Matrícula já cadastrada",
      });
    } else if (usuarioComEmail) {
      return res.status(400).json({
        message: "Email já cadastrado",
      });
    }

    const novoUsuario = await Usuario.create(
      {
        nome,
        matricula,
        email,
        senha,
        cargoId,
        squadId,
      },
      {
        fields: ["nome", "matricula", "email", "senha", "cargoId", "squadId"],
      }
    );

    if (novoUsuario) {
      return res.status(201).json({
        message: "Usuário criado com sucesso",
        data: novoUsuario,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar um novo usuário",
    });
  }
}

export async function deletarUsuario(req, res) {
  const { matricula } = req.params;
  try {
    const usuario = await Usuario.findOne({
      where: {
        matricula,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    } else {
      const deletarUsuario = await Usuario.destroy({
        where: {
          matricula,
        },
      });
      res.status(200).json({
        message: "Usuário deletado com sucesso",
        count: deletarUsuario,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error ao deletar o usuário",
      count: deletarUsuario,
    });
  }
}

export async function atualizarUsuario(req, res) {
  const id = req.params.id;

  const novoCargo = req.body;

  try {
    const usuario = await Usuario.findOne({
      where: {
        id,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    await usuario.update({
      cargoId: novoCargo.cargoId,
    });

    if (usuario) {
      return res.status(200).json({
        message: "Usuário atualizado com sucesso",
        data: usuario,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao atualizar o usuário",
      data: {},
    });
  }
}

export async function acharUsuario(req, res) {
  const matricula = req.params.matricula;

  try {
    const usuario = await Usuario.findOne({
      attributes: ["id"],
      where: {
        matricula,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json({
      message: "Usuário encontrado",
      data: usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao encontrar o usuário",
      data: {},
    });
  }
}

export async function acharUsuarioPorId(req, res) {
  const id = req.params.id;

  try {
    const usuario = await Usuario.findOne({
      attributes: ["nome"],
      where: {
        id,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json({
      message: "Usuário encontrado",
      data: usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao encontrar o usuário",
      data: {},
    });
  }
}

export async function listarUsuariosSquad(req, res) {
  const squadId = req.params.squadId;

  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nome", "matricula", "cargoId"],

      where: {
        squadId,
      },
    });

    if (!usuarios) {
      return res.status(404).json({
        message: "Usuários não encontrados",
      });
    }

    return res.status(200).json({
      message: "Usuários encontrados",
      data: usuarios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao encontrar os usuários",
      data: {},
    });
  }
}