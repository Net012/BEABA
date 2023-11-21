import { Upload } from "../models/Upload.js";
import { verificarArquivo } from "../utils/verificarArquivo.js";
import { uploadArquivo } from "../utils/uploadArquivo.js";

export async function receberUploadDeArquivo(req, res) {

  const arquivo = req.file;

  const templateId = req.body.templateId;

  const usuarioId = req.body.usuarioId;

  const squadId = req.body.squadId;

  const diretorio = req.body.diretorio;

  const nomeArquivo = req.body.nomeArquivo;

  try {
    const verificacao = await verificarArquivo(arquivo, templateId);

    if (verificacao.status !== 200) {
      res.status(verificacao.status).json({
        message: verificacao.message,
      });
    }

    const verificacaoUpload = await uploadArquivo(
      arquivo,
      templateId,
      usuarioId,
      verificacao.extensaoArquivo,
      squadId,
      diretorio,
      nomeArquivo
    );

    if (verificacaoUpload.status === 200) {
      res.status(200).json({
        message: "Verificação e Upload do arquivo realizado com sucesso",
      });
    } else {
      console.log("Erro ao realizar o upload");
      console.log(verificacaoUpload.message);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error ao receber o upload"
    });
  }
}

export async function deletarUpload(req, res) {
  const { id } = req.params;
  try {
    let deletarUpload = await Upload.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Upload deletado com sucesso",
      count: deletarUpload,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao deletar o upload",
      count: {},
    });
  }
}

export async function listarUploads(req, res) {
  try {
    const uploads = await Upload.findAll();
    res.status(200).json({
      data: uploads,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error ao listar os uploads",
      data: {},
    });
  }
}

export async function acharUpload(req, res) {
  const nomeArquivo = req.params.nome;

  console.log("Nome arquivo: " + nomeArquivo);

  try {
    const upload = await Upload.findOne({
      where: {
        nome: nomeArquivo,
      },
    });

    if (upload) {
      res.status(200).json({
        message: "Arquivo já existe",
        data: upload,
      });
    } else {
      res.status(200).json({
        message: "Arquivo não existe",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error ao listar o upload",
      data: {},
    });
  }
}

export async function listarUploadSquad(req, res) {
  const { squadId } = req.params;

  try {
    const upload = await Upload.findAll({
      where: {
        squadId,
      },
    });
    res.status(200).json({
      data: upload,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error ao listar os uploads",
      data: {},
    });
  }
}
