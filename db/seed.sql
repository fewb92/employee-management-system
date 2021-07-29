USE employeeDB;

INSERT INTO department (name)
VALUES
("Operations"),
("Campaigns"),
("Marketing");
("Executive");

INSERT INTO role (title, salary, department_id)
VALUES
("Operations Manager", 50000, 1),
("Operations Director", 75000, 1),
("Campaigns Manager", 50000, 2),
("Campaigns Director", 75000, 2),
("Marketing Director", 100000, 3),
("CEO", 250000, 4),
("CFO", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Leon", "Rose", 1, null),
("Ed", "Smith", 2, null),
("Junior", "Rivera", 3, null),
("Eric", "Villanueva", 4, null),
("Stephanie", "Baxter", 5, 2);
("Kim", "Young", 6, 2);