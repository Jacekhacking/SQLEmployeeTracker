DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

create table department(
id INT auto_increment primary key,
name varchar(30)
);

create table role(
id INT auto_increment primary key,
title varchar(30),
salary decimal,
department_id int, 
foreign key(department_id) references department(id)
);

create table employee(
id INT auto_increment primary key,
first_name varchar(30),
last_name varchar(30),
role_id int,
manager_id int,
foreign key (role_id) references role(id),
foreign key (manager_id) references employee(id)
);