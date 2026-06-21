const { pool } = require('../db');

const staticServices = [
  { id: "srv_001", name: "Birth Certificate", description: "Apply for a new birth certificate or request a duplicate.", processingTime: "7-10 working days", fee: "Rs. 200" },
  { id: "srv_002", name: "Domicile Certificate", description: "Proof of residence for the district of Mardan.", processingTime: "14 working days", fee: "Rs. 300" },
  { id: "srv_003", name: "CNIC Registration", description: "Apply for a new National Identity Card.", processingTime: "30 working days", fee: "Rs. 500" },
  { id: "srv_004", name: "Business License", description: "Register a new local business or renew existing license.", processingTime: "21 working days", fee: "Rs. 2000" },
  { id: "srv_005", name: "Property Registration", description: "Register land or property within municipal limits.", processingTime: "45 working days", fee: "Varies (percent basis)" },
  { id: "srv_006", name: "Utility Connection Request", description: "Request new water or sanitation utility connections.", processingTime: "14 working days", fee: "Rs. 1500" }
];

exports.getAllServices = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, description, processing_time as "processingTime", fee FROM services ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.warn('Database query failed, returning fallback services:', err.message);
    res.json(staticServices);
  }
};
