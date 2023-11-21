import { Router } from "express";

import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
  acharUsuario,
  acharUsuarioPorId,
  listarUsuariosSquad,
} from "./controllers/usuarioController.js";

import {
  listarCargos,
  criarCargo,
  atualizarCargo,
  deletarCargo,
  acharNomeCargo,
} from "./controllers/cargoController.js";

import {
  receberUploadDeArquivo,
  deletarUpload,
  listarUploads,
  acharUpload,
  listarUploadSquad,
} from "./controllers/uploadController.js";

import {
  listarTemplates,
  criarTemplate,
  atualizarStatusTemplate,
  acharTemplateId,
  deletarTemplate,
  acharTemplate,
  deletarTodos,
  listarTemplatesSquad,
  listarTemplateSquadUsuarioComum,
} from "./controllers/templateController.js";

import {
  listarStatus,
  criarStatus,
  atualizarStatus,
  deletarStatus,
} from "./controllers/statusController.js";

import {
  criarCampo,
  acharCampo,
  deletarCampo,
  listarCampos,
} from "./controllers/campoController.js";

import {
  criarTipo,
  atualizarTipo,
  deletarTipo,
  listarTipos,
  acharTipoPorNome,
} from "./controllers/tipoController.js";

import {
  criarExtensao,
  atualizarExtensao,
  deletarExtensao,
  listarExtensao,
  obterExtensao,
} from "./controllers/extensaoController.js";

import { loginUsuario, validaToken } from "./controllers/loginController.js";

import {
  criarSquad,
  editarSquad,
  excluirSquad,
  listarSquads,
  acharNomeSquad,
} from "./controllers/squadController.js";

import {
  listarTemplatesCampos,
  acharCamposTemplate,
} from "./controllers/templateCampoController.js";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router
  .get("/usuarios", listarUsuarios)
  .post("/usuarios", criarUsuario)
  .put("/usuarios/:id", atualizarUsuario)
  .delete("/usuarios/:matricula", deletarUsuario)
  .get("/usuarios/:matricula", acharUsuario)
  .get("/usuarios/id/:id", acharUsuarioPorId)
  .get("/usuarios/squad/:squadId", listarUsuariosSquad);

router
  .get("/cargos", listarCargos)
  .post("/cargos", criarCargo)
  .put("/cargos/:id", atualizarCargo)
  .delete("/cargos/:id", deletarCargo)
  .get("/cargos/:cargoId", acharNomeCargo);

router
  .get("/uploads", listarUploads)
  .post("/uploads", upload.single("arquivo"), receberUploadDeArquivo)
  .delete("/uploads/:id", deletarUpload)
  .get("/uploads/:nome", acharUpload)
  .get("/uploads/squad/:squadId", listarUploadSquad);

router
  .get("/templates", listarTemplates)
  .post("/templates", criarTemplate)
  .put("/templates", atualizarStatusTemplate)
  .delete("/templates/:id", deletarTemplate)
  .get("/templates/nome/:nome", acharTemplate)
  .get("/templates/:id", acharTemplateId)
  .delete("/templates", deletarTodos)
  .get("/templates/squad/:squadId", listarTemplatesSquad)
  .get("/templates/comum/squad/:squadId", listarTemplateSquadUsuarioComum);

router
  .get("/status", listarStatus)
  .post("/status", criarStatus)
  .put("/status/:id", atualizarStatus)
  .delete("/status/:id", deletarStatus);

router
  .get("/campos", listarCampos)
  .post("/campos", criarCampo)
  .delete("/campos/:id", deletarCampo)
  .get("/campos/:id", acharCampo);

router
  .get("/tipos", listarTipos)
  .post("/tipos", criarTipo)
  .put("/tipos/:id", atualizarTipo)
  .delete("/tipos/:id", deletarTipo)
  .get("/tipos/:nome", acharTipoPorNome);

router
  .get("/extensoes", listarExtensao)
  .post("/extensoes", criarExtensao)
  .put("/extensoes/:id", atualizarExtensao)
  .delete("/extensoes/:id", deletarExtensao)
  .get("/extensoes/:nome", obterExtensao);

router
  .get("/squads", listarSquads)
  .post("/squads", criarSquad)
  .put("/squads/:id", editarSquad)
  .delete("/squads/:id", excluirSquad)
  .get("/squads/:squadId", acharNomeSquad);

router
  .get("/templatesCampos", listarTemplatesCampos)
  .get("/templatesCampos/:id", acharCamposTemplate);

router.post("/login", loginUsuario).post("/validaToken", validaToken);

export default router;
