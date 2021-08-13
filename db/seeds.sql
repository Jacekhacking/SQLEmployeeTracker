USE employee_db;

insert into department (name)
values
("sales"),
("accounting"),
("HR"),
("research");

insert into role(title,salary,department_id)
values
("lead", 200, 1),
("accountant", 500, 2),
("manager", 250, 3),
("team lead", 150,4);

insert into employee(first_name, last_name, role_id, manager_id)
values
("matt", "tree", 1, null),
("sarah", "hart", 1, 1),
("kim", "wall", 2, null),
("chris", "wunderli", 2, 3),
("cory", "waller", 4, null),
("connor", "harris", 3, null);

