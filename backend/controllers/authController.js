const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const config = require('../config');

const connection = mysql.createConnection(config.dbConfig);

exports.signup = (req, res) => {
  const { email, username, password } = req.body;

  // Check if the user already exists
  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error on the server.');
    }

    // If user exists, return an error
    if (results.length > 0) {
      return res.status(400).send('User with this email already exists.');
    }

    // Hash the password and insert the new user
    const hashedPassword = bcrypt.hashSync(password, 8);
    connection.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword],
      (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Error on the server.');
        }
        res.status(201).send('User registered successfully!');
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error on the server.');
    }

    // If user does not exist, return an error
    if (results.length === 0) {
      return res.status(404).send('User not found.');
    }

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    // If password is incorrect, return an error
    if (!passwordIsValid) {
      return res.status(401).send('Invalid password.');
    }

    // Generate JWT token if credentials are valid
    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: 86400 });

    res.status(200).send({ auth: true, token });
  });
};
