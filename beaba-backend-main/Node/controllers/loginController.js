import { Usuario } from "../models/Usuario.js";
import jwt from "jsonwebtoken";
const chave = "980185";

export async function loginUsuario(req, res) {
  const { matricula, senha } = req.body;

  console.log(matricula, senha);

  if (!matricula || !senha) {
    return res.status(400).json({
      message: "Requisição inválida",
    });
  }

  try {
    const usuario = await Usuario.findOne({
      where: { matricula: matricula, senha: senha },
    });

    console.log(usuario);

    if (usuario) {
      const token = jwt.sign(
        {
          id: usuario.id,
          cargoId: usuario.cargoId,
          squadId: usuario.squadId,
          nomeUsuario: usuario.nome,
        },
        chave,
        { expiresIn: 3600 }
      );

      return res.status(200).json({
        auth: true,
        token: token,
      });
    } else {
      return res.status(400).json({
        message: "Matrícula ou senha inválidos",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao realizar login",
    });
  }
}

export async function validaToken(req, res) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({
      message: "Acesso negado: Token não fornecido",
    });
  }

  try {
    const decodedToken = jwt.verify(token, chave);
    const cargoId = decodedToken.cargoId;
    const id = decodedToken.id;
    const nomeUsuario = decodedToken.nomeUsuario;
    const squadId = decodedToken.squadId;

    if (cargoId === 1) {
      return res.status(200).json({
        message: "Administrador",
        id,
        nomeUsuario,
        squadId,
      });
    } else if (cargoId === 2) {
      return res.status(200).json({
        message: "Gestor",
        id,
        nomeUsuario,
        squadId,
      });
    } else if (cargoId === 3) {
      return res.status(200).json({
        message: "Comum",
        id,
        nomeUsuario,
        squadId,
      });
    } else if (cargoId === 4) {
      return res.status(200).json({
        message: "Pendente",
        id,
        nomeUsuario,
        squadId,
      });
    } else {
      return res.status(401).json({
        message: "Invalido",
      });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expirado",
      });
    } else {
      return res.status(401).json({
        message: "Token inválido",
      });
    }
  }
}
