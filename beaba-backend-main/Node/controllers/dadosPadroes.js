import { Cargo } from "../models/Cargo.js";
import { Status } from "../models/Status.js";
import { Tipo } from "../models/Tipo.js";
import { Extensao } from "../models/Extensao.js";
import { Squad } from "../models/Squad.js";

export async function criarDadosPadroes() {
  try {
    const cargosExistentes = await Cargo.findAll();

    if (cargosExistentes.length === 0) {
      const cargosPadroes = [
        { nome: "Administrador" },
        { nome: "Gestor" },
        { nome: "Comum" },
        { nome: "Pendente" },
      ];

      await Cargo.bulkCreate(cargosPadroes);
      console.log("Cargos criados com sucesso");
    } else {
      console.log("Cargos já existem, não foram criados novamente");
    }

    const statusExistentes = await Status.findAll();

    if (statusExistentes.length === 0) {
      const statusPadroes = [
        { nome: "Ativo" },
        { nome: "Inativo" },
        { nome: "Pendente" },
      ];

      await Status.bulkCreate(statusPadroes);
      console.log("Status criados com sucesso");
    } else {
      console.log("Status já existem, não foram criados novamente");
    }

    const extensoesExistentes = await Extensao.findAll();

    if (extensoesExistentes.length === 0) {
      const extensoesPadroes = [
        { nome: "csv" },
        { nome: "xls" },
        { nome: "xlsx" },
      ];

      await Extensao.bulkCreate(extensoesPadroes);
      console.log("Extensões criadas com sucesso");
    } else {
      console.log("Extensões já existem, não foram criadas novamente");
    }

    const tiposExistentes = await Tipo.findAll();

    if (tiposExistentes.length === 0) {
      const tiposPadroes = [
        { nome: "Texto" },
        { nome: "Número" },
        { nome: "Data" },
        { nome: "Moeda" },
        { nome: "Booleano" },
      ];

      await Tipo.bulkCreate(tiposPadroes);
      console.log("Tipos criados com sucesso");
    } else {
      console.log("Tipos já existem, não foram criados novamente");
    }

    const squadsExistentes = await Squad.findAll();

    if (squadsExistentes.length === 0) {
      const squadsPadroes = [
        { nome: "Mercantil" },
        { nome: "Vendas" },
        { nome: "Financeiro" },
        { nome: "TI" },
        { nome: "Comercial" },
        { nome: "Marketing" },
        { nome: "Logistica" },
        { nome: "RH" },
        { nome: "Juridico" },
      ];

      await Squad.bulkCreate(squadsPadroes);

      console.log("Squads criados com sucesso");
    } else {
      console.log("Squads já existem, não foram criados novamente");
    }
  } catch (error) {
    console.error(error);
  }
}
