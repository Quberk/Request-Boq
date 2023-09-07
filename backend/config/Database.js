import { Sequelize } from "sequelize";

const db = new Sequelize('RequestBoq', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;
