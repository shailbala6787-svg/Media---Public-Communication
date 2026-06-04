const express = require('express');
const router = express.Router();
const { getDashboardStats: getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getStats);

module.exports = router;
