-- University Accommodation Office Seed Data (Group 1)
-- ---------------------------------------------------------
-- This script populates the database with test data for reports (a-n).

USE accommodation_db;

-- 1. Populate Staff
INSERT INTO Staff (staff_number, first_name, last_name, email, address, dob, gender, position, location, department, telephone, room_number) VALUES
(1001, 'Jane', 'Doe', 'jane.doe@univ.edu', '123 Maple St', '1960-05-15', 'F', 'Hall Manager', 'Hall A', 'Management', '555-0101', 'M101'),
(1002, 'John', 'Smith', 'john.smith@univ.edu', '456 Oak St', '1955-11-20', 'M', 'Hall Manager', 'Hall B', 'Management', '555-0102', 'M102'),
(1003, 'Alice', 'Johnson', 'alice.j@univ.edu', '789 Pine St', '1975-03-10', 'F', 'Adviser', 'Office 101', 'Student Services', '555-0103', 'A101'),
(1004, 'Bob', 'Brown', 'bob.b@univ.edu', '101 Birch St', '1962-08-05', 'M', 'Adviser', 'Office 102', 'Student Services', '555-0104', 'A102'),
(1005, 'Charlie', 'Davis', 'charlie.d@univ.edu', '202 Cedar St', '1964-12-30', 'M', 'Residence Staff', 'Hall A', 'Cleaning', '555-0105', 'S101');

-- 2. Populate Halls Of Residence
INSERT INTO HallOfResidence (hall_name, address, telephone, manager_id) VALUES
('Hall A', 'University West Campus', '555-2001', 1001),
('Hall B', 'University East Campus', '555-2002', 1002);

-- 3. Populate Student Apartments (Groups of 3, 4, or 5)
INSERT INTO StudentApartment (flat_number, address, available_bedrooms) VALUES
('Flat 101', '10 Main Street', 3),
('Flat 102', '20 Main Street', 4),
('Flat 103', '30 Main Street', 5);

-- 4. Populate Rooms (Place Number 1-46)
INSERT INTO Room (room_number, room_type, monthly_rent, hall_name, flat_number) VALUES
-- Hall A (Places 1 - 22)
('1A', 'Single', 20000.00, 'Hall A', NULL),
('1B', 'Single', 20000.00, 'Hall A', NULL),
('A-01', 'Single', 20000.00, 'Hall A', NULL), ('A-02', 'Single', 20000.00, 'Hall A', NULL),
('A-03', 'Single', 20000.00, 'Hall A', NULL), ('A-04', 'Single', 20000.00, 'Hall A', NULL),
('A-05', 'Single', 20000.00, 'Hall A', NULL), ('A-06', 'Single', 20000.00, 'Hall A', NULL),
('A-07', 'Single', 20000.00, 'Hall A', NULL), ('A-08', 'Single', 20000.00, 'Hall A', NULL),
('A-09', 'Single', 20000.00, 'Hall A', NULL), ('A-10', 'Single', 20000.00, 'Hall A', NULL),
('A-11', 'Single', 20000.00, 'Hall A', NULL), ('A-12', 'Single', 20000.00, 'Hall A', NULL),
('A-13', 'Single', 20000.00, 'Hall A', NULL), ('A-14', 'Single', 20000.00, 'Hall A', NULL),
('A-15', 'Single', 20000.00, 'Hall A', NULL), ('A-16', 'Single', 20000.00, 'Hall A', NULL),
('A-17', 'Single', 20000.00, 'Hall A', NULL), ('A-18', 'Single', 20000.00, 'Hall A', NULL),
('A-19', 'Single', 20000.00, 'Hall A', NULL), ('A-20', 'Single', 20000.00, 'Hall A', NULL),

-- Hall B (Places 23 - 43)
('2A', 'Double', 20000.00, 'Hall B', NULL),
('B-01', 'Single', 20000.00, 'Hall B', NULL), ('B-02', 'Single', 20000.00, 'Hall B', NULL),
('B-03', 'Single', 20000.00, 'Hall B', NULL), ('B-04', 'Single', 20000.00, 'Hall B', NULL),
('B-05', 'Single', 20000.00, 'Hall B', NULL), ('B-06', 'Single', 20000.00, 'Hall B', NULL),
('B-07', 'Single', 20000.00, 'Hall B', NULL), ('B-08', 'Single', 20000.00, 'Hall B', NULL),
('B-09', 'Single', 20000.00, 'Hall B', NULL), ('B-10', 'Single', 20000.00, 'Hall B', NULL),
('B-11', 'Single', 20000.00, 'Hall B', NULL), ('B-12', 'Single', 20000.00, 'Hall B', NULL),
('B-13', 'Single', 20000.00, 'Hall B', NULL), ('B-14', 'Single', 20000.00, 'Hall B', NULL),
('B-15', 'Single', 20000.00, 'Hall B', NULL), ('B-16', 'Single', 20000.00, 'Hall B', NULL),
('B-17', 'Single', 20000.00, 'Hall B', NULL), ('B-18', 'Single', 20000.00, 'Hall B', NULL),
('B-19', 'Single', 20000.00, 'Hall B', NULL), ('B-20', 'Single', 20000.00, 'Hall B', NULL),

