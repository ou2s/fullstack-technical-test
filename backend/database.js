const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./users.db');

// Initialize the database
db.serialize(() => {
  db.run('DROP TABLE IF EXISTS user_details');
  db.run('DROP TABLE IF EXISTS users');
  
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE user_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      address TEXT,
      phone TEXT,
      department TEXT,
      hire_date TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
  

  let stmt = db.prepare('INSERT INTO users (name, email, role) VALUES (?, ?, ?)');
  stmt.run('John Doe', 'john@example.com', 'admin');
  stmt.run('Jane Smith', 'jane@example.com', 'user');
  stmt.run('Bob Johnson', 'bob@example.com', 'user');
  stmt.run('Alice Williams', 'alice@example.com', 'manager');
  stmt.run('Charlie Brown', 'charlie@example.com', 'user');
  stmt.finalize();
  
  stmt = db.prepare('INSERT INTO user_details (user_id, address, phone, department, hire_date) VALUES (?, ?, ?, ?, ?)');
  stmt.run(1, '123 Main St, City', '555-1234', 'IT', '2020-01-15');
  stmt.run(2, '456 Oak Ave, Town', '555-5678', 'HR', '2021-03-20');
  stmt.run(3, '789 Pine Rd, Village', '555-9012', 'Marketing', '2019-11-05');
  stmt.run(4, '101 Elm St, County', '555-3456', 'Finance', '2022-06-10');
  stmt.run(5, '202 Maple Dr, District', '555-7890', 'Sales', '2020-09-25');
  stmt.finalize();
});

// Database methods
const database = {
  getAllUsers: function(callback) {
    db.all('SELECT * FROM users', callback);
  },
  
  getUserDetails: function(userId, callback) {
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) return callback(err);
      if (!user) return callback(new Error('User not found'));
      
      db.get('SELECT * FROM user_details WHERE user_id = ?', [userId], (err, details) => {
        if (err) return callback(err);
        
        callback(null, { ...user, details: details || {} });
      });
    });
  }

};

module.exports = database;