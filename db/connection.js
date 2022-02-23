const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'B0aHanc0ck1',
        database: 'employee_data'
    },
    console.log('Connected to the employee database.')
);

module.exports = db;