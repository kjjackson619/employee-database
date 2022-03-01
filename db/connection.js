const mysql = require('mysql2');
const Sequelize = require('sequelize');
require('dotenv').config();




const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});



console.log('Connected to the employee database.');

module.exports = sequelize;
