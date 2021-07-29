const mysql = require('mysql');
const inquirer = require('inquirer');
const password = require('./config.js');
const { connect } = require('http2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: password,
    database: 'employeeDB',
});

connection.connect((err) => {
    if (err) throw err; 
    init();
});

const init = () => {
    inquirer.prompt({
        name: 'option',
        type: 'rawlist',
        message: 'Please select from one of the options below:',
        choices: [
            'Add a department, role, or an employee',
            'View a department, role, or an employee',
            'Update an employee role',
            'Delete a department, role or an employee',
            'Exit the Application!'
        ],
    })
    .then (response => {
        switch(response.option) {
            case 'Add a department, role, or an employee':
                addEntity();
                break;
            case 'View a department, role, or an employee':
                viewEntity();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Delete a department, role or an employee':
                deleteEntity();
                break;
            case 'Exit the Application!':
                connection.end();
                break;
            default: 
            console.log(`Invalid option: ${response.option}`);
            break;
        }
    });
};

const viewEntity = () => {
    inquirer.prompt({
        name: 'option',
        type: 'rawlist',
        message: 'Enter an entity to view:',
        choices: [
            'Departments',
            'Employee Roles',
            'Employees',
            'Return to previous prompts!'
        ],
    })
    .then(response => {
        switch (response.option) {
            case 'Departments':
                viewDepartments();
                break;
            case 'Employee Roles':
                viewRoles();
                break;
            case 'Employees':
                viewEmployees();
                break;
            case 'Return to previous prompts!':
                init();
                break;
            default: 
            console.log(`Invalid optiion ${response.option}`);
            break;
        }
    });
};

const viewDepartments = () => {
    const query = 'SELECT * FROM department';
    connection.query(query, (err,data) => {
        if (err) throw err;
        console.table(data)
        viewEntity()
    })
}
const viewRoles = () => {
    const query = 'SELECT * FROM role';
    connection.query(query, (err,data) => {
        if (err) throw err;
        console.table(data)
        viewEntity()
    })
}
const viewEmployees = () => {
    const query = 'SELECT * FROM employee';
    connection.query(query, (err,data) => {
        if (err) throw err;
        console.table(data)
        viewEntity()
    })
}

const addEntity = () => {
    inquirer.prompt({
        name: 'option',
        type: 'rawlist',
        message: 'Enter an entity to add:',
        choices: [
            'Department',
            'Employee Role',
            'Employee',
            'Return to previous prompts!'
        ],
    })
    .then(response => {
        switch (response.option) {
            case 'Department':
                addDepartment();
                break;
            case 'Employee Role':
                addRole();
                break;
            case 'Employee':
                addEmployee();
                break;
            case 'Return to previous prompts!':
                init();
                break;
            default: 
            console.log(`Invalid optiion ${response.option}`);
            break;
        }
    });
};
