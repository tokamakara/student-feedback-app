const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// FIXED: Better database path handling for Render
const DB_PATH = process.env.DB_PATH || 
  (process.env.NODE_ENV === 'production' ? '/tmp/feedback.db' : './database.db');

console.log('Database path:', DB_PATH);
console.log('Node environment:', process.env.NODE_ENV);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize DB
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    console.error('Full error details:', err);
  } else {
    console.log('✅ Connected to SQLite database at:', DB_PATH);
    // Create Feedback table if not exists
    db.run(`
      CREATE TABLE IF NOT EXISTS Feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentName TEXT NOT NULL,
        courseCode TEXT NOT NULL,
        comments TEXT,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('✅ Feedback table ready');
      }
    });
  }
});

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Student Feedback Backend is running!',
    database: DB_PATH,
    environment: process.env.NODE_ENV
  });
});

// POST: Add feedback
app.post('/api/feedback', (req, res) => {
  const { studentName, courseCode, comments, rating } = req.body;
  if (!studentName || !courseCode || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const sql = 'INSERT INTO Feedback (studentName, courseCode, comments, rating) VALUES (?, ?, ?, ?)';
  db.run(sql, [studentName, courseCode, comments, rating], function(err) {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// GET: Retrieve all feedback
app.get('/api/feedback', (req, res) => {
  const sql = 'SELECT * FROM Feedback';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database select error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// DELETE: Remove feedback by ID (bonus)
app.delete('/api/feedback/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Feedback WHERE id = ?';
  db.run(sql, id, function(err) {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${DB_PATH}`);
});