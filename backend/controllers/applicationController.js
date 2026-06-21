const { pool } = require('../db');

exports.submitApplication = async (req, res) => {
  const { fullName, cnic, phone, email, serviceType, district, additionalNotes } = req.body;
  
  if (!cnic || !serviceType) {
    return res.status(400).json({ message: 'CNIC and Service Type are required' });
  }

  const id = "APP-" + Date.now();
  
  try {
    await pool.query(
      `INSERT INTO applications (id, full_name, cnic, phone, email, service_type, district, additional_notes, status, submitted_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
      [id, fullName, cnic, phone, email, serviceType, district, additionalNotes, "Pending"]
    );
    
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.warn(err.message);
    res.status(500).json({ message: 'Error submitting application' });
  }
};

exports.getApplicationsByCnic = async (req, res) => {
  const { cnic } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT id, full_name as "fullName", cnic, phone, email, service_type as "serviceType", district, additional_notes as "additionalNotes", status, submitted_at as "submittedAt" FROM applications WHERE cnic = $1 OR id = $1 ORDER BY submitted_at DESC',
      [cnic]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No applications found for this CNIC or ID' });
    }
    
    res.json(result.rows);
  } catch (err) {
    console.warn(err.message);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name as "fullName", cnic, phone, email, service_type as "serviceType", district, additional_notes as "additionalNotes", status, submitted_at as "submittedAt" FROM applications ORDER BY submitted_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.warn(err.message);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE applications SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    console.warn(err.message);
    res.status(500).json({ message: 'Error updating status' });
  }
};
