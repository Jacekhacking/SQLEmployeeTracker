const inquirer = require('inquirer');
const db = require ('./db/connection');

function mainMenu(){
    inquirer.prompt([{
        name: "answer", 
        message: "What would you like to do?",
        type: "list",
        choices: [{
            name: "View All Employees",
            value: "viewAllEmployees",
        },{
            name: "Add An Employee",
            value: "addEmployee",
        },{
            name:"View All Departments",
            value:"viewAllDepartments"
        },{
            name:"View All Roles",
            value: "viewAllRoles"
        },{
            name: "Add a Department",
            value: "addDepartment"
        },{
            name:"Add a role",
            value:"addRole"
        },{
            name:"Update an Employee Role",
            value:"updateEmployeeRole"
        },
        {
            name:"exit",
            value: "exit"
        }]
    }]).then(function(data){
        console.log(data)
        switch (data.answer){
            case "viewAllEmployees":
                viewEmployees()
                
                break;
            case "addEmployee":
                //put code here
            createEmployee()
                break;
            case "viewAllDepartments":
                viewAllDepartments()
                break;
            case "viewAllRoles":
                viewAllRoles()
                break;
            case "addDepartment":
                addDepartment()
                break;
            case "addRole":
                addRole()
                break;
            case "updateEmployeeRole":
                updateEmployeeRole()
                break;
                default: 
                process.exit(0)
        }
    });
};

function viewEmployees(){
db.query("select employee.id, employee.first_name, employee.last_name, role.title , manager.first_name as manager_first, manager.last_name as manager_last, role.salary, department.name as department from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on employee.manager_id = manager.id", (err,data) => {
    if (err) throw err
    console.table(data)
    mainMenu()

})
}

async function createEmployee(){
    var roleTable = await db.promise().query("select * from role")
    var managerTable = await db.promise().query("select id, first_name, last_name from employee")
    inquirer.prompt([{
        name:"firstName",
        message:"What is the employee's first name?",
        type: "input"
    },{
        name: "lastName",
        message: "what is the employee's last name?",
        type: "input"
    },{
        name:"employeeRole",
        message:"what is the employee's role?",
        type:"list",
        choices: roleTable[0].map(role => ({name:role.title,value: role.id}))
    }
    ,{
        name:"employeeManager",
        message:"what is the employee's manager?",
        type:"list",
        choices: managerTable[0].map(manager => ({name: `${manager.first_name} ${manager.last_name}`, value: manager.id}))
    }]).then(function(data){
        db.query("insert into employee set ?",[{
            first_name: data.firstName,
            last_name: data.lastName,
            role_id: data.employeeRole,
            manager_id: data.employeeManager
        }],(err,data) => {
            if (err) throw err
            console.log("Employee Added")
            mainMenu()
        })
    })
}
function viewAllDepartments(){
db.query("select * from department", (err,data) =>{
    if(err) throw err
    console.table(data)
    mainMenu()
})
}
function viewAllRoles(){
db.query("select title, role.id, salary, department.name as department from role left join department on role.department_id = department.id", (err,data) =>{
    if(err) throw err
    console.table(data)
    mainMenu()
})
}
function addDepartment(){
    inquirer.prompt([{
        name:"departmentName",
        message:"What is the name of the new department?",
        type: "input"
    }]).then((data) => {
        db.query("insert into department set ?",[{
            name: data.departmentName
        }],(err,data) => {
            if(err) throw err
            console.log("Department Added")
            mainMenu()
        })
    })
}
async function addRole() {
    var departmentTable = await db.promise().query("select * from department")
    var data = await inquirer.prompt([{
        name:"roleName",
        message:"What is the name of the new roll?",
        type:"input"
    },{
        name:"newRoleSalary",
        message:"what is the salary of the new roll?",
        type:"input"
    },{
        name:"newRoleDepartment",
        message:"what is the department of the new roll?",
        type:"list",
        choices: departmentTable[0].map( department => ({name:department.name,value:department.id}))
    }])
        var whatever = await db.promise().query("insert into role set ?",[{
            title: data.roleName,
            salary: data.newRoleSalary,
            department_id: data.newRoleDepartment,
        }])
            console.log("New Role Added")
            mainMenu()
}
async function updateEmployeeRole(){
    var employeeTable = await db.promise().query("select id, first_name, last_name from employee")
    var roleTable = await db.promise().query("select * from role")
    var userInput = await inquirer.prompt([{
        name:"selectedEmployee",
        message:"who's role do you want to update?",
        type:"list",
        choices: employeeTable[0].map(employee => ({name: `employee: ${employee.first_name} ${employee.last_name}`,value:employee.id}))
    },{
        name:"newRole",
        message:"what's the new role for this employee?",
        type:"list",
        choices: roleTable[0].map(role => ({name:role.title, value: role.id}))
    }])
    db.query("update employee set role_id=? where id = ?", [
        userInput.newRole,
        userInput.selectedEmployee
    ],(err,data) => {
        if(err) throw err
        mainMenu()
    })
}
mainMenu()