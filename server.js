const inquirer = require('inquirer');
const express = require('express')
const db = require('./db/connection');
const figlet = require('figlet');
const cTable = require('console.table');
//const router = express.Router();

const apiRoutes = require('./routes/apiRoutes');


const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes);



function start() {
    let question = 'What would you like to do?';
    let choices = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit'];

    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: question,
            choices: choices
        }).then((data) => {
            switch (data.action) {
                case 'View All Employees':
                    viewEmployees();
                    start();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployee();
                    break;

                case 'View All Roles':
                    viewRoles();
                    start();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'View All Departments':
                    viewDepartments();
                    start();
                    break;

                case 'Add Department':
                    addDepartment();
                    start();
                    break;

                case 'Exit':
                    console.log("Changes made, thank you for accessing database. Goodbye!");
                    break;

                default:
                    console.log(`Action (${data.action}) is not supported.`);
                    break;

            }
        });
}


app.use((req, res) => {
    res.status(404).end();
});

db.connect(err => {
    if (err) throw err;
    figlet('Employee Database', function (err, data) {
        if (err) {
            console.log('art not loaded');
        }
        else {
            console.log(data);
        }
    })
    console.log('Database connected');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    start();
});





