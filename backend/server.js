const express = require('express');
const app = express();
const database = require('./database');

app.use(express.json());

const PORT = 3001;
const DB_USER = 'admin';
const DB_PASSWORD = 'password123';

app.get('/users', (req, res) => {
  database.getAllUsers((err, users) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Database error');
    }
    
    res.json(users);
  });
});

app.listen(PORT);
console.log(`Server running on port ${PORT}`);