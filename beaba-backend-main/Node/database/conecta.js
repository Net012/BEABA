import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("beaba", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
});
