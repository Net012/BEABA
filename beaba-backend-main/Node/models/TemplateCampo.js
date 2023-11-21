import { DataTypes } from "sequelize";
import { sequelize } from "../database/conecta.js";

export const TemplateCampo = sequelize.define(
  "templateCampo",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    templateExcluido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    campoId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    templateId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);
