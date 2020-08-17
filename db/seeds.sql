INSERT INTO departments (name)
VALUES ('Administrative'), ('Development'), ('Quality Assurance'), ('Customer Support');

INSERT INTO roles (title, salary, department_id)
VALUES
('President', 200000.00, 1),
('Vice President', 100000.00, 1),
('Accountant', 70000.00, 1),
('Department Head', 90000.00, 1),
('Senior Software Engineer', 80000.00, 2),
('Software Engineer', 60000.00, 2),
('Junior Developer', 50000.00, 2),
('Database Admin', 70000.00, 2),
('QA Lead', 40000.00, 3),
('QA Tester', 35000.00, 3),
('Senior Support Representative', 35000.00, 4),
('Support Representative', 30000.00, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Jack', 'Johnson', 1, NULL),
('Tom', 'Johnson', 2, 1),
('Janie', 'Julian', 3, 2),
('Chuck', 'McGee', 4, 2),
('Frank', 'Masters', 5, 4),
('Ada', 'Finkle', 6, 4),
('Art', 'Dodger', 6, 4),
('Timmy', 'Buttons', 7, 4),
('Robert', 'Tables', 8, 4),
('Kathy', 'Fyres', 4, 2),
('Mary', 'Pippen', 9, 10),
('Bill', 'Hand', 10, 10),
('Taylor', 'Slow', 10, 10),
('Al', 'Batross', 4, 2),
('Marge', 'Rita', 11, 14),
('Billie', 'Atoll', 12, 14),
('Mark', 'Holt', 12, 14);
