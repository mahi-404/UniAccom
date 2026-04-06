const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// (a) Hall managers report
app.get('/api/reports/hall-managers', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT h.hall_name, s.first_name, s.last_name, s.telephone
            FROM HallOfResidence h
            JOIN Staff s ON h.manager_id = s.staff_number
            ORDER BY h.hall_name
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (b) Student leases report
app.get('/api/reports/student-leases', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.first_name, s.last_name, s.banner_number, l.lease_number, l.enter_date, l.leave_date, l.duration_semesters
            FROM Student s
            JOIN Lease l ON s.banner_number = l.student_banner_number
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (c) Summer leases report
app.get('/api/reports/summer-leases', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM Lease
            WHERE lease_number IN (SELECT lease_number FROM Invoice WHERE semester LIKE 'Summer%')
               OR (MONTH(enter_date) <= 8 AND MONTH(leave_date) >= 6)
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (d) Total rent paid by a given student
app.get('/api/reports/total-rent/:banner_number', async (req, res) => {
    try {
        const { banner_number } = req.params;
        const [rows] = await db.query(`
            SELECT s.first_name, s.last_name, SUM(i.payment_due) AS total_rent_paid
            FROM Student s
            JOIN Lease l ON s.banner_number = l.student_banner_number
            JOIN Invoice i ON l.lease_number = i.lease_number
            WHERE s.banner_number = ? AND i.date_paid IS NOT NULL
            GROUP BY s.banner_number, s.first_name, s.last_name
        `, [banner_number]);
        res.json(rows[0] || { message: 'No rent paid records found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (e) Unpaid invoices report by a given date
app.get('/api/reports/unpaid-invoices', async (req, res) => {
    try {
        const { date } = req.query; // e.g., ?date=2026-10-01
        if (!date) return res.status(400).json({ error: 'Date parameter is required' });
        
        const [rows] = await db.query(`
            SELECT s.first_name, s.last_name, i.invoice_number, i.payment_due, i.due_date
            FROM Student s
            JOIN Lease l ON s.banner_number = l.student_banner_number
            JOIN Invoice i ON l.lease_number = i.lease_number
            WHERE i.date_paid IS NULL AND i.due_date <= ?
        `, [date]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (f) Unsatisfactory condition inspections
app.get('/api/reports/unsatisfactory-inspections', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM Inspection
            WHERE satisfactory_condition = FALSE
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (g) Students in a particular hall
app.get('/api/reports/hall-students/:hall_name', async (req, res) => {
    try {
        const { hall_name } = req.params;
        const [rows] = await db.query(`
            SELECT s.first_name, s.last_name, s.banner_number, r.room_number, r.place_number
            FROM Student s
            JOIN Lease l ON s.banner_number = l.student_banner_number
            JOIN Room r ON l.place_number = r.place_number
            WHERE r.hall_name = ?
        `, [hall_name]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (h) Waiting list students
app.get('/api/reports/waiting-list', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM Student
            WHERE status = 'waiting'
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (i) Student count by category
app.get('/api/reports/student-categories', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT category, COUNT(*) as student_count
            FROM Student
            GROUP BY category
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (j) Missing next-of-kin report
app.get('/api/reports/missing-next-of-kin', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.first_name, s.last_name, s.banner_number
            FROM Student s
            LEFT JOIN NextOfKin n ON s.banner_number = n.student_banner_number
            WHERE n.student_banner_number IS NULL
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (k) Student adviser report
app.get('/api/reports/student-adviser/:banner_number', async (req, res) => {
    try {
        const { banner_number } = req.params;
        const [rows] = await db.query(`
            SELECT s.first_name AS student_first, s.last_name AS student_last, 
                   st.first_name AS adviser_first, st.last_name AS adviser_last, st.telephone
            FROM Student s
            JOIN Staff st ON s.adviser_id = st.staff_number
            WHERE s.banner_number = ?
        `, [banner_number]);
        res.json(rows[0] || { message: 'Adviser not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (l) Rent statistics report
app.get('/api/reports/rent-stats', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT MIN(monthly_rent) as min_rent, MAX(monthly_rent) as max_rent, AVG(monthly_rent) as avg_rent
            FROM Room
            WHERE hall_name IS NOT NULL
        `);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (m) Hall places report
app.get('/api/reports/hall-places', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT hall_name, COUNT(*) as total_places
            FROM Room
            WHERE hall_name IS NOT NULL
            GROUP BY hall_name
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (n) Senior staff report
app.get('/api/reports/senior-staff', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT staff_number, first_name, last_name, 
                   TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age, 
                   location
            FROM Staff
            WHERE TIMESTAMPDIFF(YEAR, dob, CURDATE()) > 60
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NEW RECORD CREATION ---

// Add a new Student
app.post('/api/students', async (req, res) => {
    try {
        const { 
            banner_number, first_name, last_name, email, dob, gender, category,
            address, phone, nationality, special_needs, comments, status, major, minor, adviser_id, course_number
        } = req.body;

        // Basic validation for required fields
        if (!banner_number || !first_name || !last_name || !email || !dob || !gender || !category) {
            return res.status(400).json({ error: 'Missing required student fields' });
        }

        const [result] = await db.query(`
            INSERT INTO Student (
                banner_number, first_name, last_name, email, dob, gender, category,
                address, phone, nationality, special_needs, comments, status, major, minor, adviser_id, course_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            banner_number, first_name, last_name, email, dob, gender, category,
            address || null, phone || null, nationality || null, special_needs || null, 
            comments || null, status || 'waiting', major || null, minor || null, 
            adviser_id || null, course_number || null
        ]);

        res.status(201).json({ message: 'Student created successfully', banner_number });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Student with this Banner Number or Email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Basic endpoint to check if server is running
app.get('/', (req, res) => {
    res.send('University Accommodation API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
