import { TemplateCampo } from "../models/TemplateCampo.js";

export async function listarTemplatesCampos(req, res) {
  try {
    const campos = await TemplateCampo.findAll();
    res.json(campos);
  } catch (error) {
    console.log(error);
  }
}

export async function acharCamposTemplate(req, res) {
  const { id } = req.params;
  try {
    const campos = await TemplateCampo.findAll({
      where: {
        templateId: id,
        templateExcluido: false,
      },
    });
    res.json(campos);
  } catch (error) {
    console.log(error);
  }
}
