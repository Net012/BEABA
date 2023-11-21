import { Cargo } from "./Cargo.js";
import { Usuario } from "./Usuario.js";
import { Template } from "./Template.js";
import { Campo } from "./Campo.js";
import { Extensao } from "./Extensao.js";
import { Status } from "./Status.js";
import { Tipo } from "./Tipo.js";
import { Upload } from "./Upload.js";
import { Squad } from "./Squad.js";
import { TemplateCampo } from "./TemplateCampo.js";

export async function relacionamentos() {
  Usuario.belongsTo(Cargo, {
    foreignKey: "cargoId",
    allowNull: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Cargo.hasMany(Usuario, {
    foreignKey: "cargoId",
  });

  Usuario.belongsTo(Squad, {
    foreignKey: "squadId",
    allowNull: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Squad.hasMany(Usuario, {
    foreignKey: "squadId",
  });

  Upload.belongsTo(Usuario, {
    foreignKey: "usuarioId",
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Usuario.hasMany(Upload, {
    foreignKey: "usuarioId",
  });

  Upload.belongsTo(Template, {
    foreignKey: "templateId",
    allowNull: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Template.hasMany(Upload, {
    foreignKey: "templateId",
  });

  Upload.belongsTo(Extensao, {
    foreignKey: "extensaoId",
    allowNull: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Extensao.hasMany(Upload, {
    foreignKey: "extensaoId",
  });

  Template.belongsTo(Usuario, {
    foreignKey: "usuarioId",
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Usuario.hasMany(Template, {
    foreignKey: "usuarioId",
  });

  Template.belongsTo(Status, {
    foreignKey: "statusId",
    allowNull: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Status.hasMany(Template, {
    foreignKey: "statusId",
  });

  Template.belongsTo(Extensao, {
    foreignKey: "extensaoId",
    allowNull: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Extensao.hasMany(Template, {
    foreignKey: "extensaoId",
  });

  Template.belongsTo(Squad, {
    foreignKey: "squadId",
    allowNull: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Squad.hasMany(Template, {
    foreignKey: "squadId",
  });

  Campo.belongsTo(Tipo, {
    foreignKey: "tipoId",
    allowNull: false,
    as: "tipo",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Tipo.hasMany(Campo, {
    foreignKey: "tipoId",
    as: "tipo",
  });

  Upload.belongsTo(Squad, {
    foreignKey: "squadId",
    allowNull: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Squad.hasMany(Upload, {
    foreignKey: "squadId",
  });

  Template.belongsToMany(Campo, {
    through: TemplateCampo,
    foreignKey: "templateId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Campo.belongsToMany(Template, {
    through: TemplateCampo,
    foreignKey: "campoId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
}
