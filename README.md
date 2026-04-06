# University Accommodation Management System

A premium, full-stack database management dashboard built for a University Accommodation Office. This project provides a robust interface to track students, administer hall capacity, manage rent invoices, monitor property inspections, and easily maintain residence staff records.

## 🚀 Key Features

*   **Interactive Dashboard Reports:** Live, searchable metrics satisfying comprehensive database analysis (Waitlists, Student Categories, Summer Leases, and Rent Statistics).
*   **Database Management (CRUD):** Live action menus allowing rapid updating of relational data tables directly from the frontend UI.
*   **Student Registration:** Seamless "Add Student" workflow built directly into the UI mapping into the `waiting list` workflow.
*   **Modern Aesthetic:** A responsive, light-themed, high-contrast, premium glassmorphism interface.

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), JavaScript, Vanilla CSS (`index.css`), Lucide-React Icons
*   **Backend:** Node.js, Express.js
*   **Database:** MySQL (interfaced via `mysql2`)
*   **Design System:** Custom CSS Grid/Flexbox layouts mirroring professional dashboard templates.

## 📂 Project Structure
*   `/frontend/`: React components, views, utilities, and styling metrics.
*   `/server.js` & `/db.js`: Node API endpoints acting as the bridge allowing the frontend to pull specialized queries from MySQL.
*   `/schema.sql`: Raw DDL commands defining Tables, Data Types, and Foreign Key constraints.
*   `/seed.sql`: Dummy initial dataset required to generate robust statistical output during local testing.
*   `/queries.sql`: Documented storage of the core specialized SQL read queries.

---

## 💻 Local Setup & Installation

### 1. Database Configuration
1. Install and open **MySQL Workbench** (or your preferred database manager).
2. Execute the `schema.sql` file to build the relational tables.
3. Execute the `seed.sql` file to populate the application with the initial user data.

### 2. Backend Initialization
1. In the root project directory, create a `.env` file containing your specific database credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YourDatabasePasswordHere
DB_NAME=accommodation_db
```
2. Open your terminal in the root folder and run:
```bash
npm install
node server.js
```

### 3. Frontend Initialization
1. Open a *second* terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
2. Navigate to `http://localhost:3000` in your web browser.
