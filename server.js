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
            SELECT h.hall_name, s.staff_number, s.first_name, s.last_name, s.telephone
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
        res.json(rows.length > 0 ? [rows[0]] : []);
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

// Students in a particular flat (Extension of query g)
app.get('/api/reports/flat-students/:flat_number', async (req, res) => {
    try {
        const { flat_number } = req.params;
        const [rows] = await db.query(`
            SELECT s.first_name, s.last_name, s.banner_number, r.room_number, r.place_number
            FROM Student s
            JOIN Lease l ON s.banner_number = l.student_banner_number
            JOIN Room r ON l.place_number = r.place_number
            WHERE r.flat_number = ?
        `, [flat_number]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Available rooms in a given hall (User Addition)
app.get('/api/reports/free-rooms/:hall_name', async (req, res) => {
    try {
        const { hall_name } = req.params;
        const [rows] = await db.query(`
            SELECT room_number, place_number, monthly_rent
            FROM Room
            WHERE hall_name = ? 
              AND place_number NOT IN (
                  SELECT place_number FROM Lease 
                  WHERE CURDATE() BETWEEN enter_date AND leave_date
              )
        `, [hall_name]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Available flats in the system (User Addition)
app.get('/api/reports/free-flats', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT flat_number, room_number, place_number, monthly_rent
            FROM Room
            WHERE flat_number IS NOT NULL
              AND place_number NOT IN (
                  SELECT place_number FROM Lease 
                  WHERE CURDATE() BETWEEN enter_date AND leave_date
              )
        `);
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
        res.json(rows.length > 0 ? [rows[0]] : []);
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

// Add a new Student with Auto-Allocator sequence
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

        // 1. Insert Student (Defaulting to waiting)
        await db.query(`
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

        // 2. Attempt Auto-Allocation
        const [freeRooms] = await db.query(`
            SELECT place_number, monthly_rent FROM Room 
            WHERE place_number NOT IN (
                SELECT place_number FROM Lease WHERE CURDATE() BETWEEN enter_date AND leave_date
            ) LIMIT 1
        `);

        if (freeRooms.length > 0) {
            const room = freeRooms[0];
            
            // a. Create Lease (1 Semester = ~6 Months)
            const [leaseResult] = await db.query(`
                INSERT INTO Lease (student_banner_number, place_number, duration_semesters, enter_date, leave_date)
                VALUES (?, ?, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 6 MONTH))
            `, [banner_number, room.place_number]);

            const leaseNumber = leaseResult.insertId;

            // b. Create Invoice (Rent * 4 Months)
            await db.query(`
                INSERT INTO Invoice (lease_number, semester, payment_due, due_date, date_invoice_sent)
                VALUES (?, 'Current Semester', ?, DATE_ADD(CURDATE(), INTERVAL 1 MONTH), CURDATE())
            `, [leaseNumber, room.monthly_rent * 4]);

            // c. Update status to placed
            await db.query(`UPDATE Student SET status = 'placed' WHERE banner_number = ?`, [banner_number]);

            return res.status(201).json({ message: `Student registered and AUTO-PLACED in Place: ${room.place_number}`, banner_number });
        }

        res.status(201).json({ message: 'Student registered successfully (Added to Waiting List)', banner_number });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Student with this Banner Number or Email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// --- GENERIC UPDATE (Reports) ---
app.put('/api/reports/:reportId/:id', async (req, res) => {
    const { reportId, id } = req.params;
    const data = req.body;
    
    try {
        let tableName = '';
        let idColumn = '';
        let updateData = {};

        // Route the update to the correct base table and primary key based on report context
        if (reportId === 'waiting-list' || reportId === 'missing-next-of-kin') {
            tableName = 'Student'; idColumn = 'banner_number';
            if(data.first_name) updateData.first_name = data.first_name;
            if(data.last_name) updateData.last_name = data.last_name;
            if(data.email) updateData.email = data.email;
            if(data.category) updateData.category = data.category;
            if(data.major) updateData.major = data.major;
        } else if (reportId === 'senior-staff' || reportId === 'hall-managers') {
            tableName = 'Staff'; 
            idColumn = reportId === 'hall-managers' ? 'staff_number' : 'staff_number';
            // Wait, for hall-managers we show manager ID but the view doesn't explicitly expose manager_id? It does implicitly.
            updateData = { location: data.location, telephone: data.telephone, first_name: data.first_name };
        } else if (reportId === 'unsatisfactory-inspections') {
            tableName = 'Inspection'; idColumn = 'inspection_id';
            updateData = { comments: data.comments, satisfactory_condition: data.satisfactory_condition === 'true' || data.satisfactory_condition === 1 };
        } else if (reportId === 'student-leases' || reportId === 'summer-leases') {
            tableName = 'Lease'; idColumn = 'lease_number';
            if(data.duration_semesters) updateData.duration_semesters = data.duration_semesters;
            if(data.enter_date) updateData.enter_date = data.enter_date.split('T')[0];
            if(data.leave_date) updateData.leave_date = data.leave_date.split('T')[0];
        } else {
            return res.status(400).json({ error: 'Update not supported for this report type.' });
        }

        // Clean out undefined data
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        if (Object.keys(updateData).length === 0) return res.json({ message: 'No valid fields to update' });
        
        // Execute dynamic UPDATE
        await db.query(`UPDATE ${tableName} SET ? WHERE ${idColumn} = ?`, [updateData, id]);
        res.json({ message: 'Record updated successfully' });
    } catch (err) {
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
