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

const addDepartment = () => {
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'Enter the department name you would like to add:'
    })
    .then(response => {
        const query = 'INSERT INTO department SET ?';
        connection.query(query, {name: response.departmentName}, (err, res) => {
                if (err) throw err;
                console.log(`Successfully department ${response.departmentName} has been added!`);
                viewEntity();
            });
    });
};

const addRole = () => {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter a title for this role:'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for this role:'
        },
        {
            name: 'departmentID',
            type: 'input',
            message: 'Enter the department_id for this role:'
        }
    ])
    .then(response => {
        const query = 'INSERT INTO role SET ?';
        connection.query(query, 
            {
                title: response.title,
                salary: response.salary,
                department_id: response.departmentID
            },
            (err, res) => {
                if (err) throw err;
                console.log(`Successfully role title ${response.title} has been added!`);
                viewEntity();
            });
    });
};

const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter the firstName of an employee:'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter the lastName of an employee:'
        },
        {
            name: 'roleID',
            type: 'input',
            message: 'Enter the role_id for this employee:'
        },
        {
            name: 'managerID',
            type: 'input',
            message: 'Enter the manager_id for this employee, if there is one:'
        }
    ])
    .then(response => {
        if(response.managerID === "") {
            response.managerID = null
        } 
       
        console.log('This is the response:', response);
        const query = 'INSERT INTO employee SET ?';
        connection.query(query, 
            {
                first_Name: response.firstName,
                last_Name: response.lastName,
                role_id: response.roleID,
                manager_id: response.managerID
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${response.firstName} ${response.lastName} successfully added as a new employee!`);
                viewEntity();
            });
    });
};


const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            name: 'employeeID',
            type: 'input',
            message: 'Enter the employee_id of employee:'
        },
        {
            name: 'roleID',
            type: 'input',
            message: 'Enter the new role_id of the employee:'
        },
    ])
    .then(response => {
        const query = `UPDATE employee SET employee.role_id = ${response.roleID} WHERE employee.id = ${response.employeeID}`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log('Employee role_id has been updated!');
            viewEntity();
        });
    });
};

const deleteEntity = () => {
    inquirer.prompt({
        name: 'option',
        type: 'rawlist',
        message: 'Enter an entity to delete:',
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
                deleteDepartment();
                break;
            case 'Employee Role':
                deleteRole();
                break;
            case 'Employee':
                deleteEmployee();
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

const deleteDepartment = () => {
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'Enter the department name you would like to delete:'
    })
    .then(response => {
        const query = `DELETE FROM department WHERE name = '${response.departmentName}'`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`Successfully department ${response.departmentName} has been deleted!`);
            viewEntity();
        });
    });
};

const deleteRole = () => {
    inquirer.prompt({
        name: 'title',
        type: 'input',
        message: 'Enter the role-title you would like to delete:'
    })
    .then(response => {
        const query = `DELETE FROM role WHERE title = '${response.title}'`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`Successfully role ${response.title} has been deleted!`);
            viewEntity();
        });
    });
};

const deleteEmployee = () => {
    inquirer.prompt({
        name: 'employeeID',
        type: 'input',
        message: 'Enter the employee_id of the employee you would like to delete:'
    })
    .then(response => {
        const query = `DELETE FROM employee WHERE id = '${response.employeeID}'`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`Successfully employee_id ${response.employeeID} has been deleted!`);
            viewEntity();
        });
    });
};