-- Student Apartments (Places 44 to 55)
-- Flat 101 (3 Bedrooms)
('101A', 'Single', 20000.00, NULL, 'Flat 101'),
('101B', 'Single', 20000.00, NULL, 'Flat 101'),
('101C', 'Single', 20000.00, NULL, 'Flat 101'),
-- Flat 102 (4 Bedrooms)
('102A', 'Single', 20000.00, NULL, 'Flat 102'),
('102B', 'Single', 20000.00, NULL, 'Flat 102'),
('102C', 'Single', 20000.00, NULL, 'Flat 102'),
('102D', 'Single', 20000.00, NULL, 'Flat 102'),
-- Flat 103 (5 Bedrooms)
('103A', 'Single', 20000.00, NULL, 'Flat 103'),
('103B', 'Single', 20000.00, NULL, 'Flat 103'),
('103C', 'Single', 20000.00, NULL, 'Flat 103'),
('103D', 'Single', 20000.00, NULL, 'Flat 103'),
('103E', 'Single', 20000.00, NULL, 'Flat 103');

-- 5. Populate Courses
INSERT INTO Course (course_number, title, instructor_name, instructor_phone, email, room, department) VALUES
('CS101', 'Intro to Computer Science', 'Dr. Turing', '555-9001', 'turing@univ.edu', 'L10', 'Computer Science'),
('MA101', 'Calculus I', 'Dr. Gauss', '555-9002', 'gauss@univ.edu', 'L12', 'Mathematics');

-- 6. Populate Students
INSERT INTO Student (banner_number, first_name, last_name, address, phone, email, dob, gender, category, nationality, status, major, minor, adviser_id, course_number) VALUES
('B00001', 'Michael', 'Scott', '1 Scranton Way', '555-3001', 'michael.s@student.edu', '2005-02-15', 'M', 'Undergraduate', 'USA', 'placed', 'Business', 'Drama', 1003, 'CS101'),
('B00002', 'Pam', 'Beesly', '2 Scranton Way', '555-3002', 'pam.b@student.edu', '2004-03-25', 'F', 'Undergraduate', 'USA', 'placed', 'Art', 'Design', 1003, 'MA101'),
('B00003', 'Dwight', 'Schrute', 'Beet Farm Road', '555-3003', 'dwight.s@student.edu', '1980-01-20', 'M', 'Postgraduate', 'USA', 'waiting', 'Agriculture', 'Martial Arts', 1004, 'CS101'),
('B00004', 'Jim', 'Halpert', '3 Scranton Way', '555-3004', 'jim.h@student.edu', '2005-05-10', 'M', 'Undergraduate', 'USA', 'placed', 'Business', 'Marketing', 1004, 'CS101');

-- 7. Populate NextOfKin
INSERT INTO NextOfKin (student_banner_number, name, relationship, address, contact_phone) VALUES
('B00001', 'Holly Flax', 'Fiancé', 'Dunder Mifflin', '555-4001'),
('B00002', 'Roy Anderson', 'Ex-Fiancé', 'Warehouse', '555-4002');
-- Michael (B00001) and Pam (B00002) have NOK.
-- Dwight (B00003) and Jim (B00004) do NOT have NOK for Query (j).

-- 8. Populate Leases
-- Lease for Summer (June to August)
INSERT INTO Lease (student_banner_number, place_number, duration_semesters, enter_date, leave_date) VALUES
('B00001', 1, 1, '2026-06-01', '2026-08-30'), -- Hall A, Room 1A (Place 1)
('B00002', 23, 2, '2026-09-01', '2027-05-30'), -- Hall B, Room 2A (Place 23)
('B00004', 44, 1, '2026-09-01', '2026-12-30'); -- Flat 101, Room 101A (Place 44)

-- 9. Populate Invoices
INSERT INTO Invoice (lease_number, semester, payment_due, due_date, date_invoice_sent, date_paid, payment_method) VALUES
(1, 'Summer 2026', 80000.00, '2026-06-15', '2026-05-20', '2026-06-05', 'Credit Card'),
(2, 'Fall 2026', 80000.00, '2026-09-15', '2026-08-15', NULL, NULL), -- Unpaid invoice for Query (e)
(3, 'Fall 2026', 80000.00, '2026-09-15', '2026-08-15', '2026-09-05', 'Bank Transfer'),
(2, 'Spring 2027', 80000.00, '2027-01-15', '2026-12-15', NULL, NULL); -- Another unpaid one

-- 10. Populate Inspections
INSERT INTO Inspection (flat_number, staff_number, inspection_date, satisfactory_condition, comments) VALUES
('Flat 101', 1005, '2026-03-01', TRUE, 'All good'),
('Flat 101', 1005, '2026-04-01', FALSE, 'Needs minor plumbing repair'),
('Flat 102', 1005, '2026-04-02', FALSE, 'Broken window in bedroom 1');
