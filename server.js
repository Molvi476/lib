const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const app = express();
const port = 3000;

// Function to resolve file paths dynamically
const getFilePath = (fileName) => {
  if (process.pkg) {
    // If running from an .exe, files are bundled in the same directory as the executable
    return path.join(path.dirname(process.execPath), fileName);
  }
  // If running locally, files are in the source directory
  return path.join(__dirname, fileName);
};

// Database setup
const dbPath = getFilePath('data.db'); // SQLite database file path

// Check if the database file exists, if not create it
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

const db = new sqlite3.Database(dbPath);

// Create the users table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);
});

// Middleware to parse request bodies (for POST/PUT requests)
app.use(express.json());

// Serve static files (CSS, JS, HTML)
app.use(express.static(getFilePath('')));

// Routes for HTML pages
app.get('/', (req, res) => {
  res.sendFile(getFilePath('index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(getFilePath('Login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(getFilePath('signup.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(getFilePath('dashboard.html'));
});

// API route to add a new user
app.post('/api/users', (req, res) => {
  const { username, email } = req.body;
  db.run('INSERT INTO users (username, email) VALUES (?, ?)', [username, email], function (err) {
    if (err) {
      res.status(500).send({ error: 'Database error' });
    } else {
      res.status(201).send({ id: this.lastID, username, email });
    }
  });
});

// API route to fetch all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).send({ error: 'Database error' });
    } else {
      res.send(rows);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
