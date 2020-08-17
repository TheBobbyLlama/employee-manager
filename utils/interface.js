const connection = require("../db/db");
const inquirer = require("inquirer");

function mainMenu() {
	inquirer.prompt([{
		type: "list",
		name: "action",
		message: "What would you like to do?",
		choices: [
			"View All Departments",
			"View All Roles",
			"View All Employees",
			"Add a Department",
			"Add a Role",
			"Add an Employee",
			"Update an Employee Role",
			"Exit Program"
		]
	}]).then(answers => {
		switch (answers.action) {
			case "View All Departments":
				viewAllDepartments();
				break;
			case "View All Roles":
				viewAllRoles();
				break;
			case "View All Employees":
				viewAllEmployees();
				break;
			case "Add a Department":
				addDepartment();
				break;
			case "Add a Role":
				addRole();
				break;
			case "Add an Employee":
				addEmployee();
				break;
			case "Update an Employee Role":
				updateEmployeeRole();
				break;
			default:
				connection.end();
				return;
		}
	});
}

function showError(err) {
	if (err.fatal) {
		throw err;
	} else {
		console.log("An error has been encountered!", err);
	}
}

function showQuery(sql) {
	connection.query(sql, function(err, res) {
		if (err) {
			showError(err);
		} else {
			console.table(res);
		}

		mainMenu();
	});
}

function viewAllDepartments() {
	const sql = `SELECT name AS Name, id AS ID FROM departments`;

	showQuery(sql);
}

function viewAllRoles() {
	const sql = `SELECT roles.title AS Title, roles.id AS ID, departments.name AS Department, CONCAT('$', roles.salary) AS Salary FROM roles
	LEFT JOIN departments ON departments.id = roles.department_id`;

	showQuery(sql);
}

function viewAllEmployees() {
	const sql = `SELECT employees.id AS ID, employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS Role, CONCAT(managers.first_name, ' ', managers.last_name) AS Manager FROM employees
	LEFT JOIN roles ON roles.id = employees.role_id
	LEFT JOIN employees AS managers ON managers.id = employees.manager_id`;

	showQuery(sql);
}

function addDepartment() {
	inquirer.prompt([{
		type: "text",
		name: "name",
		message: "Enter the new department name:"
	}]).then((answers) => {
		const sql = `INSERT INTO departments (name)
		VALUES (?)`;

		connection.query(sql, [ answers.name ], function(err, res) {
			if (err) {
				showError(err);
			} else {
				console.log("Department added successfully!");
			}

			mainMenu();
		})
	});
}

function addRole() {
	const sql = `SELECT id, name FROM departments`;

	connection.query(sql, function(err, res) {
		if (err) {
			showError(err);
		} else {
			inquirer.prompt([{
				type: "text",
				name: "title",
				message: "Enter the new role's name:"
			},
			{
				type: "number",
				name: "salary",
				message: "Enter the new role's salary: $",
				validate: function (input) {
					return (parseFloat(input) > 0);
				}
			},
			{
				type: "list",
				name: "department",
				message: "Choose the new role's parent department:",
				choices: res.map(element => element.name)
			}]).then((answers) => {
				// Find our department index and stuff it into answers.
				answers.deptId = res.find(element => element.name == answers.department).id;
				insertRole(answers);
			});
		}
	});
}

function insertRole(answers) {
	const sql = `INSERT INTO roles (title, salary, department_id)
	VALUES
	(?, ?, ?)`;

	connection.query(sql, [ answers.title, answers.salary, answers.deptId ], function(err, res) {
		if (err) {
			showError(err);
		} else {
			console.log("Role added successfully!");
		}

		mainMenu();
	});
}

function addEmployee() {
	const roleSQL = `SELECT title, id FROM roles`;

	connection.query(roleSQL, function(err, roleResults) {
		if (err) {
			showError(err);
			mainMenu();
		} else {
			const managerSQL = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees`;

			connection.query(managerSQL, function (err, managerResults) {
				if (err) {
					showError(err);
					mainMenu();
				} else {
					const managerList = managerResults.map(element => element.name);
					managerList.splice(0, 0, "None");

					inquirer.prompt([{
						type: "text",
						name: "first_name",
						message: "Enter the employee's first name:"
					},
					{
						type: "text",
						name: "last_name",
						message: "Enter the employee's last name:"
					},
					{
						type: "list",
						name: "role",
						message: "Select the employee's role:",
						choices: roleResults.map(element => element.title)
					},
					{
						type: "list",
						name: "manager",
						message: "Select the employee's manager:",
						choices: managerList
					}]).then((answers) => {
						let tmpRole = roleResults.find(element => element.title == answers.role);
						answers.roleId = (tmpRole) ? tmpRole.id : null;
						let tmpManager = managerResults.find(element => element.name == answers.manager);
						answers.managerId = (tmpManager) ? tmpManager.id : null;

						insertEmployee(answers);
					})
				}
			})
		}
	})
}

function insertEmployee(answers) {
	const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
	VALUES
	(?, ?, ?, ?)`;

	connection.query(sql, [ answers.first_name, answers.last_name, answers.roleId, answers.managerId ], function(err, res) {
		if (err) {
			showError(err);
		} else {
			console.log("Employee added successfully!");
		}

		mainMenu();
	});
}

function updateEmployeeRole() {
	const employeeSQL = `SELECT id, CONCAT(first_name, ' ', last_name) AS name, role_id FROM employees`;

	connection.query(employeeSQL, function(err, employeeResults) {
		if (err) {
			showError(err);
			mainMenu();
		} else {
			inquirer.prompt([{
				type: "list",
				name: "employee",
				message: "Select the employee you want to modify:",
				choices: employeeResults.map(element => element.name)
			}]).then((employeeAnswers) => {
				const roleSQL = `SELECT id, title FROM roles`;
				let tmpEmployee = employeeResults.find(element => element.name == employeeAnswers.employee);
				let employeeId = (tmpEmployee) ? tmpEmployee.id : null;

				connection.query(roleSQL, function(err, roleResults) {
					if (err) {
						showError(err);
						mainMenu();
					} else {
						inquirer.prompt([{
							type: "list",
							name: "role",
							message: "Select the employee's new role:",
							choices: roleResults.map(element => element.title)
						}]).then((roleAnswers) => {
							if (err) {
								showError(err);
								mainMenu();
							} else {
								let tmpRole = roleResults.find(element => element.title == roleAnswers.role);
								let roleId = (tmpRole) ? tmpRole.id : null;

								if (roleId != tmpEmployee.role_id) {
									const updateSQL = `UPDATE employees SET role_id = ? 
									WHERE id = ?`;

									connection.query(updateSQL, [ roleId, employeeId ], function(err, updateResults) {
										if (err) {
											showError(err);
										} else {
											console.log("Employee updated!");
										}

										mainMenu();
									})
								} else {
									console.log("Employee role was not changed.");
									mainMenu();
								}
							}
						})
					}
				})
			})
		}
	})
	mainMenu();
}

module.exports = mainMenu;