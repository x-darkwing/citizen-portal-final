const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');

const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const applicationsRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 3000) : 5000;


app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/applications', applicationsRoutes);

const fs = require('fs');
const distPath = path.join(__dirname, '../frontend/dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Initialize database
initDB().then(() => {
  console.log("Database initialized successfully.");
}).catch(err => {
  console.warn("Database initialization skipped. " + err.message);
});

// Always start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
