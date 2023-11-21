import { DataTypes } from "sequelize";
import { sequelize } from "../database/conecta.js";

export const Upload = sequelize.define(
  "upload",
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
    data_envio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    diretorio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);
