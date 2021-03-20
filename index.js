const mysql = require('mysql');
const inquirer = require('inquirer');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'artydabomb',
    database: 'org_DB',
});

const mainMenu = () => {
    inquirer
        .prompt([

            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'init',
                choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'Exit'],
            }]
        )
        .then(answers => {
            console.log(answers);
            switch (answers.init) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Employees By Department':
                    viewAllEmployeesbyDepartment();
                    break;
                case 'View All Employees By Manager':
                    viewAllEmployeesbyManager();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Remove Employee':
                    removeEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Employees By Manager':
                    updateEmployeeManager();
                    break;
                case 'Exit':
                    console.log("Quitting program...")
                    process.exit();
                default:
                    console.log(`Something went wrong. Please select one of the options.`);
                    mainMenu();
            }

        }).catch(error => {
            console.log(error)

        });
};

const viewAllEmployees = () => {
    connection.query(
        'SELECT employee.`id`, employee.`first_name`,  employee.`last_name`, role.`title`, department.`name` AS department, role.`salary`, CONCAT(manager.`first_name`, " ",manager.`last_name`) AS manager FROM employee LEFT JOIN role ON employee.`role_id` = role.`id` LEFT JOIN department ON role.`department_id` = department.`id` LEFT JOIN employee manager ON manager.`id` = employee.`manager_id`;',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            // re-prompt the user for if they want to bid or post
            mainMenu();
        }
    );
};

const viewAllEmployeesbyDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which department would you like to view?',
                name: 'empdep',
                choices: ['Sales', 'Reception', 'Accounting', 'Customer Relations', 'Human Resources', 'Intern', 'Manager', 'Director', 'Executive'],
            }
        ])
        .then(answers => {
            console.log(answers.empdep);
            connection.query(`SELECT * FROM department WHERE name = "${answers.empdep}"`, function (err, result) {
                if (err) throw err;
                console.log(result);
                connection.query(`SELECT employee.id, employee.first_name,  employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ",manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE employee.role_id = "${result[0].id}"`, function (err, result) {
                    if (err) throw err;
                    console.table(result);
                })
            })
        });
};

const viewAllEmployeesbyManager = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which manager of the employee would you like to view?',
                name: 'empman',
                choices: [],
            },
        ])
        .then(answers => {
            console.log(answers.empman);
            connection.query(`SELECT * FROM department WHERE name = "${answers.empdep}"`, function (err, result) {
                if (err) throw err;
                console.log(result);
                connection.query(`SELECT employee.id, employee.first_name,  employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ",manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE employee.role_id = "${result[0].id}"`, function (err, result) {
                    if (err) throw err;
                    console.table(result);
                })
            })
        });
};

const addEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: "What is the employee's first name?",
                name: 'empfirst',
            },
            {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'emplast',
            },
            {
                type: 'input',
                message: "What is the employee's role?",
                name: 'emprole',
            },
            {
                type: 'input',
                message: "Who is the employee's manager?",
                name: 'empman',
            },
        ])
        .then(answers => {
            console.log(answers);
            err =>
                err ? console.error(err) : console.log("Success! Response added to file.");
        });
};

const removeEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which employee would you like to remove?',
                name: 'empremove',
                choices: [],
            },
        ])
        .then(answers => {
            console.log(answers.empremove);
            err =>
                err ? console.error(err) : console.log("Success! Response added to file.");
        });
};

const updateEmployeeRole = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: "Which employee's role would you like to update?",
                name: 'roleupdate',
                choices: [],
            },
            {
                type: 'list',
                message: "What is this employee's new role?",
                name: 'newrole',
                choices: [],
            },
        ])
        .then(answers => {
            console.log(answers);
            err =>
                err ? console.error(err) : console.log("Success! Response added to file.");
        });
};

const updateEmployeeManager = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: "Which employee's manager do you want to update?",
                name: 'managerupdate',
                choices: [],
            },
            {
                type: 'list',
                message: "Which employee do you want to set as manager for the selected employee?",
                name: 'newmanager',
                choices: [],
            },
        ])
        .then(answers => {
            console.log(answers);
            err =>
                err ? console.error(err) : console.log("Success! Response added to file.");
        });
};

mainMenu();
