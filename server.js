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
    let choices = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Delete Employee', 'Exit'];

    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: question,
            loop: false,
            choices: choices
        }).then((data) => {
            switch (data.action) {
                case 'View All Employees':
                    view('EMPLOYEE');
                    start();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployee();
                    break;

                case 'View All Roles':
                    view('ROLE');
                    start();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'View All Departments':
                    view('DEPARTMENT');
                    start();
                    break;

                case 'Add Department':
                    addDepartment();
                    start();
                    break;

                case 'Delete Employee':
                    deleteEmployee();
                    start();
                    break;

                case 'Exit':
                    console.log("Changes made, thank you for accessing database. Goodbye!");
                    break;

                default:
                    console.log(`Action (${data.action}) is not supported.`);
                    start();
                    break;

            }
        });
};


const view = (table) => {

    if (table === 'DEPARTMENT') {
        query = `SELECT * FROM DEPARTMENT`;
    } else if (table === 'ROLE') {
        query = `SELECT * FROM ROLE`
    } else {
        query = `SELECT employee.*, role.title
        AS role_title
        FROM employee
        LEFT JOIN role
        ON employee.role_id = role.id`;
    }

    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
};


const addEmployee = () => {
    db.query(`SELECT * FROM EMPLOYEE`, (err, employeeResult) => {
        if (err) throw err;
        const newEmployee = [
            {
                name: 'None',
                value: 0
            }
        ];
        employeeResult.forEach(({ first_name, last_name, id }) => {
            newEmployee.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        db.query(`SELECT * FROM ROLE`, (err, roleResult) => {
            if (err) throw err;
            const newRole = [];
            roleResult.forEach(({ title, id }) => {
                newRole.push({
                    name: title,
                    value: id
                });
            });

            let questions = [
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the employee's last name?"
                },
                {
                    type: "list",
                    name: "role_id",
                    choices: newRole,
                    message: "What is the employee's role?"
                },
                {
                    type: "list",
                    name: "manager_id",
                    choices: newEmployee,
                    message: "Who is the employee's manager? (could be null)"
                }
            ]
            inquirer.prompt(questions).then(response => {
                const query = `INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES (?)`;
                let manager_id = response.manger_id !== 0 ? response.manager_id : null;
                db.query(query, [[response.first_name, response.last_name, response.role_id, manager_id]], (err, res) => {
                    if (err) throw err;
                    console.log('Successfully added employee!');
                    start();
                });
            });
        })
    });
};

const deleteEmployee = () => {
    db.query(`SELECT * FROM EMPLOYEE`, (err, res) => {
        if (err) throw err;

        const selectedEmployee = [];
        res.forEach(({ first_name, last_name, id }) => {
            selectedEmployee.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        let questions = [
            {
                type: "list",
                name: "id",
                choices: selectedEmployee,
                message: "Which employee do you want to delete?"
            }
        ];
        inquirer.prompt(questions).then(response => {
            const query = `DELETE FROM EMPLOYEE WHERE id = ?`;
            db.query(query, [response.id], (err, res) => {
                if (err) throw err;
                console.log('Employee has been removed from database.');
                start();
            });
        });
    });
};

const addDepartment = () => {
    let questions = [
        {
            type: "input",
            name: "name",
            message: "What is the new department name?"
        }
    ];
    inquirer.prompt(questions).then(response => {
        const query = `INSERT INTO DEPARTMENT (name) VALUES (?)`;
        db.query(query, [response.name], (err, res) => {
            if (err) throw err;
            console.log('Successfully added new department!');
            start();
        });
    });
};

const addRole = () => {
    const departments = [];
    db.query(`SELECT * FROM DEPARTMENT`, (err, res) => {
        if (err) throw err;

        res.forEach(department => {
            let newDepartment = {
                name: department.name,
                value: department.id
            }
            departments.push(newDepartment);
        });
        let questions = [
            {
                type: "input",
                name: "title",
                message: "What is the title of the new role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the new role?"
            },
            {
                type: "list",
                name: "departement",
                choices: departments,
                messgae: "Which department is this role in?"
            }
        ];
        inquirer.prompt(questions).then(response => {
            const query = `INSERT INTO ROLE (title, salary, department_id) VALUES (?)`;
            db.query(query, [[response.title, response.salary, response.department]], (err, res) => {
                if (err) throw err;
                console.log('Successfully added new role!');
                start();
            });
        });
    });
};

const updateEmployee = () => {
    db.query("SELECT * FROM EMPLOYEE", (err, employeeResult) => {
        if (err) throw err;
        const selectedEmployee = [];
        employeeResult.forEach(({ first_name, last_name, id }) => {
            selectedEmployee.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        db.query("SELECT * FROM ROLE", (err, roleResult) => {
            if (err) throw err;
            const selectedRole = [];
            roleResult.forEach(({ title, id }) => {
                selectedRole.push({
                    name: title,
                    value: id
                });
            });

            let questions = [
                {
                    type: "list",
                    name: "id",
                    choices: selectedEmployee,
                    message: "whose role do you want to update?"
                },
                {
                    type: "list",
                    name: "role_id",
                    choices: selectedRole,
                    message: "what is the employee's new role?"
                }
            ];

            inquirer.prompt(questions)
                .then(response => {
                    const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
                    db.query(query, [{ role_id: response.role_id }, "id", response.id], (err, res) => {
                        if (err) throw err;
                        console.log("successfully updated employee's role!");
                        start();
                    });
                });
        });
    });
};

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





