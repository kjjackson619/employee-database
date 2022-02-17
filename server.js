const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


inquirer
    .prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
        },

        {
            type: 'input',
            name: 'addDepartment',
            message: 'What is the name of the department?',
            when: (answers) =>
                answers.options === 'Add Department'
        },

        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role?',
            when: (answers) =>
                answers.options === 'Add Role'

        },

        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
        },

        {
            type: 'list',
            name: 'departmentRole',
            message: 'Which department does the role belong to?',
            choices: ['Engineering', 'Finance', 'Legal', 'Sales', 'Service']
        },

        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employee first name?',
            when: (answers) =>
                answers.options === 'Add Employee'

        },

        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employee last name?'
        },

        {
            type: 'list',
            name: 'employeeRole',
            message: 'What is the employee role?',
            choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service']
        },

        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employee manager?',
            choices: ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown']
        },

        {
            type: 'list',
            name: 'updateRole',
            message: 'Which employee role do you want to update?',
            choices: ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown', 'Sarah Lourd', 'Tom Allen', 'Sam Kash'],
            when: (answers) =>
                answers.options === 'Update Employee Role'
        },

        {
            type: 'list',
            name: 'selectNewRole',
            message: 'Which role do you want to assign the selected employee?',
            choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service']
        }
    ])

    .then(answers => console.log(answers));



app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

