import { DataTypes } from "sequelize";
import { sequelize } from "../database/conecta.js";

export const Template = sequelize.define(
  "template",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { timestamps: false }
);
