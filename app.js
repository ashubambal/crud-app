require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('❌ MySQL connection failed:', err.message);
        process.exit(1);
    }
    console.log('✅ MySQL Connected...');
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------- CRUD APIs ----------------

// Create table
app.get('/createTable', (req, res) => {
    let sql = `
      CREATE TABLE IF NOT EXISTS items(
        id INT AUTO_INCREMENT,
        name VARCHAR(255),
        PRIMARY KEY(id)
      )
    `;
    db.query(sql, (err) => {
        if (err) return res.status(500).send(err.message);
        res.send('✅ Items table created...');
    });
});

// Add item
app.post('/addItem', (req, res) => {
    const item = { name: req.body.name };
    const sql = 'INSERT INTO items SET ?';
    db.query(sql, item, (err) => {
        if (err) return res.status(500).send(err.message);
        res.send('✅ Item added...');
    });
});

// Get all items
app.get('/getItems', (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
});

// Get item by ID
app.get('/getItem/:id', (req, res) => {
    db.query('SELECT * FROM items WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Update item
app.put('/updateItem/:id', (req, res) => {
    db.query('UPDATE items SET name = ? WHERE id = ?', [req.body.name, req.params.id], (err) => {
        if (err) return res.status(500).send(err.message);
        res.send('✅ Item updated...');
    });
});

// Delete item
app.delete('/deleteItem/:id', (req, res) => {
    db.query('DELETE FROM items WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err.message);
        res.send('✅ Item deleted...');
    });
});

// ---------------- Extra Features ----------------

// Search items by name
app.get('/search/:name', (req, res) => {
    db.query('SELECT * FROM items WHERE name LIKE ?', [`%${req.params.name}%`], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
});

// Count total items
app.get('/countItems', (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM items', (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result[0]);
    });
});

// Pagination
app.get('/itemsPage', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    db.query('SELECT * FROM items LIMIT ? OFFSET ?', [limit, offset], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
});

// Delete all items
app.delete('/clearItems', (req, res) => {
    db.query('DELETE FROM items', (err) => {
        if (err) return res.status(500).send(err.message);
        res.send('✅ All items deleted...');
    });
});

// Sort items
app.get('/sortItems/:field', (req, res) => {
    const field = req.params.field;
    if (!['id', 'name'].includes(field)) {
        return res.status(400).send('❌ Invalid sort field');
    }
    db.query(`SELECT * FROM items ORDER BY ${field} ASC`, (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.json(results);
    });
});

// ---------------- Start server ----------------
if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`);
    });
}

module.exports = app; // ✅ Export app for Jest tests
