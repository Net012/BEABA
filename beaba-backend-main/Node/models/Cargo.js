import { DataTypes } from "sequelize";
import { sequelize } from "../database/conecta.js";

export const Cargo = sequelize.define(
  "cargo",
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
  },
  { timestamps: false }
);
