import { Template } from "../models/Template.js";
import { TemplateCampo } from "../models/TemplateCampo.js";
import { Extensao } from "../models/Extensao.js";
import { Campo } from "../models/Campo.js";
import { Tipo } from "../models/Tipo.js";
import XLSX from "xlsx";

export async function verificarArquivo(arquivo, templateId) {
  let retorno;

  if (!arquivo || !templateId) {
    console.log("Requisição inválida 1");
  }

  const template = await Template.findOne({
    where: {
      id: templateId,
    },
  });

  if (!template) {
    retorno = {
      message: "Template não encontrado",
      status: 400,
    };
    return retorno;
  }

  const extensaoTemplate = template.extensaoId;

  console.log(extensaoTemplate);

  const extensaoEsperada = await Extensao.findOne({
    where: {
      id: extensaoTemplate,
    },
  });

  if (!extensaoEsperada) {
    retorno = {
      message: "Extensão do template não encontrada",
      status: 400,
    };
    return retorno;
  }

  console.log(arquivo.originalname);

  const extensaoArquivo = arquivo.originalname.split(".").pop();

  if (extensaoArquivo !== extensaoEsperada.nome) {
    retorno = {
      message: "Extensão do arquivo inválida",
      status: 400,
    };
    return retorno;
  }

  const camposTemplate = await TemplateCampo.findAll({
    where: {
      templateId,
    },
  });

  if (!camposTemplate) {
    retorno = {
      message: "Campos do template não encontrados",
      status: 400,
    };
    return retorno;
  }

  for (let i = 0; i < camposTemplate.length; i++) {
    const workbook = XLSX.read(arquivo.buffer, { type: "array", raw: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const colunas = [];

    for (const key in worksheet) {
      if (worksheet.hasOwnProperty(key) && key.match(/[A-Z]+/)) {
        const coluna = key.match(/[A-Z]+/)[0];

        if (!colunas.includes(coluna)) {
          colunas.push(coluna);
        }
      }
    }

    const camposColuna = getColuna(colunas[i]);

    const nomeColuna = camposColuna[0];

    console.log(nomeColuna);

    function getColuna(coluna) {
      const campos = [];
      for (const key in worksheet) {
        if (worksheet.hasOwnProperty(key) && key.startsWith(coluna)) {
          campos.push(worksheet[key].v);
        }
      }
      return campos;
    }

    const campoId = camposTemplate[i].campoId;

    const campo = await Campo.findOne({
      where: {
        id: campoId,
      },
    });

    const campoNome = campo.nome;

    if (nomeColuna !== campoNome) {
      retorno = {
        message: `Nome de coluna inválido na coluna ${
          i + 1
        }, Valor Esperado: ${campoNome}, Valor Encontrado: ${nomeColuna}`,
        status: 400,
      };
      return retorno;
    }
  }

  for (let i = 0; i < camposTemplate.length; i++) {
    const campoId = camposTemplate[i].campoId;

    const campo = await Campo.findOne({
      where: {
        id: campoId,
      },
    });

    const campoTipoId = campo.tipoId;
    let tipoCampoEsperado;

    let tipoCampo = await Tipo.findOne({
      where: {
        id: campoTipoId,
      },
    });

    switch (tipoCampo.id) {
      case 1:
        tipoCampoEsperado = "Texto";
        break;
      case 2:
        tipoCampoEsperado = "Número";
        break;

      case 3:
        tipoCampoEsperado = "Data";
        break;

      case 4:
        tipoCampoEsperado = "Moeda";
        break;
    }

    const workbook = XLSX.read(arquivo.buffer, { type: "array", raw: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const colunas = [];

    for (const key in worksheet) {
      if (worksheet.hasOwnProperty(key) && key.match(/[A-Z]+/)) {
        const coluna = key.match(/[A-Z]+/)[0];

        if (!colunas.includes(coluna)) {
          colunas.push(coluna);
        }
      }
    }

    const camposColuna = getColuna(colunas[i]);

    camposColuna.shift();

    function getColuna(coluna) {
      const campos = [];
      for (const key in worksheet) {
        if (worksheet.hasOwnProperty(key) && key.startsWith(coluna)) {
          campos.push(worksheet[key].v);
        }
      }
      return campos;
    }

    for (let j = 0; j < camposColuna.length; j++) {
      const celula = camposColuna[j];
      let celulaValor = celula;

      switch (tipoCampoEsperado) {
        case "Texto":
          try {
            celulaValor = String(celulaValor);
          } catch (error) {
            retorno = {
              message: `Tipo de campo inválido na coluna ${i + 1} e linha ${
                j + 1
              }, Valor Esperado: ${tipoCampoEsperado}, Valor Encontrado: ${celulaValor}`,
              status: 400,
            };

            return retorno;
          }

          if (/\d/.test(celulaValor)) {
            retorno = {
              message: `Tipo de campo inválido na coluna ${i + 1} e linha ${
                j + 1
              }, Valor Esperado: ${tipoCampoEsperado}, Valor Encontrado: ${celulaValor}`,
              status: 400,
            };

            return retorno;
          }

          break;

        case "Número":
          try {
            celulaValor = Number(celulaValor);
          } catch (error) {
            retorno = {
              message: `Tipo de campo inválido na coluna ${i + 1} e linha ${
                j + 1
              }, Valor Esperado: ${tipoCampoEsperado}, Valor Encontrado: ${celulaValor}`,
              status: 400,
            };

            return retorno;
          }

          if (isNaN(celulaValor)) {
            retorno = {
              message: `Tipo de campo inválido na coluna ${i + 1} e linha ${
                j + 1
              }, Valor Esperado: ${tipoCampoEsperado}, Valor Encontrado: ${celulaValor}`,
              status: 400,
            };

            return retorno;
          }

          break;

        case "Data":
          try {
            celulaValor = Date(celulaValor);
          } catch (error) {
            retorno = {
              message: `Tipo de campo inválido na coluna ${i + 1} e linha ${
                j + 1
              }, Tipo Esperado: ${tipoCampoEsperado}, Valor Encontrado: ${celulaValor}`,
              status: 400,
            };

            return retorno;
          }

          break;

        case "Moeda":
          try {
            celulaValor = parseFloat(celulaValor);
          } catch (error) {
            retorno = {
              message: `Tipo de campo inválido na coluna ${i + 1} e linha ${
                j + 1
              }, Valor Esperado: ${tipoCampoEsperado}, Valor Encontrado: ${celulaValor}`,
              status: 400,
            };

            return retorno;
          }

          if (isNaN(celulaValor)) {
            retorno = {
              message: `Tipo de campo inválido na coluna ${i + 1} e linha ${
                j + 1
              }, Valor Esperado: ${tipoCampoEsperado}, Valor Encontrado: ${celulaValor}`,
              status: 400,
            };

            return retorno;
          }
          break;
      }
    }
  }
  retorno = {
    message: "Arquivo validado com sucesso",
    status: 200,
    nomeArquivo: arquivo.originalname,
    extensaoArquivo: extensaoEsperada.id,
  };

  return retorno;
}
