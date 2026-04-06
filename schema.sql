-- University Accommodation Office Database Schema (Group 1)
-- ---------------------------------------------------------
-- This script creates all necessary tables for the management system.
-- Enforcing 3rd Normal Form (3NF) and referential integrity.

CREATE DATABASE IF NOT EXISTS accommodation_db;
USE accommodation_db;

-- 1. Staff Table (Residence Staff and Advisers)
CREATE TABLE Staff (
    staff_number INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(255),
    dob DATE NOT NULL,
    gender ENUM('M', 'F', 'Other') NOT NULL,
    position VARCHAR(50), -- e.g., 'Hall Manager', 'Adviser', 'Cleaner'
    location VARCHAR(50), -- e.g., 'Hall A', 'Office 101'
    department VARCHAR(50), -- e.g., 'Management', 'Student Services'
    telephone VARCHAR(15),
    room_number VARCHAR(10)
);

-- 2. Course Table
CREATE TABLE Course (
    course_number VARCHAR(20) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    instructor_name VARCHAR(100),
    instructor_phone VARCHAR(15),
    email VARCHAR(100),
    room VARCHAR(20),
    department VARCHAR(100)
);

-- 3. Student Table
CREATE TABLE Student (
    banner_number VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(15),
    email VARCHAR(100) UNIQUE NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('M', 'F', 'Other') NOT NULL,
    category ENUM('Undergraduate', 'Postgraduate') NOT NULL,
    nationality VARCHAR(50),
    special_needs TEXT,
    comments TEXT,
    status ENUM('waiting', 'placed') DEFAULT 'waiting',
    major VARCHAR(100),
    minor VARCHAR(100),
    adviser_id INT,
    course_number VARCHAR(20),
    FOREIGN KEY (adviser_id) REFERENCES Staff(staff_number),
    FOREIGN KEY (course_number) REFERENCES Course(course_number)
);

-- 4. NextOfKin Table (1:1 relationship with Student)
CREATE TABLE NextOfKin (
    student_banner_number VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    contact_phone VARCHAR(15) NOT NULL,
    FOREIGN KEY (student_banner_number) REFERENCES Student(banner_number) ON DELETE CASCADE
);

-- 5. HallOfResidence Table
CREATE TABLE HallOfResidence (
    hall_name VARCHAR(100) PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    telephone VARCHAR(15),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES Staff(staff_number)
);

-- 6. StudentApartment Table
CREATE TABLE StudentApartment (
    flat_number VARCHAR(20) PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    available_bedrooms INT DEFAULT 4,
    CONSTRAINT chk_bedrooms CHECK (available_bedrooms IN (3, 4, 5))
);

-- 7. Room Table (Place Number identifies room across all buildings)
CREATE TABLE Room (
    place_number INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) NOT NULL,
    room_type ENUM('Single', 'Double', 'Suite') DEFAULT 'Single',
    monthly_rent DECIMAL(10, 2) NOT NULL,
    hall_name VARCHAR(100),
    flat_number VARCHAR(20),
    FOREIGN KEY (hall_name) REFERENCES HallOfResidence(hall_name) ON DELETE CASCADE,
    FOREIGN KEY (flat_number) REFERENCES StudentApartment(flat_number) ON DELETE CASCADE,
    -- A room must belong to either a Hall or a Flat, but usually not both simultaneously
    CONSTRAINT chk_location CHECK ((hall_name IS NOT NULL AND flat_number IS NULL) OR (hall_name IS NULL AND flat_number IS NOT NULL))
);

-- 8. Lease Table
CREATE TABLE Lease (
    lease_number INT PRIMARY KEY AUTO_INCREMENT,
    student_banner_number VARCHAR(20) NOT NULL,
    place_number INT NOT NULL,
    duration_semesters INT DEFAULT 1,
    enter_date DATE NOT NULL,
    leave_date DATE NOT NULL,
    FOREIGN KEY (student_banner_number) REFERENCES Student(banner_number),
    FOREIGN KEY (place_number) REFERENCES Room(place_number)
);

-- 9. Invoice Table
CREATE TABLE Invoice (
    invoice_number INT PRIMARY KEY AUTO_INCREMENT,
    lease_number INT NOT NULL,
    semester VARCHAR(20) NOT NULL, -- e.g., 'Fall 2026'
    payment_due DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    date_invoice_sent DATE,
    date_paid DATE,
    payment_method VARCHAR(50), -- e.g., 'Credit Card', 'Bank Transfer'
    reminder_1_date DATE,
    reminder_2_date DATE,
    FOREIGN KEY (lease_number) REFERENCES Lease(lease_number) ON DELETE CASCADE
);

-- 10. Inspection Table
CREATE TABLE Inspection (
    inspection_id INT PRIMARY KEY AUTO_INCREMENT,
    flat_number VARCHAR(20) NOT NULL,
    staff_number INT NOT NULL,
    inspection_date DATE NOT NULL,
    satisfactory_condition BOOLEAN DEFAULT TRUE,
    comments TEXT,
    FOREIGN KEY (flat_number) REFERENCES StudentApartment(flat_number),
    FOREIGN KEY (staff_number) REFERENCES Staff(staff_number)
);

-- Indices for performance on recurring queries
CREATE INDEX idx_student_status ON Student(status);
CREATE INDEX idx_lease_dates ON Lease(enter_date, leave_date);
CREATE INDEX idx_invoice_status ON Invoice(date_paid);
