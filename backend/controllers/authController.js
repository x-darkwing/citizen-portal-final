const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) return res.status(400).json({ message: 'All fields required' });

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const id = Date.now().toString();
    await pool.query(
      'INSERT INTO users (id, full_name, email, password) VALUES ($1, $2, $3, $4)',
      [id, fullName, email, password]
    );

    const token = jwt.sign({ id, email }, SECRET_KEY, { expiresIn: '24h' });
    res.status(201).json({ token, message: 'Registration successful' });
  } catch (err) {
    console.warn(err.message);
    res.status(500).json({ message: 'Database error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.warn(err.message);
    res.status(500).json({ message: 'Database error' });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD && ADMIN_EMAIL && ADMIN_PASSWORD) {
    const token = jwt.sign({ id: 'admin', email: 'admin', role: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
    return res.json({ token, message: 'Admin login successful' });
  }
  return res.status(401).json({ message: 'Invalid admin credentials' });
};
