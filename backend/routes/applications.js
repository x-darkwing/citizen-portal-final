const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', applicationController.submitApplication);
router.get('/', verifyAdmin, applicationController.getAllApplications);
router.get('/:cnic', applicationController.getApplicationsByCnic);
router.put('/:id/status', verifyAdmin, applicationController.updateApplicationStatus);

module.exports = router;

