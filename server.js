const mysql = require('mysql');
const inquirer = require('inquirer');
const password = require('./config.js');

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