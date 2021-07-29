const mysql = require('mysql');
const inquirer = require('inquirer');
const pass = require('./config.js');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: pass,
    database: 'employeeDB',
});

connection.connect((err) => {
    if (err) throw err; 
    init();
});