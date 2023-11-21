import { Cargo } from "../models/Cargo.js";
import { Usuario } from "../models/Usuario.js";
import { Template } from "../models/Template.js";
import { Campo } from "../models/Campo.js";
import { Extensao } from "../models/Extensao.js";
import { Status } from "../models/Status.js";
import { Tipo } from "../models/Tipo.js";
import { Upload } from "../models/Upload.js";
import { relacionamentos } from "../models/relacionamentos.js";
import { Squad } from "../models/Squad.js";
import { TemplateCampo } from "../models/TemplateCampo.js";

export async function sincroniza_db() {
  await relacionamentos();

  try {
    await Cargo.sync();
    await Usuario.sync();
    await Template.sync();
    await Campo.sync();
    await Extensao.sync();
    await Status.sync();
    await Tipo.sync();
    await Upload.sync();
    await Squad.sync();
    await TemplateCampo.sync();
  } catch (error) {
    console.log(error);
  }
}
