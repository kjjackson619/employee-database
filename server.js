
const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'B0aHanc0ck1',
        database: 'employee_data'
    },
    console.log('Connected to the employee database.')
);
// inquirer
//     .prompt([
//         {
//             type: 'list',
//             name: 'options',
//             message: 'What would you like to do?',
//             choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
//         },

//         {
//             type: 'input',
//             name: 'addDepartment',
//             message: 'What is the name of the department?',
//             when: (answers) =>
//                 answers.options === 'Add Department'
//         },

//         {
//             type: 'input',
//             name: 'role',
//             message: 'What is the name of the role?',
//             when: (answers) =>
//                 answers.options === 'Add Role'

//         },

//         {
//             type: 'input',
//             name: 'salary',
//             message: 'What is the salary of the role?'
//         },

//         {
//             type: 'list',
//             name: 'departmentRole',
//             message: 'Which department does the role belong to?',
//             choices: ['Engineering', 'Finance', 'Legal', 'Sales', 'Service']
//         },

//         {
//             type: 'input',
//             name: 'firstName',
//             message: 'What is the employee first name?',
//             when: (answers) =>
//                 answers.options === 'Add Employee'

//         },

//         {
//             type: 'input',
//             name: 'lastName',
//             message: 'What is the employee last name?'
//         },

//         {
//             type: 'list',
//             name: 'employeeRole',
//             message: 'What is the employee role?',
//             choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service']
//         },

//         {
//             type: 'list',
//             name: 'manager',
//             message: 'Who is the employee manager?',
//             choices: ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown']
//         },

//         {
//             type: 'list',
//             name: 'updateRole',
//             message: 'Which employee role do you want to update?',
//             choices: ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown', 'Sarah Lourd', 'Tom Allen', 'Sam Kash'],
//             when: (answers) =>
//                 answers.options === 'Update Employee Role'
//         },

//         {
//             type: 'list',
//             name: 'selectNewRole',
//             message: 'Which role do you want to assign the selected employee?',
//             choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service']
//         }
//     ])

//     .then(answers => console.log(answers));




app.get('/api/employee', (req, res) => {
    const sql = `SELECT employee.*, role.title
    AS role_title
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });

    });
});



app.get('/api/employee/:id', (req, res) => {
    const sql = `SELECT employee.*, role.title
    AS role_title
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    WHERE employee.id = ?`;

    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;

        }
        res.json({
            message: 'success',
            data: row
        });

    });
});



app.delete('/api/employee/:id', (req, res) => {

    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });

        } else if (!result.affectedRows) {
            res.json({
                message: 'Employee not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }

    });
});


app.post('/api/employee', ({ body }, res) => {

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES(?,?,?,?)`;

    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;

        }
        res.json({
            message: 'success',
            data: body
        });

    });

});



app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

