const express = require('express');
const router = express.Router();
const { generateContent } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

router.post('/generate', protect, authorize('admin', 'editor'), generateContent);

module.exports = router;
